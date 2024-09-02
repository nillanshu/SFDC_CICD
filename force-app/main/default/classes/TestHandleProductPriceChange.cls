@isTest
private class TestHandleProductPriceChange {
    static testMethod void testPriceChange() {
        Invoice_Statement__c invoice = new Invoice_Statement__c(Status__c = 'Negotiating');
        insert invoice;
        
        Merchandise__c[] products = new Merchandise__c[] {
            new Merchandise__c( Name = 'item 1', Description__c = 'test product 1', Price__c = 10, Inventory__c = 10),
            new Merchandise__c( Name = 'item 2', Description__c = 'test product 2', Price__c = 11, Inventory__c = 10)
        };
        insert products;
        
        Line_Item__c[] lineItems = new Line_Item__c[] {
            new Line_Item__c(Invoice_Statement__c = invoice.id, Merchandise__c = products[0].id, Unit_Price__c = 10, Units_Sold__c = 3),
            new Line_Item__c(Invoice_Statement__c = invoice.id, Merchandise__c = products[1].id, Unit_Price__c = 11, Units_Sold__c = 6)
        };
        insert lineItems;
        
        //update the price of a merchandise record
        products[0].Price__c = 20;
        products[1].Price__c = 5;
        Test.startTest();
        update products;
        Test.stopTest();
        
        lineItems = [SELECT id, Unit_Price__c FROM Line_Item__c WHERE id IN :LineItems];
        system.assert(lineItems[0].Unit_Price__c == 10);
        system.assert(lineItems[1].Unit_Price__c == 5);
    }
}