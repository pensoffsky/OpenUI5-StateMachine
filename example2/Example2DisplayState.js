sap.ui.define(["sap/ui/base/Object"],
  function(Object) {
    "use strict";

    var Example2DisplayState = Object.extend("Example2DisplayState", {
        constructor: function(oControllerDelegate, oUtil, oViewModel) {
            Object.apply(this);
            this._oUtil = oUtil;
            this._oControllerDelegate = oControllerDelegate;
            this._oViewModel = oViewModel;
          }
    });

    // //////////////////////////////////////////////////////
    // /// Public functions
    // //////////////////////////////////////////////////////

    Example2DisplayState.prototype.enterState = function (oEvent) {
        this._oViewModel.setProperty("/sState", "Display");
        this._oViewModel.setProperty("/bEditButtonVisible", true);
        this._oViewModel.setProperty("/bDeleteButtonVisible", true);
        this._oViewModel.setProperty("/bCancelButtonVisible", false);
        this._oViewModel.setProperty("/bSaveButtonVisible", false);
        this._oViewModel.setProperty("/bReloadButtonVisible", false);
    }; 

    Example2DisplayState.prototype.onEditPressed = function (oEvent) {
        this._oControllerDelegate._oStateMachine.fire(this._oControllerDelegate._oStateMachine.getTriggers().Edit);        
    };

    Example2DisplayState.prototype.onDeletePressed = function (oEvent) {
        this._oControllerDelegate._oStateMachine.fire(this._oControllerDelegate._oStateMachine.getTriggers().Delete);
    };
    
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return Example2DisplayState;

}, /* bExport= */ true);
