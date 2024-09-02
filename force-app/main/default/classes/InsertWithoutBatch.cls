public class InsertWithoutBatch {
    public static void insertOpps() {
        List<Opportunity> opps = [Select Id, Name, StageName from Opportunity];
        for (Opportunity opp : opps) {
            opp.StageName = 'Closed Won';
        }
        update opps;
    }
}