public class LineItemList {
	public List<Line_Item__c> getLineItems() {
        List<Line_Item__c> results = Database.query(
            'SELECT Name, Units_Sold__c, Unit_Price__c, Value__c, Invoice_Statement__r.Name ' +
            'FROM Line_Item__c '
        );
        return results;
    }
    
    public Decimal getTotalValue() {
        Decimal totalValue = 0;
        List<Line_Item__c> items = this.getLineItems();
        for(Line_Item__c item : items) {
            totalValue += item.Value__c;
        }
        return totalValue;
    }
}