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
    .filter('human_day',function(DateParser) {
      return function(input,timezone) {
        var date = DateParser.parse(input+'T12:00:00', timezone);
        return date.getDate();
      };
    })
    .filter('time_locale',function(DateParser) {
      return function(input,timezone) {
        var date = DateParser.parse(input, timezone);
        return date.toLocaleTimeString();
      };
    })
    .filter('date_locale',function(DateParser) {
      return function(input, timezone) {
        var date = DateParser.parse(input, timezone);
        return date.toLocaleDateString();
      };
    })
    .filter('datetime_locale', function(DateParser) {
      return function(input, timezone) {
        var date = DateParser.parse(input, timezone);
        return date.toLocaleString();
      };
    });
})();
