
describe('dateSelect directive', function () {

  beforeEach(module('sbDateSelect'));

  var rootScope, compile, form, scope;

  function compileToForm(html) {
    form = $('<form name="form">'+html+'</form>');
    compile(form)(rootScope);
    rootScope.obj = {};
    rootScope.$digest();
    scope = form.find('.sb-date-select').isolateScope();
  }

  beforeEach(inject(function($injector) {
    compile = $injector.get('$compile');
    rootScope = $injector.get('$rootScope');
  }));

  it('should replace element with three select inputs', function() {
    compileToForm('<div sb-date-select ng-model="obj.mydate"></div>');
    expect(form.find('select').length).toBe(3);
  });

  it('should update model only when year, month & date have been select', function() {
    compileToForm('<div sb-date-select ng-model="obj.mydate" name="mydate"></div>');

    scope.val.year = 1999;
    scope.val.month = 8;
    rootScope.$digest();
    expect(rootScope.obj.mydate).toBe(undefined);

    scope.val.date = 25;
    rootScope.$digest();
    expect(rootScope.obj.mydate).toBe('1999-08-25');

    delete scope.val.month;
    rootScope.$digest();
    expect(rootScope.obj.mydate).toBe(undefined);
  });

  it('should have min default of 1900-01-01', function() {
    compileToForm('<div sb-date-select ng-model="obj.mydate"></div>');
    expect(moment('1900-01-01').isSame(scope.min, 'day')).toBe(true);
  });

  it('should have max default of today', function() {
    compileToForm('<div sb-date-select ng-model="obj.mydate"></div>');
    expect(moment().isSame(scope.max, 'day')).toBe(true);
  });

  it('should display all years between min and max', function() {
    compileToForm('<div sb-date-select ng-model="obj.mydate"></div>');
    expect(scope.years[0]).toBe(moment().year());
    expect(scope.years[scope.years.length-1]).toBe(1900);
  });

  it('should display all years between min and max', function() {
    compileToForm('<div sb-date-select min="1990-05-10" max="1999-08-24" ng-model="obj.mydate"></div>');
    expect(scope.years[0]).toBe(1999);
    expect(scope.years[scope.years.length-1]).toBe(1990);
  });

  it('should display all months if no year selected', function() {
    compileToForm('<div sb-date-select min="1990-05-10" max="1999-08-24" ng-model="obj.mydate"></div>');
    expect(scope.months.length).toBe(12);
  });

  it('should only display permitted months', function() {
    compileToForm('<div sb-date-select min="1990-05-10" max="1999-08-24" ng-model="obj.mydate"></div>');

    scope.val.year = 1990;
    rootScope.$digest();
    expect(scope.months[0].value).toBe(5);
    expect(scope.months.length).toBe(8);

    scope.val.year = 1999;
    rootScope.$digest();
    expect(scope.months[scope.months.length-1].value).toBe(8);
    expect(scope.months.length).toBe(8);
  });

  it('should deselect month if year choice makes it invalid', function() {
    compileToForm('<div sb-date-select min="1990-05-10" max="1999-08-24" ng-model="obj.mydate"></div>');

    scope.val.month = 4;
    rootScope.$digest();
    expect(scope.val.month).toBe(4);

    scope.val.year = 1990;
    rootScope.$digest();
    expect(scope.val.month).toBe(undefined);
  });

  it('should display 31 dates if year and month not selected', function() {
    compileToForm('<div sb-date-select ng-model="obj.mydate"></div>');
    expect(scope.dates.length).toBe(31);
  });

  it('should display the right amount of dates for a selected year and month', function() {
    compileToForm('<div sb-date-select ng-model="obj.mydate"></div>');

    scope.val.year = 2013;
    scope.val.month = 2;
    rootScope.$digest();
    expect(scope.dates.length).toBe(28);

    scope.val.year = 2012;
    scope.val.month = 2;
    rootScope.$digest();
    expect(scope.dates.length).toBe(29);
  });

  it('should only display permitted dates', function() {
    compileToForm('<div sb-date-select min="1990-05-10" max="1999-08-24" ng-model="obj.mydate"></div>');

    scope.val.year = 1990;
    scope.val.month = 5;
    rootScope.$digest();
    expect(scope.dates[0]).toBe(10);
    expect(scope.dates[scope.dates.length-1]).toBe(31);

    scope.val.year = 1999;
    scope.val.month = 8;
    rootScope.$digest();
    expect(scope.dates[0]).toBe(1);
    expect(scope.dates[scope.dates.length-1]).toBe(24);
  });

  it('should deselect date if month choice makes it invalid', function() {
    compileToForm('<div sb-date-select min="1990-05-10" max="1999-08-24" ng-model="obj.mydate"></div>');

    scope.val.date = 25;
    rootScope.$digest();
    expect(scope.val.date).toBe(25);

    scope.val.year = 1999;
    scope.val.month = 8;
    rootScope.$digest();
    expect(scope.val.date).toBe(undefined);
  });

  it('shouldnt deselect valid dates', function() {
    compileToForm('<div sb-date-select min="1990-05-20" max="1999-08-24" ng-model="obj.mydate"></div>');

    rootScope.obj.mydate = '1990-05-20';
    rootScope.$digest();
    expect(scope.val.date).toBe(20);
    expect(scope.val.month).toBe(05);
    expect(scope.val.year).toBe(1990);

    rootScope.obj.mydate = '1999-08-24';
    rootScope.$digest();
    expect(scope.val.date).toBe(24);
    expect(scope.val.month).toBe(08);
    expect(scope.val.year).toBe(1999);
  });
});
