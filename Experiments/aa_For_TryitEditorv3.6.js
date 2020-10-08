<!DOCTYPE html>
<html>
<body>
<h2>JavaScript Functions</h2>
<p> PERSONAL SCRIPT TESTING </p>
<p id="demo"></p>
<script>

// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t

try {

     function Bloodied_Encumbered() {
        'use strict';

        var version = '0.0.3',
            lastUpdate = 2010050730;

        var LogInstall = function() {    
            
            return {
            	'Bloodied_Encumbered Install Info: v'+version+' [lastUpdate:'+lastUpdate+']';
            }
        };

		document.getElementById("demo").innerHTML = LogInstall()

    	return {
        	B_E_LI: LogInstall
    	};

    }

    document.getElementById("demo").innerHTML = Bloodied_Encumbered.B_E_LI() + ' BAZZINGA!!';
    
}

catch(err) {
    document.getElementById("demo").innerHTML = err.message;
}

</script>
</body>
</html>
