/// <reference path="../typescript/Xrm.d.ts" />
/// <reference path="../typescript/XrmServiceToolkit.d.ts" />
function copyShippingAddressToMailingAddress(bCopy) {
    var oToggle = Xrm.Page.getAttribute("ac_copyaddress");

    // Mailing Address fields
    var oMailing_Street1 = Xrm.Page.getAttribute("address2_line1");
    var oMailing_Street2 = Xrm.Page.getAttribute("address2_line2");
    var oMailing_Street3 = Xrm.Page.getAttribute("address2_line3");
    var oMailing_City = Xrm.Page.getAttribute("address2_city");
    var oMailing_State = Xrm.Page.getAttribute("address2_stateorprovince");
    var oMailing_Zip = Xrm.Page.getAttribute("address2_postalcode");
    var oMailing_Country = Xrm.Page.getAttribute("address2_country");

    if (bCopy != false) {
        // Shipping Address fields
        var oShipping_Street1 = Xrm.Page.getAttribute("address1_line1");
        var oShipping_Street2 = Xrm.Page.getAttribute("address1_line2");
        var oShipping_Street3 = Xrm.Page.getAttribute("address1_line3");
        var oShipping_City = Xrm.Page.getAttribute("address1_city");
        var oShipping_State = Xrm.Page.getAttribute("address1_stateorprovince");
        var oShipping_Zip = Xrm.Page.getAttribute("address1_postalcode");
        var oShipping_Country = Xrm.Page.getAttribute("address1_country");

        if (oToggle.getValue() == true) {
            // Copy the fields and make them disabled
            // Copy
            oMailing_Street1.setValue(oShipping_Street1.getValue());
            oMailing_Street2.setValue(oShipping_Street2.getValue());
            oMailing_Street3.setValue(oShipping_Street3.getValue());
            oMailing_City.setValue(oShipping_City.getValue());
            oMailing_State.setValue(oShipping_State.getValue());
            oMailing_Zip.setValue(oShipping_Zip.getValue());
            oMailing_Country.setValue(oShipping_Country.getValue());

            // Disable
            disableToggle(oMailing_Street1, true);
            disableToggle(oMailing_Street2, true);
            disableToggle(oMailing_Street3, true);
            disableToggle(oMailing_City, true);
            disableToggle(oMailing_State, true);
            disableToggle(oMailing_Zip, true);
            disableToggle(oMailing_Country, true);
        } else {
            // Make the fields enabled
            disableToggle(oMailing_Street1, false);
            disableToggle(oMailing_Street2, false);
            disableToggle(oMailing_Street3, false);
            disableToggle(oMailing_City, false);
            disableToggle(oMailing_State, false);
            disableToggle(oMailing_Zip, false);
            disableToggle(oMailing_Country, false);
        }
    } else {
        if (oToggle.getValue() == true) {
            // Disable
            disableToggle(oMailing_Street1, true);
            disableToggle(oMailing_Street2, true);
            disableToggle(oMailing_Street3, true);
            disableToggle(oMailing_City, true);
            disableToggle(oMailing_State, true);
            disableToggle(oMailing_Zip, true);
            disableToggle(oMailing_Country, true);
        }
    }
}

// Sets a field's disabled state and automatically sets ForceSubmit if necessary
function disableToggle(oField, bDisabled) {
    if (bDisabled) {
        oField.Disabled = true;
        oField.ForceSubmit = true;
    } else {
        oField.Disabled = false;
    }
}

function address1_line1_onchange() {
    copyShippingAddressToMailingAddress(true);
}
function address1_stateorprovince_onchange() {
    copyShippingAddressToMailingAddress(true);
}
function address1_line2_onchange() {
    copyShippingAddressToMailingAddress(true);
}
function address1_postalcode_onchange() {
    copyShippingAddressToMailingAddress(true);
}
function address1_line3_onchange() {
    copyShippingAddressToMailingAddress(true);
}
function address1_country_onchange() {
    copyShippingAddressToMailingAddress(true);
}
function address1_city_onchange() {
    copyShippingAddressToMailingAddress(true);
}
function ac_copyaddress_onchange() {
    copyShippingAddressToMailingAddress(true);
}
