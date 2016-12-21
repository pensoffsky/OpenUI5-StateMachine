sap.ui.define(['jquery.sap.global',
              'sap/ui/base/ManagedObject',
              './StateConfig'],
  function(jQuery, ManagedObject, StateConfig) {
    "use strict";

    var StateMachine = ManagedObject.extend("StateMachine", {
      metadata: {
        properties: {
          repeat: {
            type: "boolean",
              defaultValue: true
            }
        },
        events: {
	        press : {},
	        animationFinished : {},
	        animationStarted : {}
        }
      }
    });


// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    StateMachine.prototype._oStateConfigs = {};
    StateMachine.prototype._sCurrentState = null;

    StateMachine.prototype.configure = function(sState) {
      var oStateConfig = new StateConfig(sState);
      this._oStateConfigs[sState] = oStateConfig;
      return oStateConfig;
    };

    StateMachine.prototype.fire = function(sTrigger) {
      var oCurrentStateConfig = this._oStateConfigs[this._sCurrentState];
      var sNextState = oCurrentStateConfig.getStateForTrigger(sTrigger);
      var oNextStateConfig = this._oStateConfigs[sNextState];

      oCurrentStateConfig.executeBeforeExit();
      this._sCurrentState = sNextState;
      oNextStateConfig.executeOnEntry();
    };

    StateMachine.prototype.test = function() {
      return false;
    };

    StateMachine.prototype.setInitialState = function(sState) {
      this._sCurrentState = sState;
    };

    StateMachine.prototype.getState = function() {
      return this._sCurrentState;
    };




// //////////////////////////////////////////////////////
// /// Private functions
// //////////////////////////////////////////////////////

    return StateMachine;

}, /* bExport= */ true);
