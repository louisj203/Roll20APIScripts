// Github:   https://github.com/louisj203/Roll20APIScripts/edit/master/BloodiedOrDead/BloodiedOrDead.js
// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t
// *NOTE* This script assumes bar_1 is used for HP and that the "Bloodied" status marker is part of your status marker set.

const version = "0.0.1",
      lastUpdate = 2010091600;

var importantChar = true;

on("change:graphic", function(obj) {

    var hpValue = obj.get("bar1_value");
    var hpMax = obj.get("bar1_max");
      
    sendChat('HELLO', 'Hello on event, hpValue: ' +hpValue+ ', hpMax: ' +hpMax); 
      
    if(obj.get("bar1_max") == "" || obj.get("bar1_value" == "")) {
        return;
    }
    
    sendChat('HELLO2', 'Hello in event past initial return'); 
      
    //Determine way to set importantChar to true of false..
      
    if(obj.get("bar1_value") <= 0) {
        //Set dead status marker and remove bloodied status marker and any tints, send dying message (if is a named character), then return.
        //  ** Object Set acceptable syntax: obj.set("property", newvalue) or obj.set({property: newvalue, property2: newvalue2}) **
        obj.set({
            tint_color: "transparent",
            status_bleeding: false,
            status_dead: true
        });
        if(importantChar) {
        //Send a message to everyone of the players dying status
            sendChat('DYING', (obj.get("name")) + ' is unconscious and dying.');               
        }
    return;
    }
    else {
      obj.set("status_dead", false)
    }
    
    //Determine current hitpoint ration "bar1_value" / "bar1_max"
    var hpRatio = (obj.get("bar1_value") / obj.get("bar1_max"));
    
    if(hpRatio <= 0.25) {   //Gravely wounded    
        obj.set({
            tint_color: "#ff0000",
            status_bleeding: true
        });
        if(importantChar) {
        //Send a message to everyone of the players gravely wounded status
            sendChat('GRAVELY WOUNDED', (obj.get("name")) + '  is gravely wounded.');               
        }
    }
    else if(hpRatio <= 0.5) {   //Bloodied
        obj.set({
            tint_color: "#ffff00",
            status_bleeding: true
        });
        if(importantChar) {
        //Send a message to everyone of the players bloodied status
            sendChat('BLOODIED', (obj.get("name")) + '  is bloodied.');               
        }        
    }
    else if(hpRatio <= 0.75) {    //Injured
        obj.set({
            tint_color: "#ffff00",
            status_bleeding: false
        });
        if(importantChar) {
        //Send a message to everyone of the players injured status
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
