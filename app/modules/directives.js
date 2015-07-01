(function() {
  "use strict";

  angular
    .module("segue.schedule.directives", [ ])
    .directive("fixedHorizontal", function($window) {
      return function(scope, element, attrs) {
        angular.element(element).css('position', 'absolute');
        angular.element($window).bind("scroll", function(e) {
          angular.element(element).css('left', $window.scrollX + "px");
        });
      };
    })
    .directive("fixedVertical", function($window) {
      return function(scope, element, attrs) {
        angular.element(element).css('position', 'absolute');
        angular.element($window).bind("scroll", function(e) {
          angular.element(element).css('top', $window.scrollY + "px");
        });
      };
    });
})();
