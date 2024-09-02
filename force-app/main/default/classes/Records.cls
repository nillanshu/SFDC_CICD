public class Records {
				@AuraEnabled(cacheable=true)
    				public static List<Merchandise__c> getAllMerchandise(){
        					return [SELECT Id, Name, Price__c, Inventory__c FROM Merchandise__c];
    				}
}