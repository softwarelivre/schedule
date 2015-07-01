(function() {
  "use strict";

  angular
    .module('segue.schedule.filters', [ ])
    .filter('dateFromTimestamp', function() {
      return function(input) {
        var year  = input.substring(0,4);
        var month = input.substring(5,7);
        var day   = input.substring(8,10);
        return day + "/" + month + "/" + year;
      };
    })
    .filter('time_locale',function(Config) {
      return function(input,timezone) {
        if (!timezone) { timezone = Config.TIMEZONE; }
        var timestamp = Date.parse(input+timezone);
        if (isNaN(timestamp)) { return ''; }
        return (new Date(timestamp)).toLocaleTimeString();
      };
    })
    .filter('date_locale',function() {
      return function(input) {
        var timestamp = Date.parse(input);
        if (isNaN(timestamp)) { return ''; }
        return (new Date(timestamp)).toLocaleDateString();
      };
    })
    .filter('datetime_locale', function(Config) {
      return function(input, timezone) {
        if (!timezone) { timezone = Config.TIMEZONE; }
        var timestamp = Date.parse(input+timezone);
        if (isNaN(timestamp)) { return ''; }
        return (new Date(timestamp)).toLocaleString();
      };
    });
})();
