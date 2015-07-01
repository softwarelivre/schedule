(function() {
  'use strict';

  angular
    .module('templates', []);

  angular
    .module('segue.schedule',[
      'templates',
      'ui.router',
      'ui.router.compat',
      'restangular',
      'angular-loading-bar',

      'segue.schedule.controllers',
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('schedule', {
          url: '^/:day',
          views: {
            header: { controller: 'HeaderController', templateUrl: 'modules/templates/nav.html' },
            main:   { controller: 'GridController',   templateUrl: 'modules/templates/grid.html' }
          },
          resolve: {
            currentDay: function($stateParams) { return $stateParams.day || '2015-07-08'; }
          }
        });
    })
    .controller("ScheduleController", function($scope, $state, Config) {
      $scope.$on('$stateChangeSuccess', function(event, newState) {
        $scope.topState = newState.name.split('.')[0];
        $scope.subState = $scope.topState + "-" + newState.name.split('.')[1];
        $scope.state    = newState;
      });
      $scope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        console.log('error moving from', fromState, 'to', toState);
        console.log('toParams:', toParams);
        console.log('fromParams:', fromParams);
        console.log(error);
      });
    })
    .config(function(RestangularProvider, Config) {
      RestangularProvider.setBaseUrl(Config.API_HOST + Config.API_PATH);
      RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        if (operation == "getList") { return data.items; }
        if (data.resource) { return data.resource; }
        return data;
      });
      RestangularProvider.setOnElemRestangularized(function(thing, isCollection, model, Restangular) {
        if (!isCollection) {
          thing.follow = function(name) {
            var path = thing.links[name].href.replace(/.api./,'');
            return Restangular.one(path).getList();
          };
        }
        return thing;
      });
    })
    .config(function($urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    });

})();
