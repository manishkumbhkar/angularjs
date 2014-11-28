
function buildMockModal(){
	var modal = {
		openParam:null,
		closeParam:null,
		thenCalled:false,
		openCalled:false,
		closeCalled:false,
		mockModalInstance : {
			modal:null,
			close: function(param){
				modal.closeCalled = true;
				modal.closeParam = param;
				if(modal.callBack!=null){
					modal.thenCalled = true;
					callback(param);
				}
			}
		},
		callBack : null,
		command: null,
		open: function(param) {
			this.openCalled = true;
			this.openParam = param;
			return {
				result: {
					then: function(callback){
						this.callBack = callback;
					}
				}
			}
		} 
	}
	modal.mockModalInstance.modal = modal;
	return modal;
};

function buildMockRepository(dataToReturn = {},returnsFunction = null){
	if(returnsFunction==null){
		returnsFunction = function(){
			return{
				success: function(doCallback){
					var data = {
						result:"ok",
						data:dataToReturn
					};
					doCallback(data);
				}
			};
		}
	}
	return {
		calledMethod : "",
		calledObject : null,
		
		getAll : function() {
			this.calledMethod = "getAll";
			this.calledObject = null;
			return returnsFunction();
		},
		
		getById : function(id) {
			this.calledMethod = "getById";
			this.calledObject = id;
			return returnsFunction();
		},
		
		save : function(item) {
			this.calledMethod = "save";
			this.calledObject = item;
			return returnsFunction();
		},
		
		update : function(item) {
			this.calledMethod = "update";
			this.calledObject = item;
			return returnsFunction();
		},
		
		deleteById : function(id) {
			this.calledMethod = "deleteById";
			this.calledObject = id;
			return returnsFunction();
		}
	}
}
