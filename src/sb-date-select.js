/* global moment */

angular.module('sbDateSelect', [])

  .directive('sbDateSelect', [function () {

    var template = [
      '<div class="sb-date-select">',
        '<select class="sb-date-select-day sb-date-select-select" ng-class="selectClass" ng-model="date", ng-options="d for d in dates track by d">',
          '<option value disabled selected>Day</option>',
        '</select>',
        '<select class="sb-date-select-month sb-date-select-select" ng-class="selectClass" ng-model="month", ng-options="m.value as m.name for m in months">',
          '<option value disabled>Month</option>',
        '</select>',
        '<select class="sb-date-select-year sb-date-select-select" ng-class="selectClass" ng-model="year" ng-options="y for y in years">',
          '<option value disabled selected>Year</option>',
        '</select>',
      '</div>'
    ];

    return {
      restrict: 'A',
      replace: true,
      template: template.join(''),
      require: 'ngModel',
      scope: {
        selectClass: '@sbSelectClass'
      },

      link: function(scope, elem, attrs, model) {
        var min = scope.min = moment(attrs.min || '1900-01-01');
        var max = scope.max = moment(attrs.max); // Defaults to now

        scope.years = [];

        for (var i=max.year(); i>=min.year(); i--) {
          scope.years.push(i);
        }

        scope.$watch('year', function () {
          updateMonthOptions();
        });

        scope.$watchCollection('[month, year]', function () {
          updateDateOptions();
        });

        scope.$watchCollection('[date, month, year]', function () {
          if (scope.year && scope.month && scope.date) {
            var m = moment([scope.year, scope.month-1, scope.date]);
            model.$setViewValue(m.format('YYYY-MM-DD'));
          }
          else {
            model.$setViewValue();
          }
        });

        function updateMonthOptions () {
          // Values begin at 1 to permit easier boolean testing
          scope.months = [];

          var minMonth = scope.year && min.isSame([scope.year], 'year') ? min.month() : 0;
          var maxMonth = scope.year && max.isSame([scope.year], 'year') ? max.month() : 11;

          var monthNames = moment.months();

          for (var j=minMonth; j<=maxMonth; j++) {
            scope.months.push({
              name: monthNames[j],
              value: j+1
            });
          }

          if (scope.month-1 > maxMonth || scope.month-1 < minMonth) delete scope.month;
        }

        function updateDateOptions (year, month) {
          var minDate, maxDate;

          if (scope.year && scope.month && min.isSame([scope.year, scope.month-1], 'month')) {
            minDate = min.date();
          } else {
            minDate = 1;
          }

          if (scope.year && scope.month && max.isSame([scope.year, scope.month-1], 'month')) {
            maxDate = max.date();
          } else if (scope.year && scope.month) { 
            maxDate = moment([scope.year, scope.month-1]).daysInMonth();
          } else {
            maxDate = 31;
          }

          scope.dates = [];

          for (var i=minDate; i<=maxDate; i++) {
            scope.dates.push(i);
          }
          if (scope.date < minDate || scope.date > maxDate) delete scope.date;
        }

        model.$render = function() {
          if (!model.$viewValue) return;

          var m = moment(model.$viewValue);

          scope.year = m.year();
          scope.month = m.month() + 1;
          scope.date = m.date();
        };
      }
    };
  }]);

