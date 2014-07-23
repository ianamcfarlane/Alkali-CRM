/// <reference path="../typescript/XrmServiceToolkit.d.ts" />
/// <reference path="../typescript/Xrm2011.1_0.d.ts" />
// Update the value in the ac_riskadjustedestrevenue field.
function recalculateRiskAdjustedEstRevenue() {
    var riskAdjusted = Xrm.Page.getAttribute("ac_riskadjustedestrevenue");
    var estValue = Xrm.Page.getAttribute("estimatedvalue");
    var probability = Xrm.Page.getAttribute("closeprobability");

    if (estValue.getValue() != null && probability.getValue() != null) {
        riskAdjusted.setValue(estValue.getValue() * (probability.getValue() / 100));
    }
}

function estimatedvalue_onchange() {
    recalculateRiskAdjustedEstRevenue();
}
function closeprobability_onchange() {
    recalculateRiskAdjustedEstRevenue();
}
