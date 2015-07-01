(function() {
  "use strict";

  angular
    .module("segue.schedule.controllers", [
      'segue.schedule',
      'segue.schedule.services',
      'segue.schedule.directives',
      'segue.schedule.filters'
    ])
    .controller('HeaderController', function($scope, $state, Config, currentDay) {
      $scope.days = Config.EVENT_DAYS;
      $scope.currentDay = currentDay;
    })
    .controller('GridController', function($scope, $state, Config, Schedule, currentDay) {
      $scope.slotsOfRoom = {};

      Schedule.rooms().then(function(rooms) {
        $scope.rooms = rooms;
        reloadSlots();
      });

      function reloadSlotsOfRoom(room) {
        Schedule.slotsOfRoom(room.id, currentDay).then(function(slots) {
          $scope.slotsOfRoom[room.id] = slots;
        });
      }

      function reloadSlots() {
        return _.each($scope.rooms, reloadSlotsOfRoom);
      }
    });
})();
