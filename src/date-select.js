/* global moment */

angular.module('dateSelect', [])

  .directive('dateSelect', [function () {
    var template = [
      '<div class="date-select">',
        '<select ng-model="val.date", ng-options="d for d in dates">', 
          '<option value disabled selected>Day</option>',
        '</select>',
        '<select ng-model="val.month", ng-options="m.value as m.name for m in months">', 
          '<option value disabled>Month</option>',
        '</select>',
        '<select ng-model="val.year" ng-options="y for y in years">', 
          '<option value disabled selected>Year</option>',
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

    function makeDates (year, month) {
      var numDates = year && month ? moment([year, month-1]).daysInMonth() : 31;

      var dates = [];

      for (var i=0; i<numDates; i++) {
        dates.push(i+1);
      }

      return dates;
    }

    return {
      restrict: 'A',
      replace: true,
      template: template.join(''),
      require: 'ngModel',
      scope: true,

      link: function($scope, $element, attrs, model) {
        $scope.val = {};

        $scope.years = makeYears();
        $scope.months = makeMonths();

        $scope.$watchCollection('[val.month, val.year]', function () {
          $scope.dates = makeDates($scope.val.year, $scope.val.month);
          if ($scope.val.date > $scope.dates.length) delete $scope.val.date;
        });

        $scope.$watchCollection('[val.date, val.month, val.year]', function () {
          if ($scope.val.year && $scope.val.month && $scope.val.date) {
            var m = moment([$scope.val.year, $scope.val.month-1, $scope.val.date]);
            model.$setViewValue(m.format('YYYY-MM-DD'));
          }
          else {
            model.$setViewValue();
          }
        });

        // model -> view
        model.$render = function() {
          if (!model.$viewValue) return;

          var m = moment(model.$viewValue);

          // Use an object to work around annoying angular scope issues
          // inconjunction with custom-select directive
          $scope.val = {
            date: m.date(),
            month: m.month()+1,
            year: m.year()
          };
        };
      }
    };
  }]);

