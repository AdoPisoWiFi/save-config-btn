# AdoPisoWiFi Save Config Button

## Install

NPM:
```shell
$ npm i @adopisowifi/save-config-btn --save

```
Bower:
```shell
$ bower install --save ado-save-config-btn

```

## Usage

Include as module dependency to your app:
```javascript
var app = angular.module('App', [

  'ado.save-config-btn'

])
```

Set where to submit data using `saveConfigBtnServiceProvider`:
```javascript
app.config(['saveConfigBtnServiceProvider', function(saveConfigBtnServiceProvider) {

  saveConfigBtnServiceProvider.config({
    method: 'POST',
    url: '/settings/config',
    params: {}
  });

}]);

```

HTML usage:
```html
<save-config-btn
  config="{max_bandwidth_down: 1024}"
  btn-class="btn-primary"
  ng-disabled="myForm.$invalid">
    Save Changes
</save-config-btn>

```
