sap.ui.define(['jquery.sap.global',
                "state/view/CalculationLogic"],
  function(jQuery, CalculationLogic) {
    "use strict";

    var SquaredCaclulationLogic = CalculationLogic.extend("SquaredCaclulationLogic", {
        constructor : function() {
            CalculationLogic.apply(this, arguments);
          }
    });
    
    
    SquaredCaclulationLogic.create = function(oControllerDelegate) {
        var oSquaredCaclulationLogic = new SquaredCaclulationLogic();
        oSquaredCaclulationLogic.setControllerDelegate(oControllerDelegate);
        return oSquaredCaclulationLogic;
    };

// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    SquaredCaclulationLogic.prototype.plus = function (sValue1, sValue2) {
        //changed the calculation compared to the original "CalculationLogic"
        return Math.pow(parseInt(sValue1, 10) + parseInt(sValue2, 10), 2);
    };
    
    SquaredCaclulationLogic.prototype.plusAsync = function (fFunction) {
        return {};
    };
    
    SquaredCaclulationLogic.prototype.getPrefillValue = function (fFunction) {
        return 42;
    };
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return SquaredCaclulationLogic;

}, /* bExport= */ true);
