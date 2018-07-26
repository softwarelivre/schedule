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
    .controller('GridController', function($scope, $state, $uibModal,
                                           Config, Schedule,
                                           currentDay) {

      $scope.currentDay = currentDay;

      $scope.mustFetchData = 0;

      $scope.hours = Config.HOURS;
      $scope.slotsOfRoom = {};
      $scope.zoomedId = null;

      $scope.data = [];

      $scope.defaultSlotTimes = [
        '09:00', '09:20', '09:40',
        '10:00', '10:20', '10:40',
        '11:00', '11:20', '11:40',
        '12:00', '12:20', '12:40',
        '13:00', '13:20', '13:40',
        '14:00', '14:20', '14:40',
        '15:00', '15:20', '15:40',
        '16:00', '16:20', '16:40',
        '17:00', '17:20', '17:40',
        '18:00', '18:20', '18:40',
        '19:00', '19:20', '19:40',
        '20:00', '20:20', '20:40'
      ];

      $scope.extendedSlotTimes = [
        '08:00', '08:20', '08:40',
        '09:00', '09:20', '09:40',
        '10:00', '10:20', '10:40',
        '11:00', '11:20', '11:40',
        '12:00', '12:20', '12:40',
        '13:00', '13:20', '13:40',
        '14:00', '14:20', '14:40',
        '15:00', '15:20', '15:40',
        '16:00', '16:20', '16:40',
        '17:00', '17:20', '17:40',
        '18:00', '18:20', '18:40',
        '19:00', '19:20', '19:40',
        '20:00', '20:20', '20:40',
      ];

      $scope.eventTimes = {
        '2018-07-11': $scope.defaultSlotTimes,
        '2018-07-12': $scope.extendedSlotTimes,
        '2018-07-13': $scope.extendedSlotTimes,
        '2018-07-14': $scope.extendedSlotTimes,
      }

      $scope.slotCssClass = function(slot) {
        if( slot.status == 'empty' ) {
          return 'slot-empty';
        } 

        if (slot.status == 'confirmed' && slot.talk.status == 'confirmed') {
          return 'slot-confirmed';
        }

        return 'slot-with-problem';
      }

      $scope.slotHasIssue = function(slot) {
        if(slot.status == 'empty') {
          return false;
        }
        return true;
      }


      $scope.isOneHourEvent = function(time) {
          return $scope.oneHourEvents.contains(time) >= 0;
      };

      $scope.showTalk = function(talkId) {
        $state.go('talk', { id: talkId });
      };

      $scope.zoomOnSlot = function(slot, $event) {
        if(slot.status == 'empty') {return}

        Schedule.getTalk(slot.talk.id).then(function(talk) {
           var modalInstance = $uibModal.open({
                templateUrl: 'modules/templates/talk-modal.html',
                controller: 'SlotViewController',
                size: 'md',
                backdrop: true,
                resolve: {
                  talk: function () {
                      return talk;
                  }
                }
            });
        });

 
      };

      $scope.resetZoom = function($event) {
        if ($event) $event.stopPropagation();
        $scope.zoomedId = null;
      };

      Schedule.rooms().then(function(rooms) {
        $scope.rooms = rooms;
        $scope.mustFetchData = rooms.length;
        reloadSlots();
      });

      function reloadSlotsOfRoom(room) {
        Schedule.slotsOfRoom(room.id, currentDay).then(function(slots) {


          $scope.slotsOfRoom[room.id] = slots;
          $scope.mustFetchData -= 1;
          if($scope.mustFetchData == 0 ) 
          {
            //stickTable();
          }
        });

        //var target = angular.element('#schedule-grid');
        //target.focus();
        document.getElementById("schedule-grid").focus();
      };

      

      function reloadSlots() {
        return _.each($scope.rooms, reloadSlotsOfRoom);
      };



    })
    .controller('SlotViewController', function ($scope, $uibModalInstance,
                                               talk) {

        var descriptionMinlength = 150;
        var descriptionMaxLength = 1000;
        
        $scope.talk = talk;
        $scope.shownResumes = {};
        $scope.descriptionLength = descriptionMinlength;

        $scope.showFullDescription = function() {
          $scope.descriptionLength = descriptionMaxLength;
        };

        $scope.showShortDescription = function() {
          $scope.descriptionLength = descriptionMinlength;
        }

        $scope.showReadMoreButton  = function() {
          return $scope.descriptionLength == descriptionMinlength;
        }

        $scope.showResume = function(personName) {
          $scope.shownResumes[personName] = true;
        };
        
        $scope.hideResume = function(personName) {
          delete $scope.shownResumes[personName];
        };

        $scope.close = function () {
          $uibModalInstance.close();
        };

        
    });
})();
