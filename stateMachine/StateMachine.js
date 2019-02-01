sap.ui.define(['jquery.sap.global',
              'sap/ui/base/Object',
              './StateConfig'],
  function(jQuery, Object, StateConfig) {
    "use strict";

    var StateMachine = Object.extend("StateMachine", {
        
      constructor : function(mStates, mTriggers) {
          Object.apply(this, arguments);
          this._oStateConfigs = {};
          this._sCurrentState = undefined;
          this._sInitialState = undefined;
          this._mStates = undefined;
          this._mTriggers = undefined;
          this.setTriggers(mTriggers);
          this.setStates(mStates);
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
      
      var oEvent = {
          sLastState: this._sCurrentState,
          sNextState : sNextState,
          bCancelStateChange: false
      };
      oCurrentStateConfig.executeBeforeExit(oEvent);
      if(oEvent.bCancelStateChange === true){
          throw("exiting current state not allowed");
      }
      
      this._sCurrentState = sNextState;
      oNextStateConfig.executeOnEntry(oEvent);
      this._executeOnStateChanged(oNextStateConfig);
    };

    StateMachine.prototype.setInitialState = function(sState, bFireInitialStateEvent) {
      this._sCurrentState = sState;
      this._sInitialState = sState;
      
      if(bFireInitialStateEvent === true){
          var oCurrentStateConfig = this._oStateConfigs[this._sCurrentState];
          oCurrentStateConfig.executeOnEntry();
          this._executeOnStateChanged(oCurrentStateConfig);
      }
    };
    
    StateMachine.prototype.reset = function(bFireStateEvent) {
      this._sCurrentState = this._sInitialState;
      
      if(bFireStateEvent === true){
          var oCurrentStateConfig = this._oStateConfigs[this._sCurrentState];
          oCurrentStateConfig.executeOnEntry();
          this._executeOnStateChanged(oCurrentStateConfig);
      }
    };

    /**
     * setup a callback that is called when the state of the machine changed
     * @param  {function} fnCallback   callback to call when a new state is active
     * @return {object}          the stateMachine object for chaining
     */
    StateMachine.prototype.onStateChanged = function(fnCallback) {
      this._fnOnStateChanged = fnCallback;
      return this;
    };

    // //////////////////////////////////////////////////////
    // /// Setter & Getter
    // //////////////////////////////////////////////////////
    
    StateMachine.prototype.getState = function() {
      return this._sCurrentState;
    };
    
    StateMachine.prototype.getInitialState = function() {
      return this._sInitialState;
    };
    
    StateMachine.prototype.setStates = function(mStates) {
      this._mStates = mStates;
    };
    
    StateMachine.prototype.setTriggers = function(mTriggers) {
      this._mTriggers = mTriggers;
    };
    
    StateMachine.prototype.getStates = function() {
      return this._mStates;
    };
    
    StateMachine.prototype.getTriggers = function() {
      return this._mTriggers;
    };

// //////////////////////////////////////////////////////
// /// Private functions
// //////////////////////////////////////////////////////

    StateMachine.prototype._executeOnStateChanged = function (oCurrentStateConfig) {
      if(this._fnOnStateChanged) {
        this._fnOnStateChanged(oCurrentStateConfig);
      }
    };

    return StateMachine;

}, /* bExport= */ true);
