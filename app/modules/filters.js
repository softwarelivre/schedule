(function() {
  "use strict";

  angular
    .module('segue.schedule.filters', [ ])
    .service('DateParser', function(Config) {
      return {
        parse: function(input, timezone) {
          if (!timezone) { timezone = Config.TIMEZONE; }
          var timestamp = Date.parse(input+timezone);
          if (isNaN(timestamp)) { return null; }
          return new Date(timestamp);
        }
      };
    })
    .filter('human_day',function(Config, DateParser) {
      return function(input,timezone) {
        var date = DateParser.parse(input+'T12:00:00', timezone);
        return date.getDate();
      };
    })
    .filter('time_locale',function(Config, DateParser) {
      return function(input,timezone) {
        var date = DateParser.parse(input, timezone);
        return date.toLocaleTimeString();
      };
    })
    .filter('date_locale',function() {
      return function(input) {
        var date = DateParser.parse(input, timezone);
        return date.toLocaleTimeString();
      };
    })
    .filter('datetime_locale', function(Config) {
      return function(input, timezone) {
        var date = DateParser.parse(input, timezone);
        return date.toLocaleString();
      };
    });
})();
