
(function () {
  'use strict';

  angular.module('ado.save-config-btn', [])
    .provider('saveConfigBtnService', function() {

      var provider = {};
      var globalConfig = {
        params: {},
        method: 'POST',
        url: '/settings/config'
      };

      provider.config = function (config) {
        angular.extend(globalConfig, config);
      };

      provider.$get = [
        '$http',
        function saveConfigBtnService($http) {

          this.update = function (config, params) {

            console.log(config);

            var _params = angular.copy(globalConfig.params);
            params = params? angular.extend(_params, params) : globalConfig.params

            return $http({
              method: globalConfig.method,
              url: globalConfig.url,
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
      'saveConfigBtnService',
      function SaveConfigBtnCtrl($scope, saveConfigBtnService) {

        var $ctrl = this;

        $ctrl.btnClass = $ctrl.btnClass || 'btn-primary';

        $ctrl.submitting = false;

        $ctrl.submit = function (config) {
          return saveConfigBtnService.update(config)
            .then(function (res) {
              if (typeof $ctrl.onSuccess == 'function')
                $ctrl.onSuccess(res)
            })
            .catch(function(res) {
              if (typeof $ctrl.onError == 'function')
                $ctrl.onError(res)
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

