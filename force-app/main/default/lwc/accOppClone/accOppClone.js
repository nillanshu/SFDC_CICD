import { LightningElement, track, wire } from 'lwc';
import ACC_ID_FIELD from '@salesforce/schema/Account.Id';
import ACC_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACC_WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import OPP_ID_FIELD from '@salesforce/schema/Opportunity.Id';
import OPP_NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import OPP_STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';

import getAccounts from '@salesforce/apex/AccOppClone.getAccounts';
import getOpportunities from '@salesforce/apex/AccOppClone.getOpportunities';
import cloneAccountsAndOpportunities from '@salesforce/apex/AccOppClone.cloneAccountsAndOpportunities';

const ACCOUNT_COLUMNS = [
    { label: 'Id', fieldName: ACC_ID_FIELD.fieldApiName, type: 'text'},
    { label: 'Name', fieldName: ACC_NAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Website', fieldName: ACC_WEBSITE_FIELD.fieldApiName, type: 'text' }
];

const OPP_COLUMNS = [
    { label: 'Id', fieldName: OPP_ID_FIELD.fieldApiName, type: 'text'},
    { label: 'Name', fieldName: OPP_NAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Stage Name', fieldName: OPP_STAGE_FIELD.fieldApiName, type: 'text' }
];

export default class accOppClone extends LightningElement {
    accColumns = ACCOUNT_COLUMNS;
    oppColumns = OPP_COLUMNS;
    accounts;
    errors;
    opportunities;
    oppErrors;
    @track selectedOppRows;
    @track selectedOppRecordIds = {};
    @track selectedRows;
    @track selectedRecordIds;

    @wire(getAccounts)
    wiredAccounts(result) {
        if (result.data) {
            this.accounts = result.data;
            this.errors = undefined;
        } else if (result.error) {
            this.errors = result.error;
            this.accounts = undefined;
            console.error('Error loading contacts', this.errors);
        }
    }

    @wire(getOpportunities, { accIds: '$selectedRecordIds' })
    wiredOpportunities(result) {
        this.opportunities = {};
        if (result.data) {
            result.data.forEach(opportunity => {
                const accountId = opportunity.AccountId;
                if (!this.opportunities[accountId]) {
                    this.opportunities[accountId] = [];
                }
                this.opportunities[accountId].push(opportunity);
            });
            this.oppErrors = undefined;
        } else if (result.error) {
            this.oppErrors = result.error;
            this.opportunities = {};
            console.error('Error loading opportunities', this.oppErrors);
        }
    }

    handleAccountRowSelection(event) {
        this.selectedRows = event.detail.selectedRows;
        this.selectedRecordIds = this.selectedRows.map(row => row.Id);
    }

    get accountsAndOpportunities() {
        return this.selectedRows ? this.selectedRows.map(account => ({
            account: account,
            opportunities: this.opportunities[account.Id]
        })) : [];
    }

    handleOppRowSelection(event) {
        const selectedOppRows = event.detail.selectedRows;
        if (selectedOppRows.length > 0) {
            const selectedOppRecordIds = selectedOppRows.map(row => row.Id);
            const accountId = selectedOppRows[0].AccountId; // Assuming all selected rows belong to the same account
            this.selectedOppRecordIds[accountId] = selectedOppRecordIds;
        }
    }
    handleClone() {
        let accountOpportunityIds = {};
        this.accountsAndOpportunities.forEach(accOpp => {
            let oppIds = this.selectedOppRecordIds[accOpp.account.Id];
            if (oppIds) {
                oppIds = oppIds.filter(oppId => accOpp.opportunities.map(opp => opp.Id).includes(oppId));
                accountOpportunityIds[accOpp.account.Id] = oppIds;
            }
        });
    
        cloneAccountsAndOpportunities({ accountOpportunityIds: accountOpportunityIds })
            .then(result => {
                console.log('Cloned accounts and opportunities', result);
            })
            .catch(error => {
                console.error('Error cloning accounts and opportunities', error);
            });
        this.selectedRows = [];
        this.selectedRecordIds = [];
        this.selectedOppRows = [];
        this.selectedOppRecordIds = [];
    }
   
}