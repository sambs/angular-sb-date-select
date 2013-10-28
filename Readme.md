An angular datepicker directive for ivo.

Works with ISO 8601 date strings.

*Important!* Datefield only works properly if the ng-model attr is object property, not a direct property of the $scope, due to scoping issues (which is also the reason for using scope: true in the directive instead of passing through more attributes.

We're only using these modules from angular-ui-utils:
  - modules/keypress/keypress.js

### To Do
- Dont use on mobiles
- Validation, especially for inbuilt pickers
- Keyboard selection of date
- Month & year view
