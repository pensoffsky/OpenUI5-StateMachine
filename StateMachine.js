sap.ui.define(['jquery.sap.global',
              'sap/ui/base/ManagedObject',
              './StateConfig'],
  function(jQuery, ManagedObject, StateConfig) {
    "use strict";

    var StateMachine = ManagedObject.extend("StateMachine", {
      metadata: {
        properties: {
        },
        events: {
        }
      },

      constructor : function() {
          ManagedObject.apply(this, arguments);
            this._oStateConfigs = {};
            this._sCurrentState = undefined;
            this._sInitialState = undefined;
        }

    });

// //////////////////////////////////////////////////////
// /// Public functions
// //////////////////////////////////////////////////////

    /**
     * configure the state of the machine.
     * @param  {[type]} sState [description]
     * @return {[type]}        [description]
     */
    StateMachine.prototype.configure = function(sState) {
      var oStateConfig = this._oStateConfigs[sState];
      if(!oStateConfig){
        oStateConfig = new StateConfig(sState);
        this._oStateConfigs[sState] = oStateConfig;
      }
      return oStateConfig;
    };

    /**
     * execute a trigger on the current state
     * @param  {[type]} sTrigger [description]
     * @return {[type]}          [description]
     */
    StateMachine.prototype.fire = function(sTrigger) {
      var oCurrentStateConfig = this._oStateConfigs[this._sCurrentState];
      var sNextState = oCurrentStateConfig.getStateForTrigger(sTrigger);
      
      
      if (sNextState === undefined){
         //the current state does not allow transition with the given sTrigger
         throw("invalid trigger");
      }
      
      var oNextStateConfig = this._oStateConfigs[sNextState];

      oCurrentStateConfig.executeBeforeExit();
      this._sCurrentState = sNextState;
      oNextStateConfig.executeOnEntry();
    };

    StateMachine.prototype.setInitialState = function(sState) {
      this._sCurrentState = sState;
      this._sInitialState = sState;
    };

    StateMachine.prototype.getState = function() {
      return this._sCurrentState;
    };
    
    StateMachine.prototype.reset = function() {
      this._sCurrentState = this._sInitialState;
    };

// //////////////////////////////////////////////////////
// /// Private functions
// //////////////////////////////////////////////////////

    return StateMachine;

}, /* bExport= */ true);
