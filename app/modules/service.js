(function() {
  "use strict";

  angular
    .module("segue.schedule.services", [
      'restangular',
    ])
    .service("Schedule", function(Restangular, Config, $q) {
      var self = {};
      var rooms = Restangular.service('rooms');
      var talks = Restangular.service('talks');

      self.getTalk = function(id) {
        return talks.one(id).get();
      };
      self.days = function() {
        return Config.EVENT_DAYS;
      };
      self.hours = function() {
        return Config.HOURS;
      };
      self.rooms = function() {
        return rooms.getList();
      };

      self.slotsOfRoom = function(roomId, day) {
        return rooms.one(roomId).one('slots/of-day').one(day).getList();
      };

      return self;
    });

})();
