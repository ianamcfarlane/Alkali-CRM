/// <reference path="../helper/XrmServiceToolkit.js" />
/// <reference path="ac_UserHasRole.ts" />
/// <reference path="../typescript/Xrm.d.ts" />
/// <reference path="../typescript/Xrm2011.1_0.d.ts" />
function Form_onload() {
    checkIfParentIsApproved();
    retrieveParentPriceQuoteChannel();
    onShipToLevelPriceChanged();
    applyDomesticInternational();
    filterProductHierarchyFromParentPriceQuoteProductLine();
}

function retrieveParentPriceQuoteChannel() {
    if (Xrm.Page.getAttribute("ac_pricequoteid").getValue() != null) {
        var pId = Xrm.Page.getAttribute("ac_pricequoteid").getValue()[0].id;

        var cols = ['ac_channel'];
        var returnedEntity = XrmServiceToolkit.Soap.Retrieve('ac_pricequote', pId, cols);

        var channel = returnedEntity.attributes['ac_channel'].value;
        RetrieveChannel(channel);

        function RetrieveChannel(channel) {
            if (channel !== 'undefined') {
                var oNonDistributor = Xrm.Page.getAttribute("ac_nondistributorcommissionzcia");
                var oAgentCommission = Xrm.Page.getAttribute("ac_agentcommissionaccrualzrb8");

                var oDistributorCommissionToStock = Xrm.Page.getAttribute("ac_distributorcommissiontostockzci9");
                var oDistributorCommissionToThirdParty = Xrm.Page.getAttribute("ac_distributorcommission3rdpartyzci1");
                if (channel == 1) {
                    Xrm.Page.ui.tabs.get("Commission").sections.get("DistributerCommission").setVisible(true);
                    Xrm.Page.ui.tabs.get("Commission").sections.get("NonDistributerCommission").setVisible(false);

                    oNonDistributor.setValue(0);
                }
                if (channel == 2) {
                    Xrm.Page.ui.tabs.get("Commission").sections.get("DistributerCommission").setVisible(false);
                    Xrm.Page.ui.tabs.get("Commission").sections.get("NonDistributerCommission").setVisible(true);

                    oDistributorCommissionToStock.setValue(0);
                    oDistributorCommissionToThirdParty.setValue(0);
                }
                if (channel == 3) {
                    Xrm.Page.ui.tabs.get("Commission").sections.get("DistributerCommission").setVisible(true);
                    Xrm.Page.ui.tabs.get("Commission").sections.get("NonDistributerCommission").setVisible(false);

                    oNonDistributor.setValue(0);
                }
                if (channel == 4) {
                    Xrm.Page.ui.tabs.get("Commission").sections.get("DistributerCommission").setVisible(false);
                    Xrm.Page.ui.tabs.get("Commission").sections.get("NonDistributerCommission").setVisible(true);

                    oDistributorCommissionToStock.setValue(0);
                    oDistributorCommissionToThirdParty.setValue(0);
                }
            }
        }
    }
}

//Called from Ascentium_RetrieveParentPriceQuoteChannel() because we are already retrieving the parent price quote.
function filterProductHierarchyFromParentPriceQuoteProductLine() {
    preFilterLookup();
    function preFilterLookup() {
        Xrm.Page.getControl("ac_producthierarchyid").addPreSearch(function () {
            addLookupFilter();
        });
    }
    function addLookupFilter() {
        var pId = Xrm.Page.getAttribute("ac_pricequoteid").getValue()[0].id;

        var cols = ['ac_productlineid'];
        var returnedEntity = XrmServiceToolkit.Soap.Retrieve('ac_pricequote', pId, cols);
        var productLine = returnedEntity.attributes['ac_productlineid'].id;

        if (productLine != null) {
            fetchXml = "<filter type='and'><condition attribute='ac_productlineid' operator='eq' value='" + productLine + "' /></filter>";

            Xrm.Page.getControl("ac_producthierarchyid").addCustomFilter(fetchXml);
        }
    }
}

function checkIfParentIsApproved() {
    var pId = Xrm.Page.getAttribute("ac_pricequoteid").getValue()[0].id;

    var cols = ['statuscode'];
    var returnedEntity = XrmServiceToolkit.Soap.Retrieve('ac_pricequote', pId, cols);

    var statuscode = returnedEntity.attributes['statuscode'].value;
    if (statuscode == '8' || statuscode == '6') {
        disableFormFields(true);

        if (XrmServiceToolkit.Soap.IsCurrentUserRole('System Administrator') || XrmServiceToolkit.Soap.IsCurrentUserRole('Business Administrator')) {
            disableFormFields(false);
        }
    }
}

