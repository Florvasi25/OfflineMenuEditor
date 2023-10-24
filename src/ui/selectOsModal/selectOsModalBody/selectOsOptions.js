function createOptionsContainer(selectOsRowHeader, osGroup) {
    const osOptionContainer = document.createElement('div');
    osOptionContainer.classList.add('osOptionContainer');
    osOptionContainer.id = osGroup.MenuItemOptionSetId;
    selectOsRowHeader.parentNode.insertBefore(osOptionContainer, selectOsRowHeader.nextSibling);
    createOptions(osOptionContainer, osGroup);
}

function createOptions(osOptionContainer, osGroup) {
    const menuOptions = osGroup.MenuItemOptionSetItems;
    
    menuOptions.forEach(menuOption => {
        const osRowOption = createOptionRow(menuOption)
        osOptionContainer.appendChild(osRowOption);
    });
}

function createOptionRow(menuOption) {
    const osRowOption = document.createElement('div');
    osRowOption.classList.add('osRowOption');
    osRowOption.classList.add('draggable');
    osRowOption.classList.add('folded')
    osRowOption.id = menuOption.groupOptionId

    const nameAndMoM = createNameAndMoM(menuOption)
    osRowOption.appendChild(nameAndMoM)

    const priceAndTax = createPriceAndTax(menuOption)
    osRowOption.appendChild(priceAndTax)

    //Unavailable Sections - Gray
    if (!menuOption.IsAvailable) {
        osRowOption.classList.add('unavailable');
    }

    return osRowOption
}

function createNameAndMoM(menuOption) {
    const nameAndMoM = document.createElement('div')
    nameAndMoM.className = 'optionText'
    nameAndMoM.innerHTML = `
    <p class='optionNamePreview' id='${menuOption.groupOptionId}'>${menuOption.Name}</p>
    <p class='dashCountCell'> - </p>
    <p class='optionMoMPreview' id='${menuOption.MenuItemOptionSetItemId}'>${menuOption.NextMenuItemOptionSetId}</p>`

    return nameAndMoM
}

function createPriceAndTax(menuOption) {
    const osTax = document.createElement('p');
    osTax.classList.add('osTax');
    const osTaxId = menuOption.TaxRateId
    if(osTaxId == null) {
        osTax.textContent = '0%'
    } else {
        const taxRate = jsonData.TaxRates.find(taxRate => taxRate.TaxRateId == osTaxId);
        osTax.textContent = taxRate.Rate + '%'
    }

    const priceAsNumber = parseFloat(menuOption.Price);
    
    const priceAndTax = document.createElement('div')
    priceAndTax.className = 'optionText'
    priceAndTax.innerHTML = `
    <p class='optionPricePreview' id='${menuOption.groupOptionId}'>${priceAsNumber.toFixed(2)}</p>
    <p class='dashCountCell'> - </p>
    <p class='optionTaxPreview' id='${menuOption.MenuItemOptionSetItemId}'>${osTax.textContent}</p>`

    return priceAndTax
}

export {
    createOptionsContainer,
}