/* global moment */

angular.module('dateSelect', [])

  .directive('dateSelect', [function () {
    var template = [
      '<div class="date-select">',
        '<select ng-model="day" ng-options="d for d in days">',
          '<option value="">Day</option>',
        '</select>',
        '<select ng-model="month" ng-options="m.value as m.name for m in months">',
          '<option value="">Month</option>',
        '</select>',
        '<select ng-model="year" ng-options="y for y in years">',
          '<option value="">Year</option>',
        '</select>',
      '</div>'
    ];

    function makeYears () {
      var years = [];
      var maxYear = moment().year() - 16;

      for (var i=maxYear; i>1900; i--) {
        years.push(i);
      }

      return years;
    }
        
    function makeMonths () {
      // We're starting months from 1 rather than 0 to permit easier boolean testing
      var months = [];
      var monthNames = moment.months();

      for (var j=0; j<monthNames.length; j++) {
        months.push({
          name: monthNames[j],
          value: j+1
        });
      }

      return months;
    }

    function makeDays (year, month) {
      var numDays = year && month ? moment([year, month-1]).daysInMonth() : 31;

      var days = [];

      for (var i=0; i<numDays; i++) {
        days.push(i+1);
      }

      return days;
    }

    return {
      restrict: 'A',
      replace: true,
      template: template.join(''),
      require: 'ngModel',
      scope: true,

      link: function($scope, $element, attrs, model) {

        $scope.years = makeYears(); 
        $scope.months = makeMonths();

        $scope.$watchCollection('[month, year]', function () {
          $scope.days = makeDays($scope.year, $scope.month);
          if ($scope.day > $scope.days.length) delete $scope.day;
        });

        $scope.$watchCollection('[day, month, year]', function () {
          if ($scope.year && $scope.month && $scope.day) {
            var m = moment([$scope.year, $scope.month-1, $scope.day]);
            model.$setViewValue(m.toDate());
          }
          else {
            model.$setViewValue();
          }
        });

        // model -> view
        model.$render = function() {
          if (!model.$viewValue) return;

          var m = moment(model.$viewValue);

          $scope.day = m.day();
          $scope.month = m.month();
          $scope.year = m.year();
        };
      }
    };
  }]);
  
