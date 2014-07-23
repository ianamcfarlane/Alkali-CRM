/// <reference path="../typescript/Xrm2011.1_0.d.ts" />
/// <reference path="ac_UserHasRole.ts" />
/// <reference path="../typescript/Xrm.d.ts" />
/// <reference path="../typescript/XrmServiceToolkit.d.ts" />
function Form_onload() {
    filterMaterialNumberByCustomer(false);
}

function customerid_onchange() {
    filterMaterialNumberByCustomer(true);
}

function filterMaterialNumberByCustomer(bCalledByOnChange) {
    var oTarget = Xrm.Page.ui.controls.get("ac_materialnumberid");
    var oFilteredOn = Xrm.Page.getAttribute("customerid");

    if (Xrm.Page.getAttribute("customerid").getValue() != null) {
        var entityName = "ac_materialnumber";
        var viewDisplayName = "Material Number";
        var viewId = "{a76b2c46-c28e-4e5e-9ddf-951b71302c9d}";
        var fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'><entity name='ac_materialnumber'><attribute name='ac_materialnumberid'/><attribute name='ac_name'/><attribute name='createdon'/><order attribute='ac_name' descending='false'/><link-entity name='ac_accountproduct' from='ac_materialnumberid' to='ac_materialnumberid' alias='aa'><filter type='and'><condition attribute='ac_accountid' operator='eq' uitype='account' value='" + Xrm.Page.getAttribute("customerid").getValue()[0].id + "'/></filter></link-entity></entity></fetch>";
        var layoutXml = "<grid name='resultset' " + "object='1' " + "jump='name' " + "select='1' " + "icon='1' " + "preview='1'>" + "<row name='result' " + "id='ac_materialnumberid'>" + "<cell name='ac_name' " + "width='300' />" + "</row>" + "</grid>";

        Xrm.Page.getControl("ac_materialnumberid").addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true);
        oTarget.setDisabled(false);
    } else {
        oTarget.setDisabled(true);
    }
}

function checkOwnerForResolve() {
    var user = Xrm.Page.context.getUserId();
    var owner = Xrm.Page.getAttribute("ownerid").getValue()[0].id;
    var approval = Xrm.Page.getAttribute("ac_approvalforclosing").getValue();
    if (user == owner && ((approval == true) || (approval == null))) {
        return true;
    }
    if ((UserHasRole("System Administrator")) || (UserHasRole("Business Administrator")) || (UserHasRole("Complaint Manager"))) {
        return true;
    } else {
        return false;
    }
}
