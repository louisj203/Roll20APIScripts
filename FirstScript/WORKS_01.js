<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Functions</h2>

<p> PERSONAL SCRIPT TESTING 2</p>
<p id="demo"></p>

<script>

// THIS WORKS IN THE TRYIT EDITOR v3.6

// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t

try {

     function Bloodied_Encumbered() {
        'use strict';

        var version = '0.0.3',
            lastUpdate = 2010071020;

        var LogInstall = function() {    
            return version+' '+lastUpdate;
        };

	//	document.getElementById("demo").innerHTML = LogInstall();

    //	return {
    //    	B_E_LI: LogInstall()
    //	};
    
		return {xyz: LogInstall};

    }

    document.getElementById("demo").innerHTML = Bloodied_Encumbered().xyz() + ' BAZZINGA!!';
    
}

catch(err) {
    document.getElementById("demo").innerHTML = err.message;
}

</script>

</body>
</html>
