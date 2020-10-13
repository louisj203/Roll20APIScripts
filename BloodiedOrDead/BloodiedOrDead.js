// Github:   https://github.com/louisj203/Roll20APIScripts/edit/master/BloodiedOrDead/BloodiedOrDead.js
// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t
// *NOTE* This script assumes token bar1 is used for HP and that the custom "Bleeding::492665" status marker is part of your status marker set.
// You must also include somewhere in the name on an NPC's character sheet 'sidekick' or 'henchman' if you want to see injury messages from this script.

let blodiedOrDeadReady = false;

on('ready', function () {

    const currentVersion = "1.0.11",
        lastUpdate = new (Date);
    
    log('BloodiedOrDead Install Info: v' + currentVersion + ' Last Update: ' + lastUpdate);
    
    blodiedOrDeadReady = true;
    
});

on("change:graphic", function (obj, prev) {

    // sendChat('DEBUG INFO', 'Event Triggered: ' + Date.now());
    
    // Don't run it 'ready' event hasn't fired
    if (!blodiedOrDeadReady) {
        log('WARNING', 'Change event triggered before ready event. EXITING BloodiedOrDead.');
        return;
    }
    
    // first, if it's not a token, then do nothing
    if (obj.get("_subtype") != "token") return;
    
    let importantChar,
        hpValue, hpPrev, hpMax, hpRatio,
        sControlledBy,
        currentStatusMarkerString, newStatusMarkerString,
        currentStatusMarkerArray, filteredStatusMarkerArray,
        bleedingStatus, deadStatus,
        tokenName, tokenRepresents,
        charSheet,
        representsName;
        // strConditioned;

    hpValue = parseInt(obj.get("bar1_value"),10);
    hpMax = parseInt(obj.get("bar1_max"),10);
    hpPrev = prev.["bar1_value"]
    if (isNaN(hpValue) || isNaN(hpMax) || IsNaN(hpPrev) || hpValue == hpPrev) return;

    // Is this a token the players care about? If not, we don't want to spam chat.
    importantChar = false;
    // First, does the token represemt a character
    tokenRepresents = obj.get("represents");
    if (tokenRepresents !== undefined && tokenRepresents !== "") {
        // Yes it does so get the character object
        charSheet = getObj('character', tokenRepresents);
        if (charSheet != undefined) {
            // Valid character
            sControlledBy = charSheet.get("controlledby")
            representsName = charSheet.get("name")
            // strConditioned = representsName.toLowerCase()
            if (sControlledBy != "") {
                // Controlled by one or more player
                importantChar = true;
            } else if ((representsName.toLowerCase()).indexOf("sidekick") >= 0 || (representsName.toLowerCase()).indexOf("henchman") >= 0) {
                // Character is a Sidekick or Henchmane
                importantChar = true;
            }
        }
    } else {
        // No, token does not represent a character, so just check if it's controlled by any players
         sControlledBy = obj.get("controlledby");
         if (sControlledBy != "") {
             // Controlled by one or more characters
             importantChar = true;
         }
    }

    currentStatusMarkerString = (obj.get("statusmarkers")).trim();  // THIS WORKS!!
    // sendChat('DEBUG INFO', 'curentStatusMarkerString: ' + currentStatusMarkerString);
    
    // Define currentStatusMarkerArray
    if (currentStatusMarkerString.length === 0) {
        currentStatusMarkerArray = [];
    } else if (currentStatusMarkerString.indexOf(",") === -1) {
        currentStatusMarkerArray = [currentStatusMarkerString];
    } else {
        currentStatusMarkerArray = currentStatusMarkerString.split(",");
    }
    // sendChat('DEBUG INFO', 'Value of the Marker string: ' + currentStatusMarkerString + ' Type of the Marker string: ' + typeof currentStatusMarkerString + ' Value of the Marker Array: ' +
    //    currentStatusMarkerArray + ' Type of the Marker Array: ' + typeof currentStatusMarkerArray + '.');

    // bleedingStatus, deadStatus = true if an "Bleeding" or "dead" is the start of any given array element, false otherwise.
    bleedingStatus = currentStatusMarkerString.includes("Bleeding::492665");
    deadStatus = currentStatusMarkerString.includes("dead");

    // sendChat('DEBUG INFO', '(BEFORE HP calculation changes) hpValue: ' + hpValue + ' hpMax: ' + hpMax + ' tokenName: ' + obj.get("name") + ' | charName: ' + representsName +
    //    ' | importantChar: ' + importantChar + ' | bleedingStatus:  '+ bleedingStatus + ' | deadStatus: ' + deadStatus + '.'); 

    // Dead or dying...
    if (hpValue <= 0) {
        // Set dead status marker and remove bloodied status marker and any tints, send dying message (if 'importantChar'), then return.
        //  ** Object Set acceptable syntax: obj.set("property", newvalue); or obj.set({property: newvalue, property2: newvalue2}); **
        if (bleedingStatus) {
            filteredStatusMarkerArray = subArrayFunction(currentStatusMarkerArray, "Bleeding::492665"); 
            currentStatusMarkerArray = filteredStatusMarkerArray;
        }
        if (!deadStatus) {
            if (currentStatusMarkerArray.length == 0) {
                currentStatusMarkerArray[0] = "dead";
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
            filteredStatusMarkerArray = subArrayFunction(currentStatusMarkerArray, "dead"); 
            currentStatusMarkerArray = filteredStatusMarkerArray;
        }
    }

    // Determine current hitpoint ratio "bar1_value" / "bar1_max"
    hpRatio = hpValue / hpMax;

    // Determine "Bleeding" token status marker one time, so we're not doing it in each 'if' conditional statement
    if (hpRatio <= 0.5 && !bleedingStatus) {
        if (currentStatusMarkerArray.length == 0) {
            currentStatusMarkerArray[0] = "Bleeding::492665";
        } else {
            currentStatusMarkerArray.push("Bleeding::492665");
        }
    } else {
        if (hpRatio > 0.5 && bleedingStatus) {
            filteredStatusMarkerArray = subArrayFunction(currentStatusMarkerArray, "Bleeding::492665");
            currentStatusMarkerArray = filteredStatusMarkerArray;
        }
    }
    newStatusMarkerString = currentStatusMarkerArray.toString();
    // sendChat('DEBUG INFO', 'After dead/bleeding/hp calculations, newStatusMarkerString: ' + newStatusMarkerString + '.');

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
        if (importantChar) {
            sendChat('UNINJURED', obj.get("name") + ' is not significantly injured.');               
        }
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
