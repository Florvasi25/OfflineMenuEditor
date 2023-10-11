function createOptionTaxCell(menuOption, jsonData) {
    //Tax Cell
    const optionTaxCell = document.createElement('div');
    optionTaxCell.classList.add('optionTaxCell');

    const optionTax = createItemTax(menuOption, jsonData)
    optionTaxCell.appendChild(optionTax);
    
    return optionTaxCell
}

//Shows Tax
function createItemTax(menuOption, jsonData) {
    const optionTax = document.createElement('p');
    optionTax.classList.add('optionTax');
    const optionTaxId = menuOption.TaxRateId
    if(optionTaxId == null) {
        optionTax.textContent = '0%'
    } else {
        const taxRate = jsonData.TaxRates.find(taxRate => taxRate.TaxRateId == optionTaxId);
        optionTax.textContent = taxRate.Rate + '%'
    }

    return optionTax
}

export { createOptionTaxCell }