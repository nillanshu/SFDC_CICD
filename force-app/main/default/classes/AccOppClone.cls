public with sharing class AccOppClone {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [
            SELECT Id, Name, Website
            FROM Account
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(List<Id> accIds) {
        return [
            SELECT Id, Name, StageName, AccountId
            FROM Opportunity
            WHERE AccountId = :accIds
            ORDER BY CloseDate
        ];
    }

    @AuraEnabled
    public static Map<Id, List<Id>> cloneAccountsAndOpportunities(Map<Id, List<Id>> accountOpportunityIds) {
        Map<Id, Account> clonedAccounts = new Map<Id, Account>();
        List<Opportunity> clonedOpportunities = new List<Opportunity>();
    
        for (Id accountId : accountOpportunityIds.keySet()) {
            Account account = [SELECT Name FROM Account WHERE Id = :accountId];
            Account clonedAccount = account.clone(false, true, false, false);
            clonedAccount.Name = 'Cloned ' + clonedAccount.Name;
            clonedAccounts.put(accountId, clonedAccount);
        }
    
        insert clonedAccounts.values();
    
        for (Id accountId : accountOpportunityIds.keySet()) {
            List<Id> opportunityIds = accountOpportunityIds.get(accountId);
            List<Opportunity> opportunities = [SELECT Name, CloseDate, StageName FROM Opportunity WHERE AccountId = :accountId AND Id IN :opportunityIds];
            for (Opportunity opportunity : opportunities) {
                Opportunity clonedOpportunity = opportunity.clone(false, true, false, false);
                clonedOpportunity.AccountId = clonedAccounts.get(accountId).Id;
                clonedOpportunity.Name = 'Cloned ' + clonedOpportunity.Name;
                clonedOpportunities.add(clonedOpportunity);
            }
        }
    
        insert clonedOpportunities;
    
        Map<Id, List<Id>> result = new Map<Id, List<Id>>();
        for (Opportunity clonedOpportunity : clonedOpportunities) {
            if (!result.containsKey(clonedOpportunity.AccountId)) {
                result.put(clonedOpportunity.AccountId, new List<Id>());
            }
            result.get(clonedOpportunity.AccountId).add(clonedOpportunity.Id);
        }
    
        return result;
    }
}