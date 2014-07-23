/// <reference path="../typescript/XrmServiceToolkit.d.ts" />
/// <reference path="../typescript/Xrm2011.1_0.d.ts" />
function updateShippingInfo(bKeepTargetData) {
    var oShippingLocation = Xrm.Page.getAttribute("ac_shippinglocation");
    switch (oShippingLocation.getValue()) {
        case 1:
            var oFilteredOn = Xrm.Page.getAttribute("ac_requestorid");
            if (oFilteredOn.getValue() != null) {
                RetrieveContact(oFilteredOn.getValue());
            }

        default:
            if (typeof (bKeepTargetData) !== 'undefined' && (bKeepTargetData == false)) {
                Xrm.Page.getAttribute("ac_street1").setValue(null);
                Xrm.Page.getAttribute("ac_street2").setValue(null);
                Xrm.Page.getAttribute("ac_city").setValue(null);
                Xrm.Page.getAttribute("ac_stateid").setValue(null);
                Xrm.Page.getAttribute("ac_postalcode").setValue(null);
                Xrm.Page.getAttribute("ac_countryid").setValue(null);
            }
    }
}

// Get the date and add 10 days to it. That is the Due Date
function setDefaultDueDate() {
    if (Xrm.Page.ui.getFormType() == 1) {
        var now = new Date();
        var nowDay = now.getDate();

        // Add the new value...
        nowDay += 10;

        // Make the new date...
        now.setDate(nowDay);

        // Update the control...
        Xrm.Page.getAttribute("ac_duedate").setValue(now);
    }
}

// Occurs when the user clicks the Approve button
function approveButton() {
    // Change the stage and approved/declined setting
    Xrm.Page.getAttribute("ac_stage").setValue('2');
    Xrm.Page.getAttribute("ac_stage").setSubmitMode("always");
    Xrm.Page.getAttribute("ac_approvedecline").setValue("1");
    Xrm.Page.getAttribute("ac_approvedecline").setSubmitMode("always");

    // Issue a save
    Xrm.Page.data.entity.save();
}

// Occurs when the user clicks the Decline button
function declineButton() {
    // Open the dialog and record the result...
    var declineNoteGiven = window.showModalDialog("/ISV/Ascentium/DecliningRequestDialog.aspx", null, "");

    if (declineNoteGiven != '' && declineNoteGiven != null) {
        // Change the stage and approved/declined setting
        Xrm.Page.getAttribute("ac_stage").setValue('8');
        Xrm.Page.getAttribute("ac_stage").setSubmitMode("always");
        Xrm.Page.getAttribute("ac_approvedecline").setValue('2');
        Xrm.Page.getAttribute("ac_approvedecline").setSubmitMode("always");

        // Update the decline note field.
        Xrm.Page.getAttribute("ac_declinenote").setValue(declineNoteGiven);
        Xrm.Page.getAttribute("ac_declinenote").setSubmitMode("always");

        // Issue a save
        Xrm.Page.data.entity.save();
    }
}

function ac_requestorid_onchange() {
    updateShippingInfo(true);
}
function ac_shippinglocation_onchange() {
    updateShippingInfo(false);
}
