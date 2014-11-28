
app.factory('ContactsRepositoryService',['$http',
	function($http) {
		return {
			apiBase : 'api/contacts/',
			http :$http,
			
			getAll : function() {
				return this.http.get(this.apiBase);
			},
			
			getById : function(contactId) {
				return this.http.get(this.apiBase+'?id='+contactId);
			},
			
			save : function(contact) {
				return this.http.post(this.apiBase, contact);
			},
			
			update : function(contact) {
				return this.http.post(this.apiBase+'?id='+contact.id+'&request_method=PUT', contact);
			},
			
			deleteById : function(contactId) {
				return this.http.get(this.apiBase+'?id='+contactId+'&request_method=DELETE');
			}
		}
	}
]);

app.controller('ContactsListController', ['$scope', '$controller', 'ContactsRepositoryService',
	function($scope, $controller, contactsRepositoryService) {
		$controller('listController',{
			$scope:$scope,
			repository:contactsRepositoryService,
			identifier:'contact'
		});
	}
]);

app.controller('ContactDetailController', ['$scope', '$controller', 'ContactsRepositoryService',
	function($scope, $controller, contactsRepositoryService) {
		$controller('detailController',{
			$scope:$scope,
			repository:contactsRepositoryService,
			identifier:'contact'
		});
	}
]);
