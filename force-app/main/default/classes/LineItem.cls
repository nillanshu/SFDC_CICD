public class LineItem {
	public List<Line_Item__c> getLineItems() {
        List<Line_Item__c> results = Database.query(
            'SELECT Name, Units_Sold__c, Unit_Price__c, Value__c, Invoice_Statement__r.Name' +
            'FROM Line_Item__c '
        );
        return results;
    }
}