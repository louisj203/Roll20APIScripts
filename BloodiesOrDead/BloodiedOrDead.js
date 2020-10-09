on("change:graphic", function(obj) {
    if(obj.get("bar1_max") === "") return;

    if(obj.get("bar1_value") <= 0) {
        //Set dead status marker and remove bloodied status marker and any tints, then return.
        obj.set({
            tint_color: "transparent"
            status_bleeding: false
            status_dead: true
        });
    return;
    }
    else {
      obj.set({
        status_dead: false
      });
    }
    
    if(obj.get("bar1_value") <= obj.get("bar1_max") / 2) {
        obj.set({
              status_redmarker: true
        });
    }
    else{
        obj.set({
            status_redmarker: false
        })
    }
    
});
