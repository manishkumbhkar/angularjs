
app.controller('listController',['$scope', 'repository','identifier',
	function($scope, repository, identifier){
		repository.getAll().success(function(data) {
			$scope[identifier+"s"] = data.data;
		});
	}
]);

app.controller('detailController',['$scope','$modal', 'repository','identifier',
	function($scope, $modal, repository, identifier) {		
		$scope.open = function (itemId) {
			repository.getById(itemId).success(function(data) {
				$scope[identifier] = data.data;
				var modalInstance = $modal.open({
					templateUrl: 'assets/'+identifier+'/detail.html',
					controller: 'detailControllerModal',
					resolve: {
						item: function () {return $scope[identifier];},
						identifier: function () {return identifier;}
					}
				});
			});
		};
		
		$scope.master = {};
		$scope.activePath = null;
				
		$scope.reset = function() {
			$scope[identifier] = angular.copy($scope.master);
		};
				
		$scope.add = function () {
			var modalInstance = $modal.open({
				templateUrl: 'assets/'+identifier+'/add.html',
				controller: 'detailControllerModalAdd',
				resolve: {
					repository: function () {return repository;}
				}
			});
			modalInstance.result.then(function () {
				$scope.reset();
				$scope.activePath = $location.path('/');
			});
		};
		
		$scope.edit = function (itemId) {
			repository.getById(itemId).success(function(data) {
				$scope[identifier] = data.data;
				var modalInstance = $modal.open({
					templateUrl: 'assets/'+identifier+'/edit.html',
					controller: 'detailControllerModalEdit',
					resolve: {
						item: function () {return $scope[identifier];},
						repository: function () {return repository;},
						identifier: function () {return identifier;}
					}
				});
				modalInstance.result.then(function () {
					$scope.reset();
					$scope.activePath = $location.path('/');
				});
			});
		};
		
		$scope.deleteById = function (itemId) {
			$scope.itemId = itemId;
			var modalInstance = $modal.open({
				templateUrl: 'assets/'+identifier+'/delete.html',
				controller: 'detailControllerModalDelete',
				resolve: {
					repository: function () {return repository;},
					itemId: function () {return $scope.itemId;}
				}
			});
			modalInstance.result.then(function () {
				$scope.reset();
				$scope.activePath = $location.path('/');
			});
		};
	}
]);

app.controller('detailControllerModal', ['$scope', '$modalInstance', 'item', 'identifier',
	function($scope, $modalInstance, item, identifier) {
		$scope[identifier] = item;
		$scope.ok = function () {
			$modalInstance.close();
		};
	}
]);

app.controller('detailControllerModalAdd', ['$scope', '$route', '$modalInstance', 'repository',
	function($scope, $route, $modalInstance, repository) {
		$scope.save = function (item) {
			repository.save(item)
				.success(function(){
					$modalInstance.close();
					$route.reload();
				})};
	
		$scope.cancel = function () {
			$modalInstance.close();
		};
	}
]);

app.controller('detailControllerModalEdit', ['$scope', '$route', '$modalInstance', 'repository', 'item', 'identifier',
	function($scope, $route, $modalInstance, repository, item, identifier) {
		$scope[identifier] = item;
		$scope.update = function (item) {
			repository.update(item)
				.success(function(data){
					$modalInstance.close();
					$route.reload();
				});
			};
		$scope.cancel = function () {
			$modalInstance.close();
		};
	}
]);

app.controller('detailControllerModalDelete', ['$scope', '$route', '$modalInstance', 'repository','itemId',
	function($scope, $route, $modalInstance, repository, itemId) {
		$scope.itemId = itemId;
		$scope.deleteById = function (itemId) {
			repository.deleteById(itemId)
				.success(function(){
					$modalInstance.close();
					$route.reload();
				})};
		
		$scope.cancel = function () {
			$modalInstance.close();
		};
	}
]);