sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"state/StateMachine"
], function(Controller, MessageBox, MessageToast, StateMachine) {
	"use strict";

	return Controller.extend("view.Main", {

		// /////////////////////////////////////////////////////////////////////////////
		// /// Member
		// /////////////////////////////////////////////////////////////////////////////
		
		_oStateMachine : null,
		
/*	
               SAVE
          +-----------------+
          |                 |
          v      EDIT       |
      +-------+ --------> +----+
      |Display|           |Edit|
      +-------+ <-------- +----+
       ^    |       CANCEL
       |    |
 CANCEL|    | DELETE
       |    v
      +------+
      |Delete|
      +------+
          |
          | DeleteConfirm
          v
      +-------+
      |Deleted|
      +-------+
*/

		//define the possible states of the UI
		// _mStates : {
		// 	DisplayState: "DisplayState",
		// 	EditState: "EditState",
		// 	DeleteState: "DeleteState",
		// 	ObjectDeletedState: "ObjectDeletedState"
		// },

		//define the triggers that can change the state of the UI
		// _mTrigger : {
		// 	Edit: "Edit",
		// 	Cancel: "Cancel",
		// 	Delete: "Delete",
		// 	DeleteConfirm: "DeleteConfirm",
		// 	Save: "Save"
		// },

		// /////////////////////////////////////////////////////////////////////////////
		// /// Initialization
		// /////////////////////////////////////////////////////////////////////////////


		onInit: function() {
			
			//main0controller must implement interface iSTateMachine
			this._oStateMachine = ViewControllerSTate.createStateMachine(this)
			
			//main0controller must implement interface ITextOjbectHelper
			this._oTextObjectHelper = TextObjectHelper.createIndstance(this)
			
		},

		// /////////////////////////////////////////////////////////////////////////////
		// /// StateMachine Events
		// /////////////////////////////////////////////////////////////////////////////

		_onNavigatedToTextObject : function(oParams){
			this._oTextObjectHelper.bindXXX( oParams);
		},
		

		// /////////////////////////////////////////////////////////////////////////////
		// /// Button EventHandler
		// /////////////////////////////////////////////////////////////////////////////

		onEditPressed : function(){
			this._oStateMachine.fire(this._mTrigger.Edit);
		},
		
		onDeletePressed : function(){
			this._oStateMachine.fire(this._mTrigger.Delete);
		},
		
		onCancelPressed : function(){
			this._oStateMachine.fire(this._mTrigger.Cancel);
		},
		
		onSavePressed : function(){
			this._oStateMachine.fire(this._mTrigger.Save);
		}
		
	});

});