// Filter the Account (Ship To) field on the Ship To field of the Parent Price Quote
function filterShipToOnParentPriceQuoteShipTo(bLoading) {
    var PriceQuote = Xrm.Page.getAttribute("ac_pricequoteid").getValue();
    RetrievePriceQuoteAccount(PriceQuote);

    function RetrievePriceQuoteAccount(oPQ) {
        var oReq = getXMLHttpRequest();
        if (oReq != null) {
            if (oPQ[0] != null) {
                oReq.open("GET", Xrm.Page.context.prependOrgName("/XRMServices/2011/OrganizationData.svc/AC_pricequoteSet?$filter=AC_pricequoteId%20eq%20(guid'" + oPQ[0].id + "')&$select=ac_accountid"), true);
                oReq.onreadystatechange = function () {
                    DisplayAccountData(oReq);
                };
                oReq.send();
            }
        } else {
            alert('not supported');
        }
    }

    function getXMLHttpRequest() {
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

    function DisplayAccountData(oReq) {
        if (oReq.readyState == 4) {
            if (oReq.status == 200) {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(oReq.responseText);
                var AccountID = xmlDoc.selectSingleNode("//d:ac_accountid/d:Id").text;
                RetrieveShipTo(AccountID);
            }
        }
    }

    function RetrieveShipTo(AccountID) {
        if (AccountID != null) {
            var entityName = "account";
            var viewDisplayName = "Account Name";
            var viewId = "{a76b2c46-c28e-4e5e-9edf-951b71204c9d}";
            var fetchXml = "<fetch mapping='logical' count='50' version='1.0'><entity name='account'><attribute name='accountid' /><filter><condition attribute='parentaccountid' operator='eq' value='" + AccountID + "' /></filter></entity></fetch>";
            var layoutXml = "<grid name='resultset' " + "object='1' " + "jump='name' " + "select='1' " + "icon='1' " + "preview='1'>" + "<row name='result' " + "id='accountid'>" + "<cell name='accountnumber' " + "width='200' />" + "<cell name='name' " + "width='300' />" + "<cell name='ac_name1' " + "width='100' />" + "</row>" + "</grid>";

            Xrm.Page.getControl("ac_shiptoid").addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true);
            Xrm.Page.getControl("ac_shiptoid").setDisabled(false);
        } else {
            Xrm.Page.getControl("ac_shiptoid").setDisabled(true);
            Xrm.Page.data.entity.attributes.get("ac_producthierarchyid").setValue(null);
        }
    }
}

// When the ac_shiptolevelpricing field is changed this will refilter the Account lookup (thus correcting the enabled state)
function onShipToLevelPriceChanged() {
    if (Xrm.Page.getAttribute("ac_shiptolevelpricing").getValue() != null) {
        if (Xrm.Page.getAttribute("ac_shiptolevelpricing").getValue() == true) {
            filterShipToOnParentPriceQuoteShipTo(true);
            Xrm.Page.getAttribute("ac_shiptoid").setRequiredLevel("required");
        } else {
            Xrm.Page.getControl("ac_shiptoid").setDisabled(true);
            Xrm.Page.getAttribute("ac_shiptoid").setRequiredLevel("none");
        }
    }
}

//Clears all of the Money fields on the form -- Move to [] Array
//Called from ac_freightterms onChange and ac_plantortransloaderwarehouse onChange
function clearMoneyFields() {
    //Xrm.Page.getAttribute("ac_shippinghandlingfee").setValue(null);
    Xrm.Page.getAttribute("ac_localfreighttocustomer").setValue(null);
    Xrm.Page.getAttribute("ac_canadianfreightforwardingfee").setValue(null);
    Xrm.Page.getAttribute("ac_railtrucktotransloaderwarehouse").setValue(null);
    Xrm.Page.getAttribute("ac_transloaderfee").setValue(null);
    Xrm.Page.getAttribute("ac_productfreight").setValue(null);

    //Xrm.Page.getAttribute("ac_drumcharge").setValue(null);
    Xrm.Page.getAttribute("ac_netsellingprice").setValue(null);
    Xrm.Page.getAttribute("ac_productprice").setValue(null);
}

//Checks if Quote line item is domestic or international
function applyDomesticInternational() {
    if (Xrm.Page.getAttribute("ac_domesticorinternational").getValue() != null) {
        if (Xrm.Page.getAttribute("ac_domesticorinternational").getValue() == true) {
            Xrm.Page.ui.tabs.get("International").setVisible(true);
        } else {
            Xrm.Page.ui.tabs.get("International").setVisible(false);
        }
    }
}

