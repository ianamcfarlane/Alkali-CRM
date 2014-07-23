/// <reference path="../typescript/XrmServiceToolkit.d.ts" />
/// <reference path="../typescript/Xrm2011.1_0.d.ts" />
function Form_onload() {
    checkIfParentIsApproved();
}

function checkIfParentIsApproved() {
    var pId = Xrm.Page.getAttribute("ac_pricequoteid").getValue()[0].id;

    var cols = ['statuscode'];
    var returnedEntity = XrmServiceToolkit.Soap.Retrieve('ac_pricequote', pId, cols);

    var statuscode = returnedEntity.attributes['statuscode'].value;
    if (statuscode == '8' || statuscode == '6') {
        disableFormFields(true);

        if (IsCurrentUserInRole('System Administrator') || IsCurrentUserInRole('Business Administrator')) {
            disableFormFields(false);
        }
    }
}

function doesControlHaveAttribute(control) {
    var controlType = control.getControlType();
    return controlType != "iframe" && controlType != "webresource" && controlType != "subgrid";
}

function disableFormFields(onOff) {
    Xrm.Page.ui.controls.forEach(function (control, index) {
        if (doesControlHaveAttribute(control)) {
            control.setDisabled(onOff);
        }
    });
}
