function createTaxContainer() {
    const taxContainer = document.getElementById('taxContainer');
    taxContainer.className = 'taxContainer';

    const taxHeaderContainer = createTaxHeaderContainer()
    
    const taxTypeContainer = createTaxTypeContainer()

    const displayTaxContainer = createDisplayTaxContainer()

    const addTaxContainer = createAddTaxContainer()

    taxContainer.appendChild(taxHeaderContainer);
    taxContainer.appendChild(taxTypeContainer);
    taxContainer.appendChild(displayTaxContainer);
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

function createTaxTypeContainer() {
    const taxTypeContainer = document.createElement('div');
    taxTypeContainer.className = 'taxTypeContainer';

    const taxTypeTitle = document.createElement('p');
    taxTypeTitle.className = 'taxTypeTitle';
    taxTypeTitle.textContent = 'Tax Type';

    taxTypeContainer.appendChild(taxTypeTitle);

    return taxTypeContainer
}

function createDisplayTaxContainer() {
    const displayTaxContainer = document.createElement('div');
    displayTaxContainer.className = 'displayTaxContainer';

    const displayTaxTitle = document.createElement('p');
    displayTaxTitle.className = 'displayTaxTitle';
    displayTaxTitle.textContent = 'Display Tax';

    displayTaxContainer.appendChild(displayTaxTitle);

    return displayTaxContainer
}

function createAddTaxContainer() {
    const addTaxContainer = document.createElement('div');
    addTaxContainer.className = 'addTaxContainer';

    const addTaxButton = document.createElement('button');
    addTaxButton.className = 'addTaxButton';
    addTaxButton.textContent = 'Add Tax';

    addTaxContainer.appendChild(addTaxButton);

    return addTaxContainer
}

export { createTaxContainer }