public class InsertThousandOppRecords implements Database.Batchable<sObject>, Database.Stateful {
	public Integer recordsProcessed = 0;
	public Database.QueryLocator start(Database.BatchableContext bc) {
        // collect the batches of records or objects to be passed to execute
        return Database.getQueryLocator(
            'SELECT ID, Name, StageName FROM Opportunity '
        );
    }
    public void execute(Database.BatchableContext bc, List<Opportunity> records){
        // process each batch of records
        for (Opportunity opp : records) {
            opp.StageName = 'Prospecting';
            recordsProcessed = recordsProcessed + 1;
        }
        update records;
        System.debug('Batch: ' + bc.getJobId() + ' executed');
    }
    public void finish(Database.BatchableContext bc){
        System.debug(recordsProcessed + ' records processed. Shazam!');
    }
}