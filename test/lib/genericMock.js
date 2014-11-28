
function buildFakeModal(){
	return {
		command: null,
		modal: function(command) {
			this.command = command;
		}
	}
};

function buildFakeModalPromise(){
	return {
		then: function(callback) {
			callback(fakeModal);
		}
	}
};

function buildFakeRepository(returnsFunction){
	if(returnsFunction==null){
		returnsFunction = function(){
			return{
				result:"ok",
				data:{}
			};
		}
	}
	return {
		calledMethod : "",
		calledObject : null,
		
		getAll : function() {
			calledMethod = "getAll";
			calledObject = null;
			return returnsFunction();
		},
		
		getById : function(id) {
			calledMethod = "getById";
			calledObject = id;
			return returnsFunction();
		},
		
		save : function(item) {
			calledMethod = "save";
			calledObject = item;
			return returnsFunction();
		},
		
		deleteById : function(id) {
			calledMethod = "deleteById";
			calledObject = id;
			return returnsFunction();
		},
		
		update : function(item) {
			calledMethod = "update";
			calledObject = item;
			return returnsFunction();
		}
	}
}
