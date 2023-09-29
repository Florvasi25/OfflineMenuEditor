import { 
    jsonData,
    getOsIndex, 
} from '../context.js'

function createOptionsContainer(osRowOption, sectionId, itemId, osId) {
    const optionContainer = document.createElement('div');
    optionContainer.classList.add('optionContainer');
    osRowOption.parentNode.insertBefore(optionContainer, osRowOption.nextSibling);
    createOptions(optionContainer, sectionId, itemId, osId);    
}

function createOptions(optionContainer, sectionId, itemId, osId) {
    const {itemIndex, sectionIndex, osIndex} = getOsIndex(sectionId, itemId, osId)
    const menuOptions = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems;
    
    menuOptions.forEach(menuOption => {
        const osRowOption = createOptionRow(menuOption)
        optionContainer.appendChild(osRowOption);
    });
}

function createOptionRow(menuOption) {
    const osRowOption = document.createElement('div');
    osRowOption.classList.add('osRowOption');
    osRowOption.classList.add('draggable');
    osRowOption.classList.add('folded')
    osRowOption.id = menuOption.MenuItemOptionSetItemId

    const nameAndMoM = createNameAndMoM(menuOption)
    osRowOption.appendChild(nameAndMoM)

    const priceAndTax = createPriceAndTax(menuOption)
    osRowOption.appendChild(priceAndTax)
    
    return osRowOption
}

function createNameAndMoM(menuOption) {
    const nameAndMoM = document.createElement('div')
    nameAndMoM.className = 'optionText'
    nameAndMoM.innerHTML = `
    <p class='optionNamePreview' id='${menuOption.MenuItemOptionSetItemId}'>${menuOption.Name}</p>
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
    
    const priceAndTax = document.createElement('div')
    priceAndTax.className = 'optionText'
    priceAndTax.innerHTML = `${menuOption.Price} - ${osTax.textContent}`

    return priceAndTax
}

export {
    createOptionsContainer,
}