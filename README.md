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

Set where to submit data using `adoConfigSerivceProvider`:
```javascript
app.config(['adoConfigSerivceProvider', function(adoConfigSerivceProvider) {

  // defaults
  adoConfigSerivceProvider.config({
    get_method: 'GET',
    get_url: '/settings/config',
    get_params: {},
    post_method: 'POST',
    post_url: '/settings/config',
    post_params: {}
  });

}]);

```
Catch broadcast events:

```javascript
app.run(['$rootScope', function ($rootScope) {
  $rootScope.$on('settings:updated', function (newConfig) {
    console.log(newConfig);
  });
  
  $rootScope.$on('settings:update:failed', function (res) {
    console.log(res);
  });
}]);
```

HTML usage:
```html
<save-config-btn
  config="{max_bandwidth_down: 1024}"
  btn-class="btn-primary"
  ng-disabled="myForm.$invalid"
  onSuccess="$ctrl.onSuccess"
  onError="$ctrl.onError">
    Save Changes
</save-config-btn>

```

