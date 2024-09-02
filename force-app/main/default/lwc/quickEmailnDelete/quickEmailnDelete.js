import { LightningElement, api, track, wire } from 'lwc';
import ID_FIELD from '@salesforce/schema/Contact.Id';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import deleteRecord from '@salesforce/apex/ContactController.deleteRecord';
// import {RefreshEvent} from 'lightning/refresh' 
import {refreshApex} from '@salesforce/apex'


const COLUMNS = [
    { label: 'Id', fieldName: ID_FIELD.fieldApiName, type: 'text'},
    { label: 'First Name', fieldName: FIRSTNAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Last Name', fieldName: LASTNAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Email', fieldName: EMAIL_FIELD.fieldApiName, type: 'email' }
];

export default class quickEmailnDelete extends LightningElement {
    columns = COLUMNS;
    @api recordId;
    @track contacts = [];
    errors;
    offset = 0;
    limitSize = 25;
    isRowSelected = false;
    isModalOpen = false;
    mailDetails = {
        to: '',
        subject: '',
        body: ''
    };
    selectedRecordId= '';

    contactsResult;
    @wire(getContacts, { accId: '$recordId', offset: '$offset', limitSize: '$limitSize' })
    wiredContacts(result) {
        this.contactsResult = result;
        if (result.data) {
            this.contacts = result.data;
            this.errors = undefined;
        } else if (result.error) {
            this.errors = result.error;
            this.contacts = undefined;
            console.error('Error loading contacts', result.error);
        }
    }

    connectedCallback() {
        this.loadMoreContacts();
    }

    loadMoreContacts() {
        return getContacts({ accId: this.recordId, offset: this.offset, limitSize: this.limitSize })
            .then(result => {
                if(result && result.length > 0){
                    this.contacts = result;
                }
                this.errors = undefined;
            })
            .catch(error => {
                this.errors = error;
                this.contacts = undefined;
                console.error('Error loading contacts', error);
            });
    }

    handleLoadMore(event) {
        const buttonId = event.target.dataset.id;
    
        if (buttonId === 'previous') {
            this.offset = Math.max(this.offset - this.limitSize, 0);
        } else if (buttonId === 'next') {
            this.offset = this.offset + this.limitSize;
        }
        this.loadMoreContacts();
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        this.isRowSelected = selectedRows.length === 1;
        if (this.isRowSelected) {
            this.mailDetails.to = selectedRows[0].Email;
            this.selectedRecordId = selectedRows[0].Id;
        } else {
            this.mailDetails.to = '';
        }
    }

    handleModalOpen() {
        this.isModalOpen = true;
    }

    handleCloseModal() {
        this.isModalOpen = false;
    }

    handleSendMail() {
        this.isModalOpen = false;
        this.dispatchEvent(new CustomEvent('sendmail', {
            detail: {
                to: this.mailDetails.to,
                subject: this.mailDetails.subject,
                body: this.mailDetails.body
            }
        }));
        console.log('Email sent successfully');
        console.log('To: ' + this.mailDetails.to);
        console.log('Subject: ' + this.mailDetails.subject);
        console.log('Body: ' + this.mailDetails.body);
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this.mailDetails[field] = event.target.value;
    }

    // beginRefresh() {
    //     this.dispatchEvent(new RefreshEvent());
    // }

    // handleDelete() {
    //     console.log('Record Id to delete: ' + this.selectedRecordId);
    //     deleteRecord({ recordId: this.selectedRecordId })
    //         .then(() => {
    //             console.log('Record deleted successfully');
    //             this.contacts = this.loadMoreContacts();
    //             this.beginRefresh();
    //         })
    //         .catch(error => {
    //             console.error('Error in deleting record', error);
    //         });
    // }

    // handleDelete() {
    //     console.log('Record Id to delete: ' + this.selectedRecordId);
    //     deleteRecord({ recordId: this.selectedRecordId, accId: this.recordId, offset: this.offset, limitSize: this.limitSize })
    //         .then(remainingContacts => {
    //             console.log('Record deleted successfully');
    //             this.contacts = remainingContacts;
    //             console.log(this.contacts);
    //         })
    //         .catch(error => {
    //             console.error('Error in deleting record', error);
    //         });
    // }

    handleDelete() {
        console.log('Record Id to delete: ' + this.selectedRecordId);
        deleteRecord({ recordId: this.selectedRecordId})
            .then(() => {
                console.log('Record deleted successfully');
                return refreshApex(this.contactsResult);
            })
            .catch(error => {
                console.error('Error in deleting record', error);
            });
    }

    // handleSendMail() {
    //     this.isModalOpen = false;
    //     sendEmail({
    //         to: this.selectedMail,
    //         subject: this.mailDetails.subject,
    //         body: this.mailDetails.body
    //     })
    //     .then(result => {
    //         // Handle successful email sending
    //         console.log('Email sent successfully');
    //     })
    //     .catch(error => {
    //         // Handle error in email sending
    //         console.error('Error in sending email', error);
    //     });
    // }

}