
(function () {
  'use strict';

  angular.module('ado.save-config-btn', [])
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
        function adoConfigService($http) {

          this.get = function (params) {

            var _params = angular.copy(globalConfig.get_params);
            params = params? angular.extend(_params, params) : _params;

            return $http({
              method: globalConfig.get_method,
              url: globalConfig.get_url,
              params: params
            })
              .then(function (res) {
                res.data.dont_limit_stations = !res.data.limit_stations;
                return res;
              });
          };

          this.update = function (config, params) {

            var _params = angular.copy(globalConfig.post_params);
            params = params? angular.extend(_params, params) : _params;

            return $http({
              method: globalConfig.post_method,
              url: globalConfig.post_url,
              params: params,
              data: config
            });
          };

          return this;

        }
      ];

      return provider;

    })
    .controller('SaveConfigBtnCtrl', [
      '$scope',
      '$rootScope',
      'adoConfigService',
      function SaveConfigBtnCtrl($scope, $rootScope, adoConfigService) {

        var $ctrl = this;

        $ctrl.btnClass = $ctrl.btnClass || 'btn-primary';

        $ctrl.submitting = false;

        $ctrl.submit = function (config) {
          return adoConfigService.update(config)
            .then(function (res) {
              $rootScope.$broadcast('settings:updated', res.data);
              if (typeof $ctrl.onSuccess == 'function')
                $ctrl.onSuccess(res);
            })
            .catch(function(res) {
              $rootScope.$broadcast('settings:update:failed', res);
              if (typeof $ctrl.onError == 'function')
                $ctrl.onError(res);
            })
            .finally(function() {
              $ctrl.submitting = false;
            });
        };

      }
    ])
    .component('saveConfigBtn', {
      transclude: true,
      controller: 'SaveConfigBtnCtrl',
      bindings: {
        ngDisabled: '<',
        btnClass: '@',
        config: '<',
        onSuccess: '&',
        onError: '&'
      },
      template: '<button ng-click="$ctrl.submit($ctrl.config)" type="submit" ng-disabled="$ctrl.submitting || $ctrl.ngDisabled" class="btn" ng-class="$ctrl.btnClass" ng-click="$ctrl.submit()"><span ng-if="$ctrl.submitting">Saving...</span><span ng-transclude ng-if="!$ctrl.submitting"></span></button>',
    });

}).call(window);

