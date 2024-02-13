import { createTaxTypeContainer } from './taxType.js';

import { createDisplayTaxContainer } from './displayTax.js'

import { createAddTaxContainer } from './addTax.js'

import { createSavedTaxContainer } from './savedTax.js'

function createTaxContainer(jsonData) {
    const taxContainer = document.getElementById('taxContainer');
    taxContainer.innerHTML = '';
    taxContainer.className = 'taxContainer';

    const taxHeaderContainer = createTaxHeaderContainer()
    
    const taxTypeContainer = createTaxTypeContainer(jsonData)

    const displayTaxContainer = createDisplayTaxContainer(jsonData)

    
    const addTaxContainer = createAddTaxContainer(jsonData)
    
    taxContainer.appendChild(taxHeaderContainer);
    taxContainer.appendChild(taxTypeContainer);
    taxContainer.appendChild(displayTaxContainer);

    createSavedTaxContainer(taxContainer)

    taxContainer.appendChild(addTaxContainer);

    return taxContainer
}

function createTaxHeaderContainer() {
    const taxHeaderContainer = document.createElement('div');
    taxHeaderContainer.className = 'taxHeaderContainer';

    const taxHeaderTitle = document.createElement('p');
    taxHeaderTitle.className = 'taxHeaderTitle';
    taxHeaderTitle.textContent = 'Tax Rates';

    taxHeaderContainer.appendChild(taxHeaderTitle);

    return taxHeaderContainer
}

export { createTaxContainer }