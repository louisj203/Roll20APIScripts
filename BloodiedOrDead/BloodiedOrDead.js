// Github:   https://github.com/louisj203/Roll20APIScripts/edit/master/BloodiedOrDead/BloodiedOrDead.js
// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t
// *NOTE* This script assumes bar_1 is used for HP and that the "Bloodied" status marker is part of your status marker set.

const version = "0.0.8",
      lastUpdate = 2010100600;

on("change:graphic", function(obj) {

    var importantChar = true,
        hpValue,
        hpMax;

    sendChat('HELLO', 'Well here we are'); 
      
    hpValue = obj.get("bar1_value");
    hpMax = obj.get("bar1_max");
      
    sendChat('HELLO', 'Well here we are after hp value and max assignments'); 
      
    if(IsNaN(hpMax) || hpMax == 0 || IsNaN(hpValue)) return;
    
    sendChat('HELLO', 'Hello in event past initial return'); 
      
    //Determine way to set importantChar to true of false..
      
    if(hpValue <= 0) {
        //Set dead status marker and remove bloodied status marker and any tints, send dying message (if 'importantChar'), then return.
        //  ** Object Set acceptable syntax: obj.set("property", newvalue) or obj.set({property: newvalue, property2: newvalue2}) **
        obj.set({
            tint_color: "transparent",
            status_bleeding: false,
            status_dead: true
        });
        if(importantChar) {
        //Send a message to everyone of the creatures dying status
            sendChat('DYING', (obj.get("name")) + ' is unconscious and dying.');               
        }
    return;
    }
    else {
      obj.set("status_dead", false)
    }
    
    //Determine current hitpoint ratio "bar1_value" / "bar1_max"
    var hpRatio = hpValue / hpMax;
    
    //Gravely wounded  
    if(hpRatio <= 0.25) {       
        obj.set({
            tint_color: "#ff0000",
            status_bleeding: true
        });
        if(importantChar) {
        //Send a message to everyone of the creatures gravely wounded status
            sendChat('GRAVELY WOUNDED', (obj.get("name")) + '  is gravely wounded.');               
        }
    }
    //Bloodied
    else if(hpRatio <= 0.5) {
        obj.set({
            tint_color: "#ffff00",
            status_bleeding: true
        });
        if(importantChar) {
        //Send a message to everyone of the characters bloodied status
            sendChat('BLOODIED', (obj.get("name")) + '  is bloodied.');               
        }        
    }
    else if(hpRatio <= 0.75) {    //Injured
        obj.set({
            tint_color: "#ffff00",
            status_bleeding: false
        });
        if(importantChar) {
        //Send a message to everyone of the creatures injured status
            sendChat('INJURED', (obj.get("name")) + '  is injured.');               
        }                 
    }
    else{   //Still pretty healthy...
        obj.set({
            tint_color: "transparent",
            status_bleeding: false
        });           
    }
    
});
          
on('ready',function() {
    'use strict';
    
   log('BloodiedOrDead Install Info: v'+version+' [lastUpdate: '+lastUpdate+']');
      
});
