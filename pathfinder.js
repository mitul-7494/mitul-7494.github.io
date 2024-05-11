//Function to enter data and make search
function search_po_number(PONumber) {
    document.querySelector("#manufacturing-data-table_filter > label > input").value = PONumber;
    document.querySelector("#manufacturing-data-table_filter > label > input").dispatchEvent(new Event('input'));
}
