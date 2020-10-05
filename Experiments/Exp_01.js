// Github:   https://github.com/louisj203/Roll20APIScripts/edit/master/Experiments/Exp_01.js
// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t

var Exp_01 = Exp_01 || (function() {
    'use strict';

    var version = '0.0.3',
        lastUpdate = 2010050730,

    LogInstall = function() {    
        log('Exp_01 Install Info: v'+version+' [lastUpdate: '+lastUpdate+']');
    };

    return {
        Exp_01_rtrn: LogInstall
    };

}());

on('ready',function() {
    'use strict';

    Exp_01.Exp_01_rtrn();

});
