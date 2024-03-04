import { jsonData } from "../../context.js";

import { clickCount } from "../../mainContainer.js";

function createOptionsContainer(selectOsRowHeader, osGroup) {
    const osOptionContainer = document.createElement('div');
    osOptionContainer.classList.add('osOptionContainer');
    osOptionContainer.id = osGroup.MenuItemOptionSetId;
    selectOsRowHeader.parentNode.insertBefore(osOptionContainer, selectOsRowHeader.nextSibling);
    createOptions(osOptionContainer, osGroup);

    if (osOptionContainer) {
        var osOptionContainerParagraphs = osOptionContainer.querySelectorAll('p');
        osOptionContainerParagraphs.forEach(function(paragraph) {
            var currentSize = parseInt(window.getComputedStyle(paragraph).fontSize);
            paragraph.style.fontSize = (currentSize + clickCount) + 'px';
        });
    }
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
    osRowOption.id = menuOption.MenuItemOptionSetId

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
    nameAndMoM.className = 'previewNameAndMoM'

    const optionNamePreview = document.createElement('p')
    optionNamePreview.className = 'optionNamePreview'
    optionNamePreview.id = menuOption.MenuItemOptionSetItemId
    if(menuOption.Name == null || menuOption.Name == ''){
        optionNamePreview.textContent = 'Empty'
    }else{
        optionNamePreview.textContent = menuOption.Name
    }
    
    const dashAndMoM = document.createElement('div')
    dashAndMoM.className = 'dashAndMoM'
    
    const dashCountCell = document.createElement('p')
    dashCountCell.className = 'dashCountCell'
    dashCountCell.textContent = ' - '
    
    const optionMoMPreview = document.createElement('p')
    optionMoMPreview.classList.add('optionMoMPreview')
    optionMoMPreview.classList.add('notwarning')
    optionMoMPreview.id = menuOption.MenuItemOptionSetItemId
    optionMoMPreview.textContent = menuOption.NextMenuItemOptionSetId
    if (optionMoMPreview.textContent == "") {
        optionMoMPreview.textContent = "null"
    }

    dashAndMoM.appendChild(dashCountCell)
    dashAndMoM.appendChild(optionMoMPreview)

    nameAndMoM.appendChild(optionNamePreview)
    nameAndMoM.appendChild(dashAndMoM)

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
    priceAndTax.className = 'previewPriceAndTax'
    priceAndTax.innerHTML = `
    <p class='optionPricePreview' id='${menuOption.MenuItemOptionSetItemId}'>${priceAsNumber.toFixed(2)}</p>
    <p class='dashCountCell'> - </p>
    <p class='optionTaxPreview' id='${menuOption.TaxRateId}'>${osTax.textContent}</p>`

    return priceAndTax
}

export {
    createOptionsContainer,
}