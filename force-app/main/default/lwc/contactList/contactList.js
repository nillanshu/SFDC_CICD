import { LightningElement, api } from 'lwc';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import getContacts from '@salesforce/apex/ContactController.getContacts';

const COLUMNS = [
    { label: 'First Name', fieldName: FIRSTNAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Last Name', fieldName: LASTNAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Email', fieldName: EMAIL_FIELD.fieldApiName, type: 'email' }
];

export default class ContactList extends LightningElement {
    columns = COLUMNS;
    @api recordId;
    contacts = [];
    errors;
    offset = 0;
    limitSize = 25;

    connectedCallback() {
        this.loadMoreContacts();
    }

    loadMoreContacts() {
        return getContacts({ accId: this.recordId, offset: this.offset, limitSize: this.limitSize })
            .then(result => {
                if(result && result.length > 0){
                    this.contacts = [...this.contacts, ...result];
                }
                // this.offset += this.limit;
                this.errors = undefined;
            })
            .catch(error => {
                this.errors = error;
                this.contacts = undefined;
                console.error('Error loading contacts', error);
            });
    }

    handleLoadMore(event) {
        const currentRecord = this.contacts;
          const { target } = event;
        target.isLoading = true;
          this.offset = this.offset + this.limitSize;
          this.loadMoreContacts().then(() => {
                target.isLoading = false;
          });
    }

}