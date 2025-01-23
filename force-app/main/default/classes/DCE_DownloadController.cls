public with sharing class DCE_DownloadController {
    @AuraEnabled(cacheable=true)
    public static List<Downloads__c> getFilteredDownloads(String product, String country, String language) {
        String query = 'SELECT Id, Name, Product__c, Download_Country__c, Download_Language__c FROM Downloads__c WHERE IsDeleted = FALSE';
        
        // Dynamically add filters
        if (!String.isEmpty(product)) {
            query += ' AND Product__c = :product';
        }
        if (!String.isEmpty(country)) {
            query += ' AND Download_Country__c = :country';
        }
        if (!String.isEmpty(language)) {
            query += ' AND Download_Language__c = :language';
        }
        
        // Return the filtered records
        return Database.query(query);
    }
}
