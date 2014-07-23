/// <reference path="../typescript/XrmServiceToolkit.d.ts" />
/// <reference path="../typescript/Xrm2011.1_0.d.ts" />
function Form_onload() {
    if (Xrm.Page.ui.getFormType() == 1) {
        generateName();
    }
}

function generateName() {
    if (Xrm.Page.getAttribute("ac_accountid").getValue() != null) {
        var datCurrentDate = new Date();
        var month = datCurrentDate.getMonth() + 1;
        var day = datCurrentDate.getDate();
        var year = datCurrentDate.getFullYear();

        Xrm.Page.getAttribute("ac_name").setValue(Xrm.Page.getAttribute("ac_accountid").getValue()[0].name + "-" + month + "/" + day + "/" + year);
    } else {
        Xrm.Page.getAttribute("ac_name").setValue('');
    }
    Xrm.Page.getAttribute("ac_name").setSubmitMode("always");
}

function ac_accountid_onchange() {
    generateName();
}

function submitSupplyAgreement() {
    var yes = confirm("Submit Supply Agreement?");

    if (yes == true) {
        if (Xrm.Page.getAttribute("statuscode") != null && Xrm.Page.getAttribute("ac_reasonforrejection") != null) {
            Xrm.Page.getAttribute("statuscode").setValue(objStatusReasons.Submitted);
            Xrm.Page.getAttribute("statuscode").setSubmitMode("always");
            Xrm.Page.data.entity.save();
        }
    }
}
