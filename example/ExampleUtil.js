sap.ui.define(["sap/ui/base/Object"],
  function(Object) {
    "use strict";

    var ExampleUtil = Object.extend("ExampleUtil", {
        constructor: function() {
            Object.apply(this);            
          }
    });

    // //////////////////////////////////////////////////////
    // /// Public functions
    // //////////////////////////////////////////////////////

    ExampleUtil.prototype.doStuff = function () {
       console.log("doing stuff...");
    };

    ExampleUtil.prototype.reload = function () {
        window.location.reload();
    };
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return ExampleUtil;

}, /* bExport= */ true);
