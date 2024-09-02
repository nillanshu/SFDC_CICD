// public with sharing class ContactController {
//     @AuraEnabled(cacheable=true)
//     public static List<Contact> getContacts(String accId, Integer offset,  Integer limitSize) {
//         return [
//             SELECT Id, FirstName, LastName, Email
//             FROM Contact
//             WHERE AccountId = :accId
//             ORDER BY FirstName
//             LIMIT :limitSize
//             OFFSET :offset 
//         ];
//     }

//     @AuraEnabled
//     public static deleteRecord(String recordId, String accId, Integer offset, Integer limitSize) {
//         try {
//             Contact recordToDelete = [SELECT Id FROM Contact WHERE Id = :recordId];
//             delete recordToDelete;
//         } catch (Exception e) {
//             throw new AuraHandledException('Could not delete record: ' + e.getMessage());
//         }

//         // return [
//         //     SELECT Id, FirstName, LastName, Email
//         //     FROM Contact
//         //     WHERE AccountId = :accId
//         //     ORDER BY FirstName
//         //     LIMIT :limitSize
//         //     OFFSET :offset 
//         // ];
//         List<Contact> updatedContacts = 
//     }
//     // @AuraEnabled
//     // public static void deleteRecord(String recordId) {
//     //     try {
//     //         Contact recordToDelete = [SELECT Id FROM Contact WHERE Id = :recordId];
//     //         delete recordToDelete;
//     //     } catch (Exception e) {
//     //         throw new AuraHandledException('Could not delete record: ' + e.getMessage());
//     //     }
//     // }

    
// }

public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String accId, Integer offset,  Integer limitSize) {
        return [
            SELECT Id, FirstName, LastName, Email
            FROM Contact
            WHERE AccountId = :accId
            ORDER BY FirstName
            LIMIT :limitSize
            OFFSET :offset 
        ];
    }

    @AuraEnabled
    public static void deleteRecord(String recordId) {
        try {
            Contact recordToDelete = [SELECT Id FROM Contact WHERE Id = :recordId];
            delete recordToDelete;
        } catch (Exception e) {
            throw new AuraHandledException('Could not delete record: ' + e.getMessage());
        }

        // Call getContacts to get the updated contacts
        // List<Contact> updatedContacts = getContacts(accId, offset, limitSize);
        // return updatedContacts;
    }
}