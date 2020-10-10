// Github:   https://github.com/louisj203/Roll20APIScripts/edit/master/BloodiedOrDead/BloodiedOrDead.js
// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t
// *NOTE* This script assumes bar_1 is used for HP and that the "Bloodied" status marker is part of your status marker set.

const version = "0.0.8",
      lastUpdate = 2010100800;

on("change:graphic", function(obj) {

    var importantChar = true,
        hpValue,
        hpMax,
        currentStatusMarkerString,
        currentStatusMarkerArray,
        filteredStatusMarkerArray,
        bleedingStatus,
        deadStatus;

    hpValue = obj.get("bar1_value");
    if(isNaN(hpValue)) return;
      
    hpMax = obj.get("bar1_max");
    if(isNaN(hpMax)) return;
    if(hpMax <= 0) return;
      
    // Determine way to set importantChar to true of false.. for now assuming it's true.
      
    currentStatusMarkerString = obj.get("statusmarkers");
    currentStatusMarkerArray = currentStatusMarkerString.split(",");
    
    // bleedingStatus, deadStatus = true if an "Bleeding" or "dead" is the start of any given array element, false otherwise.
    
    bleedingStatus = currentStatusMarkerString.includes(",Bleeding");
    deadStatus = currentStatusMarkerString.includes(",dead");
    
    // Dead or dying...
    if(hpValue <= 0) {
        // Set dead status marker and remove bloodied status marker and any tints, send dying message (if 'importantChar'), then return.
        //  ** Object Set acceptable syntax: obj.set("property", newvalue) or obj.set({property: newvalue, property2: newvalue2}) **
        
        if(bleedingStatus) {
                
        }
        obj.set({
            tint_color: "transparent",
            status_Bleeding: false,
            status_dead: true
        });
        if(importantChar) {
        //Send a message to everyone of the creatures dying status
            sendChat('DYING', obj.get("name") + ' is unconscious and dying.');               
        }
    return;
    }
    else {
        obj.set("status_dead", false)
    }
    
    // Determine current hitpoint ratio "bar1_value" / "bar1_max"
    var hpRatio = hpValue / hpMax;
    
    // Gravely wounded  
    if(hpRatio <= 0.25) {       
        obj.set({
            tint_color: "#ff0000",
            status_Bleeding: true
        });
        if(importantChar) {
        // Send a message to everyone of the creatures gravely wounded status
            sendChat('GRAVELY WOUNDED', obj.get("name") + ' is gravely wounded.');               
        }
    }
    // Bloodied
    else if(hpRatio <= 0.5) {
        obj.set({
            tint_color: "#ffff00",
            status_Bleeding: true
        });
        if(importantChar) {
        // Send a message to everyone of the creatures bloodied status
            sendChat('BLOODIED', obj.get("name") + ' is bloodied.');               
        }        
    }
    // Injured
    else if(hpRatio <= 0.75) {
        obj.set({
            tint_color: "#ffff00",
            status_Bleeding: false
        });
        if(importantChar) {
        // Send a message to everyone of the creatures injured status
            sendChat('INJURED', obj.get("name") + ' is injured.');               
        }                 
    }
    // Still pretty healthy...  
    else{
        obj.set({
            tint_color: "transparent",
            status_Bleeding: false
        });           
    }
    
    // subArrayFunction will return a subArray of the mainArray without the elements that match filterTest
    function subArrayFunction(mainArray, filterTest) {
        
        var filteredArray,
            mainArrayLength = mainArray.length;
        
    
        return filteredArray;
        
    }
        
});
          
on('ready',function() {
    'use strict';
    
   log('BloodiedOrDead Install Info: v'+version+' [lastUpdate: '+lastUpdate+']');
      
});
