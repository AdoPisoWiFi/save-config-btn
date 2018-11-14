(function () {
  'use strict';

  angular.module('ado.save-config-btn', [])
    .provider('saveConfigBtnService', function() {

      var provider = {};
      var globalConfig = {
        url: '/settings'
      };

      provider.config = function (config) {
        angular.extend(globalConfig, config);
      };

      provider.$get = [
        '$http',
        function saveConfigBtnService($http) {

          this.update = function (config) {
            return $http.post(globalConfig.url, config);
          };

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
        btnClass: '@',
        config: '<',
        onSuccess: '&',
        onError: '&'
      },
      template: '<button ng-click="$ctrl.submit(config)" type="submit" ng-disabled="$ctrl.submitting" class="btn" ng-class="$ctrl.btnClass" ng-click="$ctrl.submit()"><span ng-if="$ctrl.submitting">Saving...</span><ng-transclude ng-if="!$ctrl.submitting"/></button>',
    });

}).call(window);

