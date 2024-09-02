@isTest
public class UpdateStatusOfAccountTest {
	    @testSetup static void setup() {
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 1000; i++) {
            accounts.add(new Account(
                Name='Test Account'+i,
                Status__c = 'Closed'
            ));
        }
        insert accounts;
    }
    
    static testmethod void testQueueable() {
        UpdateStatusOfAccount inserter = new UpdateStatusOfAccount();
        Test.startTest();
        System.enqueueJob(inserter);
        Test.stopTest();
        List<Account> accounts = [SELECT Id, Name, Status__c FROM Account WHERE Status__c='Prospect'];
        System.assertEquals(1000, accounts.size(), 'Status should be changed to prospect of all the accounts');
    }
}