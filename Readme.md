Date input via date, month & year select fields
===============================================

[![Build Status](https://travis-ci.org/sambs/angular-sb-date-select.png?branch=master)](https://travis-ci.org/sambs/angular-sb-date-select)

 - Reads and writes ISO 8601 date strings (YYYY-MM-DD) to your model
 - Supports min and max attrs
 - Depends on Moment.js
 - Plays nicely with Moment's language packs for internationalization - see the [Moment.js docs](http://momentjs.com/docs/#/i18n/)

Usage
-----
```html
<div sb-date-select sb-select-class="form-control" min="2008-11-24" max="2016-01-01" ng-model="obj.myDateModel"></div>
```

Its advised not to use this directive on an input or select element to avoid confict regarding ngModel.$render. Also be aware that a new scope is created, so remember the best practice of always having a dot in your ng-model attrs.

[Example](http://sambs.github.io/angular-sb-date-select/)

License
-------

Licensed under the MIT License

