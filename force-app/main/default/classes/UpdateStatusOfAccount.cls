public class UpdateStatusOfAccount implements Queueable{
    public void execute(QueueableContext context) {
        List<Account> accounts = [SELECT Id, Status__c FROM Account];

        for (Account acc : accounts) {
            acc.Status__c = 'Prospect';
        }
        update accounts;
    }
}