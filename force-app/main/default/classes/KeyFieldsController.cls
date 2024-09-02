public with sharing class KeyFieldsController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getKeyFields(Id recordId) {
        List<Map<String, Object>> keyFields = new List<Map<String, Object>>();
        try {
            System.debug('Record ID: ' + recordId);
            
            // Determine the object type based on the record ID prefix
            String objectApiName = getObjectApiName(recordId);
            System.debug('Object API Name: ' + objectApiName);
            
            // Retrieve the custom metadata type configuration for the determined object type
            KeyFieldsConfig__mdt config = getConfigForObject(objectApiName);
            if (config == null) {
                System.debug('No custom metadata configuration found for object: ' + objectApiName);
                throw new AuraHandledException('No custom metadata configuration found for object: ' + objectApiName);
            }
            System.debug('Config: ' + config);
            
            // Get the field API names from the configuration
            List<String> fieldApiNames = config.Fields_API_Names__c.split(',');
            System.debug('Field API Names: ' + fieldApiNames);
            
            // Construct the SOQL query to fetch the key fields
            String query = 'SELECT ' + String.join(fieldApiNames, ',') + ' FROM ' + objectApiName + ' WHERE Id = :recordId';
            System.debug('SOQL Query: ' + query);
            SObject record = Database.query(query);
            System.debug('Record: ' + record);
            
            // Add the key fields to the list
            for (String fieldApiName : fieldApiNames) {
                Map<String, Object> fieldMap = new Map<String, Object>();
                fieldMap.put('fieldName', fieldApiName);
                fieldMap.put('fieldValue', record.get(fieldApiName));
                keyFields.add(fieldMap);
            }
            
            System.debug('Key Fields: ' + keyFields);
        } catch (Exception e) {
            System.debug('Error: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while fetching key fields: ' + e.getMessage());
        }
        return keyFields;
    }

    // Dynamically gets the ObjectApiName of the record
    private static String getObjectApiName(Id recordId) {
        return GetObjectType.objectType(recordId);
    }
    
    // Helper method to get the custom metadata configuration for an object
    @AuraEnabled(cacheable=true)
    public static KeyFieldsConfig__mdt getConfigForObject(String objectApiName) {
        List<KeyFieldsConfig__mdt> configs = [SELECT Object_API_Name__c, Fields_API_Names__c FROM KeyFieldsConfig__mdt WHERE Object_API_Name__c = :objectApiName LIMIT 1];
        if (!configs.isEmpty()) {
            return configs[0];
        }
        return null;
    }
}