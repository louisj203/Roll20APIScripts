// Github:   https://github.com/louisj203/Roll20APIScripts/edit/master/BloodiedOrDead/BloodiedOrDead.js
// By:       GM Lou-T
// Contact:  https://app.roll20.net/users/2990909/lou-t

const version = "0.0.1",
      lastUpdate = 2010091600

on("change:graphic", function(obj) {
    if(obj.get("bar1_max") === "") return;
    
    var IsNamedCharacter = false
    if(obj.get("??TOKENTYPE" == ??) {
        IsNamedCharacter = true
    }

    if(obj.get("bar1_value") <= 0) {
        //Set dead status marker and remove bloodied status marker and any tints, send dying message (if is a player character), then return.
        //  Object Set acceptable syntax: obj.set("property", newvalue) or obj.set({property: newvalue, property2: newvalue2})
        obj.set({
            tint_color: "transparent",
            status_bleeding: false,
            status_dead: true
        });
        if(obj.get("IsPlayer??") {
        //Send a message to everyone of the players dying status
                       
        }
    return;
    }
    else {
      obj.set("status_dead", false)
    }
    
    //Determine current hitpoint ration "bar1_value" / "bar1_max"
    var hpRatio = obj.get("bar1_value") / obj.get("bar1_max);
    
    if(hpRatio <= 0.25) {   //Gravely wounded    
        obj.set({
            tint_color: "RED!!!"
            status_bleeding: true
        });
        if(obj.get("IsPlayer??") {
        //Send a message to everyone of the players gravely wounded status
                       
        }
    }
    elseif(hpRation <= 0.5) {   //Bloodied
        obj.set({
            tint_color: "YELLOW!!"
            status_bleeding: true
        });
        if(obj.get("IsPlayer??") {
        //Send a message to everyone of the players bloodied status
                       
        }        
    }
    elseif(hpRatio <= 0.75 {    //Injured
        obj.set({
            tint_color: "YELLOW!!"
            status_bleeding: false
        });
        if(obj.get("IsPlayer??") {
        //Send a message to everyone of the players injured status
                       
        }                 
    }
    else{   //Still pretty healthy...
        obj.set({
            tint_color: "transparent"
            status_bleeding: false
        });           
    }
    
});
