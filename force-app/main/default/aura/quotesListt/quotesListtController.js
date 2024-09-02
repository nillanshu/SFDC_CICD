({
    doInit: function(component, event, helper) {
        console.log('doInit called');
        var action = component.get("c.getTheQuotes");
        action.setParams({
            recordId: component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.quotes", response.getReturnValue());
                component.set("v.error", undefined);
            } else if (state === "ERROR") {
                component.set("v.error", response.getError());
                component.set("v.quotes", undefined);
            }
            component.set("v.isLoading", false);
        });
        $A.enqueueAction(action);
    },

    handleRowSelection: function(component, event, helper) {
        console.log('handleRowSelection called');
        var selectedRows = event.getParam('selectedRows');
        if (selectedRows.length > 0) {
            component.set("v.selectedQuoteId", selectedRows[0].Id);
            component.set("v.buttonDisabled", false);
        } else {
            component.set("v.buttonDisabled", true);
        }
    },

    handleClick: function(component, event, helper) {
        console.log('handleClick called');
        var recordId = component.get("v.selectedQuoteId");
        var link = '/apex/sbqq__sb?scontrolCaching=1&id=' + recordId + '#quote/le?qId=' + recordId;
        var navigationAccelerator = component.find('navigationAccelerator');
        navigationAccelerator.navigateToWorkspaceTab({url: link})
        .then(function(result) {
            console.log('Success navigating to workspace');
        })
        .catch(function(error) {
            console.log('Error navigating to workspace:', error);
        });
    }
})