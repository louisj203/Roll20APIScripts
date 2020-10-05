// Github:   https://github.com/louisj203/Roll20APIScripts/edit/master/FirstScript/FirstScript.js
// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t

var LogVersionLastUpdate = LogVersionLastUpdate || (function() {
    'use strict';

    var version = '0.0.1',
        lastUpdate = 2010050630,

    checkInstall = function() {    
        log('Install Info: v'+version+' [lastUpdate: '+lastUpdate+']');
    };

    return {
        TheReturnName: checkInstall
    };

}());

on('ready',function() {
    'use strict';

    TheReturnName.CheckInstall();

});
