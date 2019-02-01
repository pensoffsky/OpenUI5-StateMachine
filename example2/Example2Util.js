sap.ui.define(["sap/ui/base/Object"],
  function(Object) {
    "use strict";

    var Example2Util = Object.extend("Example2Util", {
        constructor: function() {
            Object.apply(this);            
          }
    });

    // //////////////////////////////////////////////////////
    // /// Public functions
    // //////////////////////////////////////////////////////

    Example2Util.prototype.doStuff = function () {
       console.log("doing stuff...");
    };

    Example2Util.prototype.reload = function () {
        window.location.reload();
    };
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return Example2Util;

}, /* bExport= */ true);
