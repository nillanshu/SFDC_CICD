import { LightningElement, api, track, wire } from 'lwc';
import getKeyFields from '@salesforce/apex/KeyFieldsController.getKeyFields';

export default class KeyFieldsComponent extends LightningElement {
    @api recordId;
    @track isModalOpen = false;
    @track keyFields;
    @track columns = [
        { 
            label: 'Field Name', 
            fieldName: 'fieldName',
            type: 'text',
            cellAttributes: {
                title: { fieldName: 'fieldName' }
            }
        },
        { 
            label: 'Field Value', 
            fieldName: 'fieldValue',
            type: 'text',
            cellAttributes: {
                title: { fieldName: 'fieldValue' }
            }
        }
    ];

    openModal() {
        this.isModalOpen = !this.isModalOpen;
        if (this.isModalOpen) {
            this.fetchKeyFields();
        }
    }

    closeModal() {
        this.isModalOpen = false;
    }

    fetchKeyFields() {
        getKeyFields({ recordId: this.recordId })
            .then(result => {
                this.keyFields = result;
            })
            .catch(error => {
                console.error('Error fetching key fields:', error);
            });
    }
}