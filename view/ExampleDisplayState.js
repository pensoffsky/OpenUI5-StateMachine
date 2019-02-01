sap.ui.define(["sap/ui/base/Object"],
  function(Object) {
    "use strict";

    var ExampleDisplayState = Object.extend("ExampleDisplayState", {
        constructor: function(oControllerDelegate, oUtil, oViewModel, oStateMachine) {
            Object.apply(this);
            this._oUtil = oUtil;
            this._oControllerDelegate = oControllerDelegate;
            this._oViewModel = oViewModel;
            this._oStateMachine = oStateMachine;
          }
    });

    // //////////////////////////////////////////////////////
    // /// Public functions
    // //////////////////////////////////////////////////////

    ExampleDisplayState.prototype.enterState = function (oEvent) {
        this._oViewModel.setProperty("/sState", "Display");
        this._oViewModel.setProperty("/bEditButtonVisible", true);
        this._oViewModel.setProperty("/bDeleteButtonVisible", true);
        this._oViewModel.setProperty("/bCancelButtonVisible", false);
        this._oViewModel.setProperty("/bSaveButtonVisible", false);
        this._oViewModel.setProperty("/bReloadButtonVisible", false);
    }; 

    ExampleDisplayState.prototype.onEditPressed = function (oEvent) {
        this._oStateMachine.fire(this._oStateMachine.getTriggers().Edit);        
    };

    ExampleDisplayState.prototype.onDeletePressed = function (oEvent) {
        this._oStateMachine.fire(this._oStateMachine.getTriggers().Delete);
    };
    
    
    // //////////////////////////////////////////////////////
    // /// Private functions
    // //////////////////////////////////////////////////////


    return ExampleDisplayState;

}, /* bExport= */ true);
