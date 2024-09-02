import { LightningElement, wire } from 'lwc';
import getAllMerchandise from '@salesforce/apex/Records.getAllMerchandise';

const columns = [
    			{label: 'Name', fieldName: 'Name'},
    			{label: 'Price', fieldName: 'Price__c'},
    			{label: 'Total Inventory', fieldName: 'Inventory__c'}
]

export default class MerchandiseLWC extends LightningElement {
    			data;
    			error;
    			columns = columns;

    			@wire (getAllMerchandise)
    			wiredMerchandise({error, data}){
        				if(data){
            					this.data = data;
            					this.error = undefined;
        				}
        				else if(error){
            					this.error = error;
            					this.data = undefined;
        				}
   			 }
}