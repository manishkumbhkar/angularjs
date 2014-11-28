
describe("ContactsApp-Controllers", function() {
    beforeEach(module('ContactsApp'));
	describe("listController", function() {
		var repositoryService  = buildMockRepository();
		var listController;
		var scope;
		
		beforeEach(inject(function($rootScope, $controller) {
			scope = $rootScope.$new();
			listController = $controller('listController',{
					$scope:scope,
					repository:repositoryService,
					identifier:'test'
				});
		}));
		
		it('listController should be declared',function() {
			expect(listController).toBeDefined();
		});
		
		it('listController should call the repository getAll',function(){
			expect(repositoryService.calledMethod).toBe("getAll");
			expect(repositoryService.calledObject).toBe(null);
		});
		
		it('listController should set the result variable on the scope',function(){
			expect(scope.test).not.toBe(null);
		});
	});

	
	
	describe("detailController", function() {
		var id = 'testId';
		var mockObject = {
				id:id
			};
		var repositoryService  = buildMockRepository(mockObject);
		
		var detailController;
		var mockModal = buildMockModal();
		
		beforeEach(inject(function($rootScope, $controller) {
			scope = $rootScope.$new();
			detailController = $controller('detailController',{
					$scope:scope,
					$modal:mockModal,
					repository:repositoryService,
					identifier:'test'
				});
		}));
		
		it('detailController should be declared',function() {
			expect(detailController).toBeDefined();
		});
		
		describe("open", function() {
			it("open function should be added to scope", function() {
				expect(scope.open).toBeDefined();
			});
			
			it('open function should call the repository getById',function(){
				scope.open(id);
				expect(repositoryService.calledMethod).toBe("getById");
				expect(repositoryService.calledObject).toBe(id);
			});
			
			it('open function should call the $modal open',function(){
				scope.open(id);
				expect(mockModal.openCalled).toBe(true);
			});
			
			it('open function should call the $modal with the correct parameters',function(){
				scope.open(id);
				expect(mockModal.openParam).not.toBe(null);
				expect(mockModal.openParam.templateUrl).toBe("assets/test/detail.html");
				expect(mockModal.openParam.controller).toBe("detailControllerModal");
			});
		});
	
		describe("add", function() {
			it("add function should be added to scope", function() {
				expect(scope.add).toBeDefined();
			});
			
			it('add function should call the $modal open',function(){
				scope.add();
				expect(mockModal.openCalled).toBe(true);
			});
			
			it('add function should call the $modal with the correct parameters',function(){
				scope.add();
				expect(mockModal.openParam).not.toBe(null);
				expect(mockModal.openParam.templateUrl).toBe("assets/test/add.html");
				expect(mockModal.openParam.controller).toBe("detailControllerModalAdd");
			});
		});
	
		describe("update", function() {
			it("edit function should be added to scope", function() {
				expect(scope.edit).toBeDefined();
			});
			
			it('edit function should call the repository getById',function(){
				scope.edit(mockObject);
				expect(repositoryService.calledMethod).toBe("getById");
				expect(repositoryService.calledObject).toBe(mockObject);
			});
			
			it('edit function should call the $modal open',function(){
				scope.edit(mockObject);
				expect(mockModal.openCalled).toBe(true);
			});
			
			it('edit function should call the $modal with the correct parameters',function(){
				scope.edit(mockObject);
				expect(mockModal.openParam).not.toBe(null);
				expect(mockModal.openParam.templateUrl).toBe("assets/test/edit.html");
				expect(mockModal.openParam.controller).toBe("detailControllerModalEdit");
			});
		});
		
		
		describe("deleteById", function() {
			it("deleteById function should be added to scope", function() {
				expect(scope.open).toBeDefined();
			});
			
			it('deleteById function should call the $modal open',function(){
				scope.deleteById(id);
				expect(mockModal.openCalled).toBe(true);
			});
			
			it('open function should call the $modal with the correct parameters',function(){
				scope.deleteById(id);
				expect(mockModal.openParam).not.toBe(null);
				expect(mockModal.openParam.templateUrl).toBe("assets/test/delete.html");
				expect(mockModal.openParam.controller).toBe("detailControllerModalDelete");
			});
		});
	});
});
