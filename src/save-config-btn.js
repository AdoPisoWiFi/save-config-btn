
(function () {
  'use strict';

  angular.module('ado.save-config-btn', [
    'toastr',
    'ado.http-error'
  ])
    .provider('adoConfigService', function() {

      var provider = {};
      var globalConfig = {
        get_params: {},
        get_method: 'GET',
        get_url: '/settings/config',
        post_params: {},
        post_method: 'POST',
        post_url: '/settings/config'
      };

      provider.config = function (config) {
        angular.extend(globalConfig, config);
      };

      provider.$get = [
        '$http',
        '$q',
        '$rootScope',
        'toastr',
        'httpError',
        function adoConfigService($http, $q, $rootScope, toastr, httpError) {

          var getPromise = {};

          this.get = function (params) {

            params = params || {id: 0}

            if (getPromise[params.id])
              return getPromise[params.id]

            var _params = angular.copy(globalConfig.get_params);
            params = params? angular.extend(_params, params) : _params;

            getPromise[params.id] = $http({
              method: globalConfig.get_method,
              url: globalConfig.get_url,
              params: params
            })
              .then(function (res) {
                res.data.dont_limit_stations = !res.data.limit_stations;
                return res;
              })
              .catch(function (res) {
                toastr.error(httpError(res));
                return $q.reject(res);
              })
              .finally(function () {
                delete getPromise[params.id];
              });

            return getPromise[params.id]
          };

          this.update = function (config, params) {

            var _params = angular.copy(globalConfig.post_params);
            params = params? angular.extend(_params, params) : _params;

            return $http({
              method: globalConfig.post_method,
              url: globalConfig.post_url,
              params: params,
              data: {config: config}
            })
              .then(function(res) {
                toastr.success("Settings has been saved.");
                $rootScope.$broadcast('settings:updated', res.data);
                return res;
              })
              .catch(function (res) {
                toastr.error(httpError(res));
                $rootScope.$broadcast('settings:update:failed', res);
                return $q.reject(res);
              });
          };

          return this;

        }
      ];

      return provider;

    })
    .controller('SaveConfigBtnCtrl', [
      '$scope',
      'adoConfigService',
      function SaveConfigBtnCtrl($scope, adoConfigService) {

        var $ctrl = this;


        $ctrl.$onInit = function () {

          var device_id = $ctrl.device? $ctrl.device.id : null;

          $ctrl.btnClass = $ctrl.btnClass || 'btn-primary';

          $ctrl.submitting = false;

          $ctrl.submit = function (config) {
            $ctrl.submitting = true;
            return adoConfigService.update(config, {id: device_id})
              .then(function (res) {
                if (typeof $ctrl.onSuccess == 'function')
                  $ctrl.onSuccess(res);
              })
              .catch(function(res) {
                if (typeof $ctrl.onError == 'function')
                  $ctrl.onError(res);
              })
              .finally(function() {
                $ctrl.submitting = false;
              });
          };
        };

      }
    ])
    .component('saveConfigBtn', {
      transclude: true,
      controller: 'SaveConfigBtnCtrl',
      bindings: {
        device: '<',
        ngDisabled: '<',
        btnClass: '@',
        config: '<',
        onSuccess: '&',
        onError: '&'
      },
      template: '<button ng-click="$ctrl.submit($ctrl.config)" type="submit" ng-disabled="$ctrl.submitting || $ctrl.ngDisabled" class="btn" ng-class="$ctrl.btnClass" ng-click="$ctrl.submit()"><span ng-if="$ctrl.submitting">Saving...</span><span ng-transclude ng-if="!$ctrl.submitting"></span></button>',
    });

}).call(window);

