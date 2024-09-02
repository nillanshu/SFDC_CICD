import { LightningElement, wire, api } from 'lwc';
import getTheQuotes from '@salesforce/apex/GetQuotes.getTheQuotes';

export default class QuotesList extends LightningElement {
    @api recordId;
    selectedQuoteId;
    buttonDisabled = true;
    quotes;
    error;
    columns = [
        { label: 'Quote Name', fieldName: 'Name' },
    ];
    isLoading = true;
    multipleRowsSelected = false;

    @wire(getTheQuotes, { recordId: '$recordId' })
    wiredQuotes({ error, data }) {
        if (data) {
            this.quotes = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.quotes = undefined;
        }
        this.isLoading = false;
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        if (selectedRows.length === 1) {
            this.selectedQuoteId = selectedRows[0].Id;
            this.buttonDisabled = false;
            this.multipleRowsSelected = false;
        } else {
            this.buttonDisabled = true;
            this.multipleRowsSelected = selectedRows.length > 1;
        }
    }

    handleClick() {
        this.template.querySelector('c-navigation-accelerator')
            .navigateToSubtab({ recordId: this.selectedQuoteId, isRecordPage: true, objectApiName: 'SBQQ__Quote__c', type: 'view'})
            .catch(error => {
                console.error('Error navigating to subtab:', error.message);
            });
    }
}