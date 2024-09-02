trigger HandleProductPriceChange on Merchandise__c (after update) {
    //Update invoice line items associated with open invoices
    List<Line_Item__c> openLineItems = [Select j.Unit_Price__c, j.Merchandise__r.Price__c 
                                       from Line_Item__c j 
                                       where j.Invoice_Statement__r.Status__c = 'Negotiating' 
                                       AND j.Merchandise__r.id IN :Trigger.new 
                                       FOR UPDATE];
    
    for (Line_Item__c li: openLineItems) {
        if ( li.Merchandise__r.Price__c < li.Unit_Price__c ) {
            li.Unit_Price__c = li.Merchandise__r.Price__c;
        }
    }
    update openLineItems;
}