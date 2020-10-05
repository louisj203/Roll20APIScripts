// Github:   https://github.com/louisj203/Roll20APIScripts/edit/master/Bloodied_Encumbered/Bloodied_Encumbered.js
// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t

var Bloodied_Encumbered = Bloodied_Encumbered || (function() {
    'use strict';

    var version = '0.0.3',
        lastUpdate = 2010050730,

    LogInstall = function() {    
        log('Bloodied_Encumbered Install Info: v'+version+' [lastUpdate: '+lastUpdate+']');
    };

    return {
        B_E_LI: LogInstall
    };

}());

on('ready',function() {
    'use strict';

    Bloodied_Encumbered.B_E_LI();

});
