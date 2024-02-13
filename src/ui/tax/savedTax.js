import { jsonData } from '../context.js';

import { editTax } from './editTax.js'

import { removeTax } from './removeTax.js'

function createSavedTaxContainer(taxContainer) {
    jsonData.TaxRates.forEach(taxRate => {
        const taxRateRow = createSavedTax(taxRate)

        taxContainer.appendChild(taxRateRow)
    })
}

function createSavedTax(taxRate) {
    const savedTaxContainer = document.createElement('div');
    savedTaxContainer.className = 'savedTaxContainer';
    savedTaxContainer.id = taxRate.TaxRateId

    const taxNameAndPercent = document.createElement('div')
    taxNameAndPercent.className = 'taxNameAndPercent'

    const savedTaxName = document.createElement('p')
    savedTaxName.className = 'savedTaxName'
    savedTaxName.textContent = 'Tax Name: ' + taxRate.Name
    savedTaxName.id = taxRate.TaxRateId

    const dashCell = document.createElement('p')
    dashCell.className = 'dashCountCell'
    dashCell.textContent = '-'

    const savedTaxRate = document.createElement('p')
    savedTaxRate.className = 'savedTaxRate'
    savedTaxRate.textContent = 'Tax Percent: ' + taxRate.Rate +'%'
    savedTaxRate.id = taxRate.TaxRateId

    taxNameAndPercent.appendChild(savedTaxName)
    taxNameAndPercent.appendChild(dashCell)     
    taxNameAndPercent.appendChild(savedTaxRate)

    const savedTaxButtons = document.createElement('div')
    savedTaxButtons.className = 'savedTaxButtons'

    const editTaxButton = document.createElement('button');
    editTaxButton.classList.add('editTaxButton');
    editTaxButton.classList.add('taxButton')
    editTaxButton.textContent = 'Edit Tax';
    editTaxButton.id = taxRate.TaxRateId

    const removeTaxButton = document.createElement('button');
    removeTaxButton.classList.add('removeTaxButton');
    removeTaxButton.classList.add('taxButton')
    removeTaxButton.textContent = 'Remove Tax';
    removeTaxButton.id = taxRate.TaxRateId

    editTaxButton.addEventListener('click', () => {
        editTax(savedTaxContainer, taxRate, savedTaxName, savedTaxRate)
    })

    removeTaxButton.addEventListener('click', () => {
        removeTax(savedTaxContainer, removeTaxButton, taxRate)
    })

    savedTaxButtons.appendChild(editTaxButton);
    savedTaxButtons.appendChild(removeTaxButton);

    savedTaxContainer.appendChild(taxNameAndPercent);
    savedTaxContainer.appendChild(savedTaxButtons);

    return savedTaxContainer
}

export { 
    createSavedTaxContainer, 
    createSavedTax 
}