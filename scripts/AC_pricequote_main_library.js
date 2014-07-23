/// <reference path="ac_UserHasRole.ts" />
/// <reference path="../typescript/XrmServiceToolkit.d.ts" />
/// <reference path="../typescript/Xrm2011.1_0.d.ts" />
//Submit the price quote
function submitPriceQuote() {
    var yes = confirm("Submit this quote to the product manager?");
    if (yes == true) {
        var intStatusAwaitingInternalApproval = 4;

        Xrm.Page.getAttribute("statuscode").setValue(intStatusAwaitingInternalApproval);
        Xrm.Page.getAttribute("statuscode").setSubmitMode("always");

        Xrm.Page.data.entity.save();
    }
}

function approvePriceQuote() {
    var yes = confirm("Approve this quote?");
    if (yes == true) {
        var intStatusApproval = 8;

        Xrm.Page.getAttribute("statuscode").setValue(intStatusApproval);
        Xrm.Page.getAttribute("statuscode").setSubmitMode("always");

        Xrm.Page.data.entity.save();
    }
}

function rejectPriceQuote() {
    var yes = confirm("Reject this quote?");
    if (yes == true) {
        var intStatusNew = 1;
        Xrm.Page.getAttribute("statuscode").setValue(intStatusNew);
        Xrm.Page.getAttribute("statuscode").setSubmitMode("always");

        Xrm.Page.data.entity.save();
    }
}

function checkApprover() {
    //alert('hi');
    var approver = Xrm.Page.getAttribute("ac_approverid");

    if (approver != null && approver != undefined) {
        var approverValue = approver.getValue();
        if (approverValue != null) {
            // alert(approverValue);
            var approverId = approverValue[0].id;
            if (approverId != null) {
                if (approverId != null) {
                    var user = Xrm.Page.context.getUserId();

                    // alert(user);
                    var createdby = Xrm.Page.getAttribute("createdby").getValue()[0].id;
                    if (user == approverId) {
                        //&& (user != createdby)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    } else {
        Xrm.Page.ui.refreshRibbon();
    }
    //if ((UserHasRole("System Administrator")) || (UserHasRole("Business Administrator"))){
    //	return true;
    //}
}

var attribName = "ac_podid";
var ob = "owningbusinessunit";
var tz = "timezoneruleversionnumber";
var mb = "modifiedby";
var pq = "ac_pricequoteid";
var mo = "modifiedon";
var oid = "ownerid";
var sc = "statecode";
var ou = "owninguser";
var cb = "createdby";
var status = "statuscode";
var co = "createdon";
var ac_name = "ac_name";
var so = 'ac_submittedon';
var qli = 'ac_quotelineitemid';

function onCloneRecordClick() {
    try  {
        if (confirm('Do you want to create a duplicate record?')) {
            // Create Clone Record and Retrieve Primary Key
            var _id = makeClone(Xrm.Page.data.entity.getEntityName(), Xrm.Page.data.entity.getId());

            if (confirm('Duplicate record created successfully.\nDo you want to open it?')) {
                var attribName = Xrm.Page.data.entity.getEntityName();
                var clientUrl = Xrm.Page.context.getClientUrl();
                var etc = Xrm.Page.context.getQueryStringParameters().etc;
                var _url = clientUrl + "/main.aspx?etc=" + etc + "&extraqs=&histKey=116827158&id=%7b" + _id + "%7d&newWindow=true&pagetype=entityrecord";
                window.open(_url, "_window");
            }
        }
    } catch (ex) {
        showError(ex.description);
    }
}

// Create Clone Record
function makeClone(entityName, objId) {
    var attribName = Xrm.Page.data.entity.getEntityName() + "id";
    var fetchXML = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" + "<entity name='" + entityName + "'>" + "<all-attributes />" + "<filter type='and'>" + "<condition attribute='" + attribName + "' operator='eq' value='" + objId + "' />" + "</filter>" + "</entity>" + "</fetch>";
    var oSource = XrmServiceToolkit.Soap.Fetch(fetchXML);

    // Create Clone Record
    var oClone = new XrmServiceToolkit.Soap.BusinessEntity(entityName);

    for (var p in oSource[0].attributes) {
        if (p != ac_name && p != qli && p != attribName && p != ob && p != tz && p != mb && p != pq && p != mo && p != oid && p != sc && p != ou && p != cb && p != status && p != co && p != so && p != null) {
            oClone.attributes[p] = oSource[0].attributes[p];
        }
    }
    var id = XrmServiceToolkit.Soap.Create(oClone);

    var newId = "{" + id + "}";

    CreateChild(objId, newId, 'ac_quotelineitem', 'ac_pricequoteid');
    CreateChild(objId, newId, 'ac_pod', 'ac_pricequoteid');
    return id;
}
function CreateChild(originalEntityId, cloneId, cloneChildEntity, parentFieldOnChild) {
    var fetchXML = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" + "<entity name='" + cloneChildEntity + "'>" + "<all-attributes />" + "<filter type='and'>" + "<condition attribute='" + parentFieldOnChild + "' operator='eq' value='" + originalEntityId + "' />" + "</filter>" + "</entity>" + "</fetch>";

    var oSource = XrmServiceToolkit.Soap.Fetch(fetchXML);

    for (i = 0; i < oSource.length; i++) {
        var oClone = new XrmServiceToolkit.Soap.BusinessEntity(cloneChildEntity);

        for (var p in oSource[i].attributes) {
            if (p != ac_name && p != qli && p != attribName && p != ob && p != tz && p != mb && p != pq && p != mo && p != oid && p != sc && p != ou && p != cb && p != status && p != co && p != so && p != null) {
                //alert(p + " = " + oSource[i].attributes[p]);
                oClone.attributes[p] = oSource[i].attributes[p];
            }
        }

        // oClone.attributes['ac_pricequoteid'].id = cloneId;
        oClone.attributes["ac_pricequoteid"] = { id: cloneId, logicalName: "ac_pricequote", type: "EntityReference" };
        var createClonedProducts = XrmServiceToolkit.Soap.Create(oClone);
    }
}

// Show Error Message
function showError(message) {
    //attachOnChangeAllControls();
    var notificationsArea = document.getElementById('Notifications');

    if (notificationsArea == null) {
        alert(message);
        return;
    }
    notificationsArea.title = '0';
    var notificationHTML = "<div class='Notification'><table cellpadding='0' cellspacing='0'><tbody><tr><td valign='top'><img alt='' class='ms-crm-Lookup-Item' src='/_imgs/error/notif_icn_crit16.png'></td><td" + message + "</td></tr></tbody></table></div>";

    notificationsArea.innerHTML += notificationHTML;
    notificationsArea.style.display = 'block';
}
