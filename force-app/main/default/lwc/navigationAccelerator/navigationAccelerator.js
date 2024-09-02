import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { EnclosingTabId, getTabInfo, openTab, openSubtab } from 'lightning/platformWorkspaceApi';

// This class extends the LightningElement and uses the NavigationMixin for navigation functionalities
export default class NavigationAccelerator extends NavigationMixin(LightningElement) {
    // Wire decorator to get the enclosing tab id
    @wire(EnclosingTabId) tabId;

    // This method is used to navigate to a specific URL or record page
    @api
    navigateTo(options) {
        // Extract url and type from options, default type is 'view'
        let url = options.url;
        let type = options.type? options.type : 'view';
    
        // If recordId, objectApiName and isRecordPage are provided, construct a record page URL
        if (options.recordId && options.objectApiName && options.isRecordPage) {
            url = `/lightning/r/${options.objectApiName}/${options.recordId}/${type}`;
        } 
        // If only objectApiName is provided and isRecordPage is false, construct a list page URL
        else if (options.objectApiName && !options.isRecordPage) {
            url = `/lightning/o/${options.objectApiName}/list`;
        }
    
        // If url is valid, navigate to the url
        if (url) {
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: url
                }
            });
        } 
        // If url is not valid, log an error
        else {
            console.error('Invalid parameters, try entering either url or recordId, isRecordPage, type & objectApiName', options);
        }
    }
    
    // This method is used to navigate to a subtab
    @api
    async navigateToSubtab(options) {
         // If tabId is not available, log an error and return
        if (!this.tabId) {
            console.error('No tabId found');
            return;
        }
    
        // Get the tab info
        const tabInfo = await getTabInfo(this.tabId);
        // Get the primary tab id
        const primaryTabId = tabInfo.isSubtab ? tabInfo.parentTabId : tabInfo.tabId;
    
        // Extract url and type from options, default type is 'view'
        let url = options.url;
        let type = options.type? options.type : 'view';
        
        // If recordId, objectApiName and isRecordPage are provided, construct a record page URL
        if (options.recordId && options.objectApiName && options.isRecordPage) {
            url = `/lightning/r/${options.objectApiName}/${options.recordId}/${type}`;
        } 
        // If only objectApiName is provided and isRecordPage is false, construct a list page URL
        else if (options.objectApiName && !options.isRecordPage) {
            url = `/lightning/o/${options.objectApiName}/list`;
        }
    
        // If url is valid, open a subtab with the url
        if (url) {
            await openSubtab(primaryTabId, { url: url, focus: true });
        } 
        // If url is not valid, log an error
        else {
            console.error('Invalid parameters, try entering either url or recordId, isRecordPage, type & objectApiName', options);
        }
    }

    // This method is used to navigate to a workspace tab
    @api
    navigateToWorkspaceTab(options) {
        // Extract url and type from options, default type is 'view'
        let url = options.url;
        let type = options.type? options.type : 'view';
    
        // If recordId, objectApiName and isRecordPage are provided, construct a record page URL
        if (options.recordId && options.objectApiName && options.isRecordPage) {
            url = `/lightning/r/${options.objectApiName}/${options.recordId}/${type}`;
        } 
        // If only objectApiName is provided and isRecordPage is false, construct a list page URL
        else if (options.objectApiName && !options.isRecordPage) {
            url = `/lightning/o/${options.objectApiName}/list`;
        }
    
        // If url is valid, open a workspace tab with the url
        if (url) {
            openTab({
                url: url,
                focus: true
            });
        } 
        // If url is not valid, log an error
        else {
            console.error('Invalid parameters, try entering either url or recordId & objectApiName', options);
        }
    }
}