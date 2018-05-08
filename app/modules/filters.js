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
        if (input.length == 10) { input = input + 'T12:00:00'; }
        var date = DateParser.parse(input, timezone);
        return date.getDate();
      };
    })
    .filter('human_time',function(DateParser) {
      return function(input,timezone) {
        var date = DateParser.parse(input, timezone);
        return date.getHours();
      };
    })
    .filter('human_time_minutes',function(DateParser) {
      return function(input,timezone) {
        var date = DateParser.parse(input, timezone);
        return date.getMinutes();
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
    .filter('small_name', function() {
      return function(name) {
        if(!name){ return '' };
          
        var splitedName = name.split(' ');
        if(splitedName.length > 2 )
        {
          return splitedName[0] + ' ' + splitedName[splitedName.length - 1];
        }
        else {
          return name;
        }
      }
    })
    .filter('datetime_locale', function(DateParser) {
      return function(input, timezone) {
        var date = DateParser.parse(input, timezone);
        return date.toLocaleString();
      };
    });
})();
