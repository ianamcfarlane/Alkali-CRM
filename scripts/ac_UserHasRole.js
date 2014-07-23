/// <reference path="../typescript/XrmServiceToolkit.d.ts" />
/// <reference path="../typescript/Xrm2011.1_0.d.ts" />
function UserHasRole(roleName) {
    var serverUrl = Xrm.Page.context.getServerUrl();
    var oDataEndpointUrl = Xrm.Page.context.prependOrgName("/XRMServices/2011/OrganizationData.svc/");

    //var org = Xrm.Page.context.getOrgUniqueName()
    //var oDataEndpointUrl = "/" + org + "/XRMServices/2011/OrganizationData.svc/";
    oDataEndpointUrl += "RoleSet?$top=1&$filter=Name eq '" + roleName + "'";

    var service = GetRequestObject();

    if (service != null) {
        service.open("GET", oDataEndpointUrl, false);
        service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
        service.setRequestHeader("Accept", "application/json, text/javascript, */*");
        service.send(null);

        var requestResults = eval('(' + service.responseText + ')').d;

        if (requestResults != null && requestResults.results.length == 1) {
            var role = requestResults.results[0];
            var id = role.RoleId;
            var currentUserRoles = Xrm.Page.context.getUserRoles();

            for (var i = 0; i < currentUserRoles.length; i++) {
                var userRole = currentUserRoles[i];
                if (GuidsAreEqual(userRole, id)) {
                    return true;
                }
            }
        }
    }
    return false;
}
function GetRequestObject() {
    if (window.XMLHttpRequest) {
        return new window.XMLHttpRequest();
    } else {
        try  {
            return new ActiveXObject("MSXML2.XMLHTTP.3.0");
        } catch (ex) {
            return null;
        }
    }
}

function GuidsAreEqual(guid1, guid2) {
    var isEqual = false;

    if (guid1 == null || guid2 == null) {
        isEqual = false;
    } else {
        isEqual = guid1.replace(/[{}]/g, "").toLowerCase() == guid2.replace(/[{}]/g, "").toLowerCase();
    }

    return isEqual;
}
