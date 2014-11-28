
var app = angular.module('ContactsApp', ['ui.bootstrap']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {templateUrl: 'assets/contact/list.html',controller: 'ContactsListController'})
		.otherwise({redirectTo: '/'});
});

app.controller('EmptyController', [
	function() {
    
	}
]);
