public with sharing class GetObjectType {
    public static String objectType(Id recordId){
        String objectType = '';
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
        for(String eachString : gd.keySet()){
            String getPrefix = gd.get(eachString).getDescribe().getKeyPrefix();
            if(getPrefix != null){
                if (String.valueOf(recordId).startsWith(getPrefix)){
                    objectType = eachString;
                    break;                    
                }
            }
        }
        return objectType;
    }
}