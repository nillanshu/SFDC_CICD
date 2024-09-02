public class InvoicePage {
	public List<Invoice_Statement__c> getInvoice() {
        List<Invoice_Statement__c> results = Database.query(
            'SELECT Name, Description__c, Invoice_Value__c ' +
            'FROM Invoice_Statement__c '
        );
        return results;
    }
}