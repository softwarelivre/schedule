(function() {
  "use strict";

  angular
    .module('segue.schedule')
    .constant('Config', {
      API_HOST: 'https://segue-api.fisl18.softwarelivre.org',
      API_PATH: '/api',
      PROPOSAL_LANGUAGES: [
        { abbr: 'pt', name: 'português' },
        { abbr: 'es', name: 'espanhol' },
        { abbr: 'en', name: 'inglês' },
      ],
      PROPOSAL_LEVELS: [ "beginner", "advanced" ],
      TIMEZONE: '-0300',
      EVENT_DAYS: ["2018-07-11","2018-07-12","2018-07-13","2018-07-14"],
      HOURS: [ 9, 10,11,12,13,14,15,16,17,18,19 ]
    });

})();
