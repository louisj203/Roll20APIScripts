// Github:   https://github.com/louisj203/Roll20APIScripts/edit/master/BloodiedOrDead/BloodiedOrDead.js
// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t
// *NOTE* This script assumes token bar1 is used for HP and that the custom "Bleeding::492665" status marker is part of your status marker set.
// You must also include somewhere in the name on an NPC's character sheet 'sidekick' or 'henchman' if you want to see injury messages from this script.

let blodiedOrDeadReady = false;

on('ready', function () {

    const currentVersion = "0.2.22",
        lastUpdate = 2011110900;
    
    log('BloodiedOrDead Install Info: v' + currentVersion + ' Last Update: ' + lastUpdate);
    
    blodiedOrDeadReady = true;
    
});

on("change:graphic", function (obj, prev) {

    // Don't run it 'ready' event hasn't fired
    if (!blodiedOrDeadReady) {
        sendChat('WARNING', 'Change event triggered before ready event. EXITING function call.');
        return;
    }
    
    let importantChar,
        hpValue,
        hpMax,
        hpRatio,
        sControlledBy,
        currentStatusMarkerString,
        newStatusMarkerString,
        currentStatusMarkerArray,
        filteredStatusMarkerArray,
        bleedingStatus,
        deadStatus,
        tokenName,
        tokenRepresents,
        charSheet,
        representsName,
        strConditioned;

    sendChat('DEBUG INFO', 'Event Triggered: ' + Date.now());

    hpValue = obj.get("bar1_value");
    if (isNaN(hpValue)) return;
    hpMax = obj.get("bar1_max");
    if (isNaN(hpMax)) return;
    if (hpMax <= 0) return;
    if (hpValue === prev.bar1_value && hpMax === prev.bar1_max) {
        sendChat('SCRIPT INFO', 'No change in health bar, nothing to see here...');
        return;
    }

    // Is this a token the players care about? If not, we don't want to spam chat.
    importantChar = false;
    sControlledBy = obj.get("controlledby");
    tokenRepresents = obj.get("represents");
    if (sControlledBy !== undefined && sControlledBy !== "") {
        importantChar = true;   // Controlled by one or more players
    } else if (tokenRepresents !== undefined && tokenRepresents !== "") {
        charSheet = getObj('character', tokenRepresents);
        if (charSheet !== undefined) {
            representsName = charSheet.get("name");
            if (representsName !== undefined && representsName !== "") {
                sendChat('DEBUG INFO', 'tokenRepresents a character sheet with the name:' + representsName + '.');
                strConditioned = representsName.toLowerCase();
                if (strConditioned.indexOf("sidekick") >= 0 || strConditioned.indexOf("henchman") >= 0) {
                    sendChat('DEBUG INFO', 'The NPC is a Sidekick or Henchman.');
                    importantChar = true;
                }
            }
        }
    }

    currentStatusMarkerString = obj.get("statusmarkers");
    sendChat('DEBUG INFO', '006');
    if (currentStatusMarkerString.length === 0) {
        sendChat('DEBUG INFO', '007');
        currentStatusMarkerArray = [];
        sendChat('DEBUG INFO', '008');
    } else if (currentStatusMarkerString.indexOf(",") === -1) {
        sendChat('DEBUG INFO', '010');
        currentStatusMarkerArray[0] = currentStatusMarkerString;
        sendChat('DEBUG INFO', '011');
    } else {
        sendChat('DEBUG INFO', '013');
        currentStatusMarkerArray = currentStatusMarkerString.split(",");
        sendChat('DEBUG INFO', '014');
    }
    sendChat('DEBUG INFO', 'Value of the Marker string: ' + currentStatusMarkerString + ' Type of the Marker string: ' + typeof currentStatusMarkerString + ' Value of the Marker Array: ' +
        currentStatusMarkerArray + ' Type of the Marker Array: ' + typeof currentStatusMarkerArray + '.');

    // bleedingStatus, deadStatus = true if an "Bleeding" or "dead" is the start of any given array element, false otherwise.
    bleedingStatus = currentStatusMarkerString.includes("Bleeding::492665");
    deadStatus = currentStatusMarkerString.includes("dead");

    sendChat('DEBUG INFO', '(BEFORE HP calculation changes) hpValue: ' + hpValue + ' hpMax: ' + hpMax + ' tokenName: ' + obj.get("name") + ' | charName: ' + representsName +
        ' | importantChar: ' + importantChar + ' | bleedingStatus:  '+ bleedingStatus + ' | deadStatus: ' + deadStatus + '.'); 

    // Dead or dying...
    if (hpValue <= 0) {
        // Set dead status marker and remove bloodied status marker and any tints, send dying message (if 'importantChar'), then return.
        //  ** Object Set acceptable syntax: obj.set("property", newvalue); or obj.set({property: newvalue, property2: newvalue2}); **

        if (bleedingStatus) {
            filteredStatusMarkerArray = subArrayFuction(currentStatusMarkerArray, "Bleeding::492665"); 
            currentStatusMarkerArray = filteredStatusMarkerArray;
        }
        if (!deadStatus) {
            if (currentStatusMarkerArray.length == 0) {
                currentStatusMarkerArray[0] = ("dead");
            } else {
                currentStatusMarkerArray.push("dead");
            }
        }
        newStatusMarkerString = currentStatusMarkerArray.toString();

        obj.set({
            tint_color: "transparent",
            statusmarkers: newStatusMarkerString
        });

        if (importantChar) {
            sendChat('DYING', obj.get("name") + ' is unconscious and dying.');               
        }
        return;
    } else {
        // Remove "dead" from thes statusmarker strin
        if (deadStatus) {
            filteredStatusMarkerArray = subArrayFuction(currentStatusMarkerArray, "dead"); 
            currentStatusMarkerArray = filteredStatusMarkerArray;
        }
    }

    // Determine current hitpoint ratio "bar1_value" / "bar1_max"
    hpRatio = hpValue / hpMax;

    // Determine "Bleeding" token status marker one time, so we're not doing it in each 'if' conditional statement
    if (hpRatio <= 0.5 && !bleedingStatus) {
        if (currentStatusMarkerArray.length == 0) {
            currentStatusMarkerArray[0] = ("Bleeding::492665");
        } else {
            currentStatusMarkerArray.push("Bleeding::492665");
        }
    } else {
        if (hpRatio > 0.5 && bleedingStatus) {
            filteredStatusMarkerArray = subArrayFuction(currentStatusMarkerArray, "Bleeding::492665");
            currentStatusMarkerArray = filteredStatusMarkerArray;
        }
    }
    newStatusMarkerString = currentStatusMarkerArray.toString();
    sendChat('DEBUG INFO', 'After dead/bleeding/hp calculations, newStatusMarkerString: ' + newStatusMarkerString + '.');

    if (hpRatio <= 0.25) {
        // Gravely wounded  
        obj.set({
            tint_color: "#ff0000",
            statusmarkers: newStatusMarkerString
        });
        if (importantChar) {
            sendChat('GRAVELY WOUNDED', obj.get("name") + ' is gravely wounded.');               
        }
    } else if (hpRatio <= 0.5) {
        // Bloodied
        obj.set({
            tint_color: "#ffff00",
            statusmarkers: newStatusMarkerString
        });
        if (importantChar) {
            sendChat('BLOODIED', obj.get("name") + ' is bloodied.');               
        }        
    } else if (hpRatio <= 0.75) {
        // Injured
        obj.set({
            tint_color: "#ffff00",
            statusmarkers: newStatusMarkerString
        });
        if (importantChar) {
            sendChat('INJURED', obj.get("name") + ' is injured.');               
        }                 
    } else {
        // Still pretty healthy...  
        obj.set({
            tint_color: "transparent",
            statusmarkers: newStatusMarkerString
        });           
    }
    
    // subArrayFunction will return a subArray of the mainArray without the elements that contain (include) filterTest string. mainArray is assumed to be a statusmarker string
    // convrerted to an array, where each element of the array is a string.
    function subArrayFunction(mainArray, filterTest) {
    
        let filteredArray = [],
            arrayElement;
    
        for (arrayElement of mainArray) {
            if (!arrayElement.includes(filterTest)) {
                if (filteredArray.length == 0) {
                    filteredArray[0] = arrayElement;
                } else {
                    filteredArray.push(arrayElement); 
                }
            }        
        }    
        return filteredArray;        
    }
});
