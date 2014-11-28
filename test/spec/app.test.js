describe("ContactsApp-Core", function() {
    beforeEach(module('ContactsApp'));
	it('EmptyController should be declared', inject(function($controller) {
		ctrl = $controller('EmptyController');
		expect(ctrl).not.toBe(null);
	}));
});

/*
var $scope, ctrl;

//you need to inject dependencies first
beforeEach(inject(function($rootScope) {
    $scope = $rootScope.$new();        
}));

it('Should initialize value to Loading', inject(function($controller) {
    ctrl = $controller('MainNavController', {
        $scope: $scope
    });
    expect($scope.wksp_name).toBe('Loading...');
}));

describe("ContactsApp", function() {
    beforeEach(module('ContactsApp'));
    describe("EmptyController", function() {
        var scope;
        beforeEach(inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            $controller("EmptyController", {
                $scope: scope
            });
        }));
        it("EmptyController should exist", function() {
            
        });
    });
});*/