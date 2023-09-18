function createItemTaxCell(menuItem, jsonData) {
    //Tax Cell
    const itemTaxCell = document.createElement('div');
    itemTaxCell.classList.add('itemTaxCell');

    const itemTax = createItemTax(menuItem, jsonData)
    itemTaxCell.appendChild(itemTax);
    
    return itemTaxCell
}

//Shows Tax
function createItemTax(menuItem, jsonData) {
    const itemTax = document.createElement('p');
    itemTax.classList.add('itemTax');
    const itemTaxId = menuItem.TaxRateId
    if(itemTaxId == null) {
        itemTax.textContent = '0%'
    } else {
        const taxRate = jsonData.TaxRates.find(taxRate => taxRate.TaxRateId == itemTaxId);
        itemTax.textContent = taxRate.Rate + '%'
    }

    return itemTax
}

export {
    createItemTaxCell,
}