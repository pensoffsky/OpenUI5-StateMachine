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

      oCurrentStateConfig.executeBeforeExit();
      this._sCurrentState = sNextState;
      oNextStateConfig.executeOnEntry();
    };

    StateMachine.prototype.setInitialState = function(sState, bFireInitialStateEvent) {
      this._sCurrentState = sState;
      this._sInitialState = sState;
      
      if(bFireInitialStateEvent === true){
          var oCurrentStateConfig = this._oStateConfigs[this._sCurrentState];
          oCurrentStateConfig.executeOnEntry();
      }
    };
    
    StateMachine.prototype.reset = function() {
      this._sCurrentState = this._sInitialState;
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

    return StateMachine;

}, /* bExport= */ true);
