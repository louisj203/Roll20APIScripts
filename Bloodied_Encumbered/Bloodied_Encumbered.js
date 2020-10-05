// Github:   https://github.com/louisj203/Roll20APIScripts/edit/master/Bloodied_Encumbered/Bloodied_Encumbered.js
// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t

var LogVersionLastUpdate = LogVersionLastUpdate || (function() {
    'use strict';

    var version = '0.0.1',
        lastUpdate = 2010050647,

    checkInstall = function() {    
        log('Bloodied_Encumbered Install Info: v'+version+' [lastUpdate: '+lastUpdate+']');
    };

    return {
        TheReturnName: checkInstall
    };

}());

on('ready',function() {
    'use strict';

    LogVersionLastUpdate.TheReturnName();

});
