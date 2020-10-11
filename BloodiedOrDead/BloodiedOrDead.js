// Github:   https://github.com/louisj203/Roll20APIScripts/edit/master/BloodiedOrDead/BloodiedOrDead.js
// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t
// *NOTE* This script assumes bar_1 is used for HP and that the custom "Bleeding::492665" status marker is part of your status marker set.
// You must also include somewhere in the name on an NPC's character sheet 'sidekick' or 'henchman' if you want to see messages from this script.

const version = "0.2.11",
      lastUpdate = 2010111110;

on("change:graphic", function(obj, prev) {
    "use strict";
    
    var importantChar,
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
        tokenRepresents,
        tokenName,
        representsName,
        strConditioned;
    
    // sendChat('DEBUG INFO', 'Event Triggered.');

    hpValue = obj.get("bar1_value");
    if(isNaN(hpValue)) return;
    hpMax = obj.get("bar1_max");
    if(isNaN(hpMax)) return;
    if(hpMax <= 0) return;
    if(hpValue === prev["bar1_value"] && hpMax === prev["bar1_max"]) {
        // sendChat('SCRIPT INFO', 'No change in health bar, nothing to see here...');
        return;
    }
    
    // Is this a token the players care about? If not, we don't want to spam chat.
    importantChar = false;
    sControlledBy = obj.get("controlledby");
    strConditioned = obj.get("represents");

    if(sControlledBy !== undefined && sControlledBy !== "") {
        importantChar = true;   // Controlled by one or more players
    }
    else if(strConditioned !== undefined && strConditioned !== "") {
        tokenRepresents = getObj('character', strConditioned);
        if(tokenRepresents === undefined) {
            representsName = undefined;
        }
        else{
            representsName = tokenRepresents.get("name");
        }
        // sendChat('DEBUG INFO', 'tokenRepresents object and representsName set. Name: '+representsName+'.');
        if(representsName !== undefined && representsName !== "") {
            strConditioned = representsName.toLowerCase();
            if(strConditioned.indexOf("sidekick") >= 0 || strConditioned.indexOf("henchman") >= 0) {
                // sendChat('DEBUG INFO', 'The NPC is a Sidekick or a Henchman.');
                importantChar = true;
            }
        }
    }
    
    currentStatusMarkerString = obj.get("statusmarkers");
    if(currentStatusMarkerString === undefined || currentStatusMarkerString === "") {
        currentStatusMarkerArray = [];
    }
    else if(currentStatusMarkerString.indexOf(",") === -1) {
        currentStatusMarkerArray[0] = currentStatusMarkerString;
    }
    else{
        currentStatusMarkerArray = currentStatusMarkerString.split(",");
    }
    // sendChat('DEBUG INFO', 'Value of the Marker Array: '+currentStatusMarkerArray+' Type of the Marker Array: '+typeof currentStatusMarkerArray+'.');
    
    // bleedingStatus, deadStatus = true if an "Bleeding" or "dead" is the start of any given array element, false otherwise.
    bleedingStatus = currentStatusMarkerString.includes("Bleeding::492665");
    deadStatus = currentStatusMarkerString.includes("dead");
    
    // sendChat('DEBUG INFO', '(BEFORE HP calculation changes) hpValue: '+hpValue+' hpMax: '+hpMax+' tokenName: '+obj.get("name")+' | charName: '+representsName+' | importantChar: '+importantChar+' | currentStatusMarkerString: '+currentStatusMarkerString+' | bleedingStatus: '+bleedingStatus+' | deadStatus: '+deadStatus+'.'); 
    
    // Dead or dying...
    if(hpValue <= 0) {
        // Set dead status marker and remove bloodied status marker and any tints, send dying message (if 'importantChar'), then return.
        //  ** Object Set acceptable syntax: obj.set("property", newvalue); or obj.set({property: newvalue, property2: newvalue2}); **
        
        if(bleedingStatus) {
            filteredStatusMarkerArray = subArrayFuction(currentStatusMarkerArray, "Bleeding::492665"); 
            currentStatusMarkerArray = filteredStatusMarkerArray;
        }
        
        if(!deadStatus) {
            if(currentStatusMarkerArray.length = 0) {
                currentStatusMarkerArray[0] = ("dead");
            }
            else{
                currentStatusMarkerArray.push("dead");
            }
        }
        
        newStatusMarkerString = currentStatusMarkerArray.toString();
          
        obj.set({
            tint_color: "transparent",
            statusmarkers: newStatusMarkerString
        });
        
        if(importantChar) {
            sendChat('DYING', obj.get("name") + ' is unconscious and dying.');               
        }
        return;
    }
    else if(deadStatus) {
        filteredStatusMarkerArray = subArrayFuction(currentStatusMarkerArray, "dead"); 
        currentStatusMarkerArray = filteredStatusMarkerArray;
    }
    
    // Determine current hitpoint ratio "bar1_value" / "bar1_max"
    hpRatio = hpValue / hpMax;
    
    // Determine "Bleeding" token status marker one time, so we're not doing it in each 'if' conditional statement
    if(hpRatio <= 0.5 && !bleedingStatus) {
        if(currentStatusMarkerArray.length = 0) {
            currentStatusMarkerArray[0] = ("Bleeding::492665");
        }
        else{
            currentStatusMarkerArray.push("Bleeding::492665");
        }
    }
    else if(hpRatio > 0.5 && bleedingStatus) {
        filteredStatusMarkerArray = subArrayFuction(currentStatusMarkerArray, "Bleeding::492665");
        currentStatusMarkerArray = filteredStatusMarkerArray;
    }
    
    newStatusMarkerString = currentStatusMarkerArray.toString();
    // sendChat('DEBUG INFO', 'After dead/bleeding/hp calculations, newStatusMarkerString: '+newStatusMarkerString+'.');
    
    // Gravely wounded  
    if(hpRatio <= 0.25) {
        obj.set({
            tint_color: "#ff0000",
            statusmarkers: newStatusMarkerString
        });
        if(importantChar) {
            sendChat('GRAVELY WOUNDED', obj.get("name") + ' is gravely wounded.');               
        }
    }
    // Bloodied
    else if(hpRatio <= 0.5) {
        obj.set({
            tint_color: "#ffff00",
            statusmarkers: newStatusMarkerString
        });
        if(importantChar) {
            sendChat('BLOODIED', obj.get("name") + ' is bloodied.');               
        }        
    }
    // Injured
    else if(hpRatio <= 0.75) {
        obj.set({
            tint_color: "#ffff00",
            statusmarkers: newStatusMarkerString
        });
        if(importantChar) {
            sendChat('INJURED', obj.get("name") + ' is injured.');               
        }                 
    }
    // Still pretty healthy...  
    else{
        obj.set({
            tint_color: "transparent",
            statusmarkers: newStatusMarkerString
        });           
    }
    
    // subArrayFunction will return a subArray of the mainArray without the elements that contain (include) filterTest string. mainArray is assumed to be a statusmarker string
    // convrerted to an array, where each element of the array is a string.
    function subArrayFunction(mainArray, filterTest) {
        "use strict";
        
        var filteredArray = [],
            arrayElement;
                 
        for (arrayElement of mainArray) {
            if(!arrayElement.includes(filterTest)) {
                if(filteredArray.length = 0) {
                    filteredArray[0] = arrayElement;
                }
                else{
                filteredArray.push(arrayElement); 
                }
            }        
        }    
        return filteredArray;        
    }
        
});
          
on('ready',function() {
    "use strict";
    
   log('BloodiedOrDead Install Info: v'+version+' Last Update: '+lastUpdate);
      
});
