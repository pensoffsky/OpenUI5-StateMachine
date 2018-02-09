sap.ui.define(['jquery.sap.global',
                "state/view/BaseDelegateHandler"],
  function(jQuery, BaseDelegateHandler) {
    "use strict";

    var CaclulationLogic = BaseDelegateHandler.extend("CaclulationLogic", {
        constructor : function() {
            BaseDelegateHandler.apply(this, arguments);
          }
    });
    
    
    CaclulationLogic.create = function(oControllerDelegate) {
        var oCaclulationLogic = new CaclulationLogic();
        oCaclulationLogic.setControllerDelegate(oControllerDelegate);
        return oCaclulationLogic;
    };

// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    CaclulationLogic.prototype.plus = function (sValue1, sValue2) {
        return sValue1 + sValue2;
    };
    
    CaclulationLogic.prototype.plusAsync = function (fFunction) {
        return {};
    };
    
    CaclulationLogic.prototype.getPrefillValue = function (fFunction) {
        return 23;
    };
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return CaclulationLogic;

}, /* bExport= */ true);
