/// <reference path="../typescript/XrmServiceToolkit.d.ts" />
/// <reference path="../typescript/Xrm2011.1_0.d.ts" />
function Form_onload() {
    checkForSap();
}

function checkForSap() {
    if (Xrm.Page.getAttribute("accountnumber") != null && Xrm.Page.getAttribute("accountnumber").getValue() != null) {
        Xrm.Page.getControl("accountnumber").setDisabled(true);
        Xrm.Page.getControl("ac_name1").setDisabled(true);
        Xrm.Page.getControl("ac_accountname2").setDisabled(true);
        Xrm.Page.getControl("ac_name3").setDisabled(true);
        Xrm.Page.getControl("ac_name4").setDisabled(true);
        Xrm.Page.getControl("address1_line1").setDisabled(true);
        Xrm.Page.getControl("address1_city").setDisabled(true);
        Xrm.Page.getControl("ac_stateprovinceid").setDisabled(true);
        Xrm.Page.getControl("ac_countryid").setDisabled(true);
        Xrm.Page.getControl("address1_postalcode").setDisabled(true);
        Xrm.Page.getControl("ac_type").setDisabled(true);
        Xrm.Page.getControl("accountclassificationcode").setDisabled(true);
        Xrm.Page.getControl("ac_soldto").setDisabled(true);
    }
}

// Get and then assign the path of the BI report
function SetBIDashboard() {
    var accountNumber = Xrm.Page.getAttribute("accountnumber").getValue();

    var reportUrl = 'http://sappdbp1.fmc.fmcworld.com:51100/irj/servlet/prt/portal/prtroot/pcd!3aportal_content!2fcom.sap.pct!2fplatform_add_ons!2fcom.sap.ip.bi!2fiViews!2fcom.sap.ip.bi.bex?QUERY=Z2_SOP_CRM_DASHBOARD2&BI_COMMAND_1-BI_COMMAND_TYPE=SET_VARIABLES_STATE&BI_COMMAND_1-VARIABLE_VALUES-VARIABLE_VALUE_1-VARIABLE=ZSUSOLDTO&BI_COMMAND_1-VARIABLE_VALUES-VARIABLE_VALUE_1-VARIABLE_TYPE=VARIABLE_INPUT_STRING&BI_COMMAND_1-VARIABLE_VALUES-VARIABLE_VALUE_1-VARIABLE_TYPE-VARIABLE_INPUT_STRING=' + accountNumber + '&oId={948414E5-16BE-DB11-8764-005056995278}&oType=1&oTypeName=account&security=852407&tabSet=InvokeNavItem_Report1Area& login_submit=on&login_do_redirect=1&no_cert_storing=on&j_user=crmtobii&j_password=1mehcudni&j_authscheme=default&uiPasswordLogon=Logon';

    window.open(reportUrl, 'viewSapReportWindow', 'resizable=1,status=1,menubar=1,scrollbars=1,width=550,height=350', window);
}
