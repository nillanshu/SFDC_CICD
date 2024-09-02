import { LightningElement, api } from 'lwc';

export default class CustomStageComp extends LightningElement {
    @api recordId;
    @api currentStage = 'Value Proposition'; // Stage name of the current stage
    stages = [
        { value: 'Prospecting', label: 'Prospecting', class: '' },
        { value: 'Qualification', label: 'Qualification', class: '' },
        { value: 'Needs Analysis', label: 'Needs Analysis', class: '' },
        { value: 'Value Proposition', label: 'Value Proposition', class: '' },
        { value: 'Id. Decision Makers', label: 'Id. Decision Makers', class: '' },
        { value: 'Perception Analysis', label: 'Perception Analysis', class: '' },
        { value: 'Proposal/Price Quote', label: 'Proposal/Price Quote', class: '' },
        { value: 'Negotiation/Review', label: 'Negotiation/Review', class: '' },
        { value: 'Closed', label: 'Closed', class: '' },
    ];

    connectedCallback() {
        this.updateStageClasses();
    }

    updateStageClasses() {
        let isActive = true;
        this.stages = this.stages.map(stage => {
            if (stage.value === this.currentStage) {
                stage.class = 'slds-is-current slds-is-active';
                isActive = false;
            } else if (isActive) {
                stage.class = 'slds-is-complete';
            } else {
                stage.class = 'slds-is-incomplete';
            }
            return stage;
        });
    }
}