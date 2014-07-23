/// <reference path="../typescript/Xrm.d.ts" />
/// <reference path="../typescript/XrmServiceToolkit.d.ts" />
/// <reference path="../typescript/Xrm2011.1_0.d.ts" />
function Form_onload() {
    additional_Summary();
    additional_Contacts();
}
function additional_Summary() {
    if (Xrm.Page.getAttribute("ac_morefieldsforaccountsummary").getValue() == true) {
        Xrm.Page.ui.tabs.sections.get("Additional_Product_Summary").setVisible(true);
    } else {
        Xrm.Page.ui.tabs.sections.get("Additional_Product_Summary").setVisible(false);
    }
}

function additional_Contacts() {
    if (Xrm.Page.getAttribute("ac_morefieldsforrelationships").getValue() == true) {
        Xrm.Page.ui.tabs.sections.get("Additional_Contacts").setVisible(true);
    } else {
        Xrm.Page.ui.tabs.sections.get("Additional_Contacts").setVisible(false);
    }
}

function ac_morefieldsforaccountsummary_onChange() {
    additional_Summary();
    additional_Contacts();
}
