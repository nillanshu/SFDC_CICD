public with sharing class GetQuotes {

    @AuraEnabled(cacheable=true)
    public static List<SBQQ__Quote__c> getTheQuotes(String recordId) {
        List<SBQQ__Quote__c> quotes = [SELECT Id, Name FROM SBQQ__Quote__c WHERE SBQQ__Opportunity2__c = :recordId LIMIT 10];
        return quotes;
    }
}