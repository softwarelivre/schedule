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
      console.log($scope.currentDay);
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


      $scope.mustFetchData = 0;

      $scope.hours = Config.HOURS;
      $scope.slotsOfRoom = {};
      $scope.zoomedId = null;

      $scope.data = [];


      $scope.eventTimes = [
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
          '19:00', '19:20', '19:40'
      ];

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
            stickTable();
          }
        });
      };

      function reloadSlots() {
        return _.each($scope.rooms, reloadSlotsOfRoom);
      };


      function stickTable() {

          $('table').each(function() {
            if($(this).find('thead').length > 0 && $(this).find('th').length > 0) {
              // Clone <thead>
              var $w     = $(window),
                $t     = $(this),
                $thead = $t.find('thead').clone(),
                $col   = $t.find('thead, tbody').clone();

              // Add class, remove margins, reset width and wrap table
              $t
              .addClass('sticky-enabled')
              .css({
                margin: 0,
                width: '100%'
              }).wrap('<div class="sticky-wrap" />');

              if($t.hasClass('overflow-y')) $t.removeClass('overflow-y').parent().addClass('overflow-y');

              // Create new sticky table head (basic)
              $t.after('<table class="sticky-thead" />');

              // If <tbody> contains <th>, then we create sticky column and intersect (advanced)
              if($t.find('tbody th').length > 0) {
                $t.after('<table class="sticky-col" /><table class="sticky-intersect" />');
              }

              // Create shorthand for things
              var $stickyHead  = $(this).siblings('.sticky-thead'),
                $stickyCol   = $(this).siblings('.sticky-col'),
                $stickyInsct = $(this).siblings('.sticky-intersect'),
                $stickyWrap  = $(this).parent('.sticky-wrap');

              $stickyHead.append($thead);

              $stickyCol
              .append($col)
                .find('thead th:gt(0)').remove()
                .end()
                .find('tbody td').remove();

              $stickyInsct.html('<thead><tr><th>'+$t.find('thead th:first-child').html()+'</th></tr></thead>');
              
              // Set widths
              var setWidths = function () {
                  $t
                  .find('thead th').each(function (i) {
                    $stickyHead.find('th').eq(i).width($(this).width());
                  })
                  .end()
                  .find('tr').each(function (i) {
                    $stickyCol.find('tr').eq(i).height($(this).height());
                  });

                  // Set width of sticky table head
                  $stickyHead.width($t.width());

                  // Set width of sticky table col
                  $stickyCol.find('th').add($stickyInsct.find('th')).width($t.find('thead th').width())
                },
                repositionStickyHead = function () {
                  // Return value of calculated allowance
                  var allowance = calcAllowance();

                   console.log($stickyWrap);


                
                  // Check if wrapper parent is overflowing along the y-axis
                  if($t.height() > $stickyWrap.height()) {
                    // If it is overflowing (advanced layout)
                    // Position sticky header based on wrapper scrollTop()
                    if($stickyWrap.scrollTop() > 0) {
                      // When top of wrapping parent is out of view
                     

                      $stickyHead.add($stickyInsct).css({
                        opacity: 1,
                        top: $stickyWrap.scrollTop()
                      });
                    } else {
                      // When top of wrapping parent is in view
                      $stickyHead.add($stickyInsct).css({
                        opacity: 0,
                        top: 0
                      });
                    }
                  } else {
                    // If it is not overflowing (basic layout)
                    // Position sticky header based on viewport scrollTop
                    if($w.scrollTop() > $t.offset().top && $w.scrollTop() < $t.offset().top + $t.outerHeight() - allowance) {
                      // When top of viewport is in the table itself
                      $stickyHead.add($stickyInsct).css({
                        opacity: 1,
                        top: $w.scrollTop() - $t.offset().top
                      });
                    } else {
                      // When top of viewport is above or below table
                      $stickyHead.add($stickyInsct).css({
                        opacity: 0,
                        top: 0
                      });
                    }
                  }
                },
                repositionStickyCol = function () {
                  console.log($stickyWrap.scrollLeft());
                  console.log($stickyWrap.offset());

                  if($stickyWrap.scrollLeft() > 0) {
                    // When left of wrapping parent is out of view
                    $stickyCol.add($stickyInsct).css({
                      opacity: 1,
                      left: $stickyWrap.scrollLeft()
                    });
                  } else {
                    // When left of wrapping parent is in view
                    $stickyCol
                    .css({ opacity: 0 })
                    .add($stickyInsct).css({ left: 0 });
                  }
                },
                calcAllowance = function () {
                  var a = 0;
                  // Calculate allowance
                  $t.find('tbody tr:lt(3)').each(function () {
                    a += $(this).height();
                  });
                  
                  // Set fail safe limit (last three row might be too tall)
                  // Set arbitrary limit at 0.25 of viewport height, or you can use an arbitrary pixel value
                  if(a > $w.height()*0.25) {
                    a = $w.height()*0.25;
                  }
                  
                  // Add the height of sticky header
                  a += $stickyHead.height();
                  return a;
                };

              setWidths();

              $t.parent('.sticky-wrap').scroll($.throttle(250, function() {
                repositionStickyHead();
                repositionStickyCol();
              }));

              $w
              .load(setWidths)
              .resize($.debounce(250, function () {
                setWidths();
                repositionStickyHead();
                repositionStickyCol();
              }))
              .scroll($.throttle(100, repositionStickyHead));
            }
          });

      };




    })
    .controller('SlotViewController', function ($scope, $uibModalInstance,
                                               talk) {
        
        $scope.talk = talk;
        $scope.shownResumes = {};

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
