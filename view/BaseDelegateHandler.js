sap.ui.define(['jquery.sap.global',
               'sap/ui/base/Object'],
  function(jQuery, Object) {
    "use strict";

    var BaseDelegateHandler = Object.extend("BaseDelegateHandler", {

      constructor : function() {
        Object.apply(this, arguments);
        
        }
    });


// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    BaseDelegateHandler.prototype.getDelegateFunctions = function (fFunction) {
        return [];
    };

    BaseDelegateHandler.prototype.setControllerDelegate = function (oControllerDelegate) {
        var aMandatoryFunctions = this.getDelegateFunctions();
        for (var i = 0; i < aMandatoryFunctions.length; i++) {
            this.assertIsFunction(oControllerDelegate[aMandatoryFunctions[i]]);
        }
        
        this._oControllerDelegate = oControllerDelegate;
    };

// //////////////////////////////////////////////////////
// /// Private functions
// //////////////////////////////////////////////////////

    

    BaseDelegateHandler.prototype.assertIsFunction = function (fFunction) {
        if (fFunction && typeof fFunction === "function"){
            return true;
        }
        throw("not a function");
    };

    return BaseDelegateHandler;

}, /* bExport= */ true);