// Retrieve the value of the Channel picklist on the parent price quote
// Recalculate the Net Selling Price on the form
function calculateNetSellingPrice() {
    var oPrice = Xrm.Page.getAttribute("ac_productprice");
    var pctNonDistributor = (Xrm.Page.getAttribute("ac_nondistributorcommissionzcia").getValue() / 100) * oPrice.getValue();
    var pctAgentCommission = (Xrm.Page.getAttribute("ac_agentcommissionaccrualzrb8").getValue() / 100) * oPrice.getValue();

    var pctDistributorCommissionToStock = (Xrm.Page.getAttribute("ac_distributorcommissiontostockzci9").getValue() / 100) * oPrice.getValue();
    var pctDistributorCommissionToThirdParty = (Xrm.Page.getAttribute("ac_distributorcommission3rdpartyzci1").getValue() / 100) * oPrice.getValue();

    var oNetSelling = Xrm.Page.getAttribute("ac_netsellingprice");
    oNetSelling.setValue(oPrice.getValue() - pctNonDistributor - pctAgentCommission - pctDistributorCommissionToStock - pctDistributorCommissionToThirdParty);
    oNetSelling.setSubmitMode("always");
}

// Whenever either the Freight Assumption or the Product Price are changed, this updates the value of the Product Plus Freight
function calculateProductPlusFreight() {
    // Check to see if it is visible...
    var oProductPlusFreight = Xrm.Page.getAttribute("ac_productfreight");
    oProductPlusFreight.setSubmitMode("always");

    var freightTerms = Xrm.Page.getAttribute("ac_freightterms").getValue();
    var plantBit = Xrm.Page.getAttribute("ac_plantortransloaderwarehouse").getValue();

    oProductPlusFreight.setValue(Xrm.Page.getAttribute("ac_freightassumption").getValue() + Xrm.Page.getAttribute("ac_productprice").getValue() + Xrm.Page.getAttribute("ac_fmcshippinghandlingchargeuom").getValue());
}

function calculateFreightAssumption() {
    var oRailTruckTransloader = Xrm.Page.getAttribute("ac_railtrucktotransloaderwarehouse");
    var oTransloaderWarehouseFee = Xrm.Page.getAttribute("ac_transloaderfee");
    var oLocalToCustomer = Xrm.Page.getAttribute("ac_localfreighttocustomer");

    var oFreightAssumption = Xrm.Page.getAttribute("ac_freightassumption");
    oFreightAssumption.setValue(oRailTruckTransloader.getValue() + oTransloaderWarehouseFee.getValue() + oLocalToCustomer.getValue());
    oFreightAssumption.setSubmitMode("always");

    // Update the Product + Freight field
    calculateProductPlusFreight();
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

function ac_pricequoteid_onchange() {
    retrieveParentPriceQuoteChannel();
}
function ac_shiptolevelpricing_onchange() {
    onShipToLevelPriceChanged();
}
function ac_producthierarchyid_onchange() {
}
function ac_domesticorinternational_onchange() {
    applyDomesticInternational();
}
function ac_freightterms_onchange() {
    //freightTermsPlantOrTransloader_OnChange();
    clearMoneyFields();
}
function ac_plantortransloaderwarehouse_onchange() {
    //freightTermsPlantOrTransloader_OnChange();
}
function ac_productprice_onchange() {
    calculateNetSellingPrice();
    calculateProductPlusFreight();
}
function ac_freightassumption_onchange() {
    calculateNetSellingPrice();
    calculateProductPlusFreight();
}
function ac_railtrucktotransloaderwarehouse_onchange() {
    calculateNetSellingPrice();
    calculateProductPlusFreight();
    calculateFreightAssumption();
}
function ac_transloaderfee_onchange() {
    calculateNetSellingPrice();
    calculateProductPlusFreight();
    calculateFreightAssumption();
}
function ac_fmcshippinghandlingchargeuom_onchange() {
    calculateProductPlusFreight();
}
function ac_localfreighttocustomer_onchange() {
    calculateNetSellingPrice();
    calculateProductPlusFreight();
    calculateFreightAssumption();
}
function ac_distributorcommission3rdpartyzci1_onchange() {
    calculateNetSellingPrice();
}
function ac_distributorcommissiontostockzci9_onchange() {
    calculateNetSellingPrice();
}
function ac_nondistributorcommissionzcia_onchange() {
    calculateNetSellingPrice();
}
function ac_agentcommissionaccrualzrb8_onchange() {
    calculateNetSellingPrice();
}
