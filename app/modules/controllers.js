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
    .controller('TalkController', function($scope, $state, Config, talk) {
      $scope.talk = talk;
      $scope.shownResumes = {};

      $scope.showResume = function(personName) {
        $scope.shownResumes[personName] = true;
      };
      $scope.hideResume = function(personName) {
        delete $scope.shownResumes[personName];
      };
    })
    .controller('GridController', function($scope, $state, Config, Schedule, currentDay) {
      $scope.hours = Config.HOURS;
      $scope.slotsOfRoom = {};
      $scope.zoomedId = null;

      $scope.showTalk = function(talkId) {
        $state.go('talk', { id: talkId });
      };
      $scope.zoomOnSlot = function(slot, $event) {
        $scope.zoomedId = slot.id;
      };
      $scope.resetZoom = function($event) {
        if ($event) $event.stopPropagation();
        $scope.zoomedId = null;
      };

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
