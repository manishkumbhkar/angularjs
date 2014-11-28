describe("ContactsApp-Contact Module", function() {
    beforeEach(module('ContactsApp'));
	
	describe("ContactsRepositoryService", function() {
		var contactsRepositoryService;
		var messageContent = { id:"objId", content:"Message Content"};
		
		beforeEach(inject(function(ContactsRepositoryService, _$httpBackend_){
			contactsRepositoryService = ContactsRepositoryService;
			$httpBackend = _$httpBackend_;
		}));
		
		it("getAll should make an ajax get call to api/contacts/", function () {
			$httpBackend.whenGET("api/contacts/").respond([{
				result: "ok",
				data :{}
			}]);
			expect(contactsRepositoryService.getAll()).toBeDefined();
		});
		
		it("getById should make an ajax get call to api/contacts/?id=objId", function () {
			$httpBackend.whenGET("api/contacts/?id=objId").respond([{
				result: "ok",
				data :{id:"objId"}
			}]);
			expect(contactsRepositoryService.getById('objId')).toBeDefined();
		});
		
		it("save should make an ajax post call to api/contacts/", function () {
			$httpBackend.whenPOST("api/contacts/",messageContent).respond([{
				result: "ok",
				data :{id:"objId"}
			}]);
			expect(contactsRepositoryService.save(messageContent)).toBeDefined();
		});
		
		it("update should make an ajax post call to api/contacts/?id=objId&request_method=PUT", function () {
			$httpBackend.whenPOST("api/contacts/?id=objId&request_method=PUT",messageContent).respond([{
				result: "ok",
				data :{id:"objId"}
			}]);
			expect(contactsRepositoryService.update(messageContent)).toBeDefined();
		});
		
		it("deleteById should make an ajax get call to api/contacts/?id=objId&request_method=DELETE", function () {
			$httpBackend.whenGET("api/contacts/?id=objId&request_method=DELETE").respond([{
				result: "ok",
				data :{id:"objId"}
			}]);
			expect(contactsRepositoryService.deleteById('objId')).toBeDefined();
		});
	});
});