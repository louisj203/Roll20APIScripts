// Github:   https://github.com/louisj203/Roll20APIScripts/edit/master/Bloodied_Encumbered/Bloodied_Encumbered.js
// By:       Lou-T, GM Extra Sauce
// Contact:  https://app.roll20.net/users/2990909/lou-t

var SayHello = SayHello || (function() {
    'use strict';

    var version = '0.0.1',
        lastUpdate = 2005051020,

    checkInstall = function() {    
        log('-=> SayHello v'+version+' <=-  [lastUpdate: '+lastUpdate+']');
	},

    },

    return {
        CheckInstall: checkInstall
    };

}());

on('ready',function() {
    'use strict';

    SayHello.CheckInstall();

});
