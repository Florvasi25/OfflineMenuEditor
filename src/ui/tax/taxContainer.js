import { 
    updateLocalStorage,
    getRandomInt,
    jsonData
} from '../context.js';

import { showToolTip } from '../toolTip.js';

import { slotManagerInstance } from '../mainContainer.js';

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

function createTaxTypeContainer(jsonData) {
    const taxTypeContainer = document.createElement('div');
    taxTypeContainer.className = 'taxTypeContainer';

    const taxTypeTitle = document.createElement('p');
    taxTypeTitle.className = 'taxTypeTitle';
    taxTypeTitle.textContent = 'Tax Type';

    const taxTypeCheckboxes = createTaxTypeCheckboxes(jsonData);
    
    taxTypeContainer.appendChild(taxTypeTitle);
    taxTypeContainer.appendChild(taxTypeCheckboxes);

    return taxTypeContainer;
}

function createTaxTypeCheckboxes(jsonData) {
    const taxTypeContainer = document.createElement('div');
    taxTypeContainer.className = 'taxTypeCheckboxes';

    const excludedCheckbox = taxTypeCheckbox('Excluded');
    excludedCheckbox.classList.add('excludedCheckbox')
    const includedCheckbox = taxTypeCheckbox('Included');
    includedCheckbox.classList.add('includedCheckbox')

    taxTypeContainer.appendChild(excludedCheckbox);
    taxTypeContainer.appendChild(includedCheckbox);

    // Determine initial checkbox state based on jsonData.TaxType
    if (jsonData.TaxType === 1) {
        excludedCheckbox.querySelector('input[type="checkbox"]').checked = true;
    } else {
        includedCheckbox.querySelector('input[type="checkbox"]').checked = true;
    }

    excludedCheckbox.addEventListener('change', () => {
        if (excludedCheckbox.querySelector('input[type="checkbox"]')) {
            jsonData.TaxType = 1; // Update jsonData.TaxType
            includedCheckbox.querySelector('input[type="checkbox"]').checked = false;
            
            const trueCheckbox = document.querySelector('.displayTaxCheckboxes .trueCheckbox');
            trueCheckbox.querySelector('input[type="checkbox"]').checked = true;

            jsonData.DisplayTax = true;

            const falseCheckbox = document.querySelector('.displayTaxCheckboxes .falseCheckbox');
            falseCheckbox.querySelector('input[type="checkbox"]').checked = false;

            console.log(trueCheckbox);
            updateLocalStorage(slotManagerInstance.currentSlot);
        }
    });

    includedCheckbox.addEventListener('change', () => {
        if (includedCheckbox.querySelector('input[type="checkbox"]')) {
            jsonData.TaxType = 0; // Update jsonData.TaxType
            excludedCheckbox.querySelector('input[type="checkbox"]').checked = false;
            updateLocalStorage(slotManagerInstance.currentSlot);
        }
    });

    return taxTypeContainer;
}

function taxTypeCheckbox(taxTypeValue) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkboxContainer';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const label = document.createElement('label');
    label.className = 'checkboxLabel';
    label.textContent = taxTypeValue;

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);

    return checkboxContainer;
}

function createDisplayTaxContainer(jsonData) {
    const displayTaxContainer = document.createElement('div');
    displayTaxContainer.className = 'displayTaxContainer';

    const displayTaxTitle = document.createElement('p');
    displayTaxTitle.className = 'displayTaxTitle';
    displayTaxTitle.textContent = 'Display Tax';

    const displayTaxCheckboxes = createDisplayTaxCheckboxes(jsonData);

    displayTaxContainer.appendChild(displayTaxTitle);
    displayTaxContainer.appendChild(displayTaxCheckboxes);

    return displayTaxContainer;
}

function createDisplayTaxCheckboxes(jsonData) {
    const displayTaxContainer = document.createElement('div');
    displayTaxContainer.className = 'displayTaxCheckboxes';

    const trueCheckbox = displayTaxCheckbox('True', jsonData.DisplayTax === true);
    trueCheckbox.classList.add('trueCheckbox')
    const falseCheckbox = displayTaxCheckbox('False', jsonData.DisplayTax !== true);
    falseCheckbox.classList.add('falseCheckbox')

    displayTaxContainer.appendChild(trueCheckbox);
    displayTaxContainer.appendChild(falseCheckbox);

    trueCheckbox.querySelector('input[type="checkbox"]').addEventListener('change', () => {
        if (trueCheckbox.querySelector('input[type="checkbox"]')) {
            jsonData.DisplayTax = true; // Update jsonData.DisplayTax
            falseCheckbox.querySelector('input[type="checkbox"]').checked = false;
            updateLocalStorage(slotManagerInstance.currentSlot);
        }
    });

    falseCheckbox.querySelector('input[type="checkbox"]').addEventListener('change', () => {
        if (falseCheckbox.querySelector('input[type="checkbox"]')) {
            const excludedCheckbox = document.querySelector('.taxTypeCheckboxes .excludedCheckbox');
            
            if (excludedCheckbox.querySelector('input[type="checkbox"]').checked) {
                falseCheckbox.querySelector('input[type="checkbox"]').checked = false;
                showToolTip(falseCheckbox, 'Excluded Tax must always be True');
                console.log('Excluded');
            } else {
                jsonData.DisplayTax = false; // Update jsonData.DisplayTax
                trueCheckbox.querySelector('input[type="checkbox"]').checked = false;
                updateLocalStorage(slotManagerInstance.currentSlot);
            }
        }
    });

    return displayTaxContainer;
}

function displayTaxCheckbox(displayTaxValue, checked) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('checkboxContainer');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;

    const label = document.createElement('label');
    label.className = 'checkboxLabel';
    label.textContent = displayTaxValue;

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);

    return checkboxContainer;
}

function createAddTaxContainer(jsonData) {
    const addTaxContainer = document.createElement('div');
    addTaxContainer.className = 'addTaxContainer';

    const addTaxButton = document.createElement('button');
    addTaxButton.classList.add('addTaxButton');
    addTaxButton.classList.add('taxButton');
    addTaxButton.textContent = 'Add Tax';

    addTaxContainer.appendChild(addTaxButton);

    addTaxButton.addEventListener('click', () => {
        createNewTaxContainer(addTaxContainer, jsonData)    
    });

    return addTaxContainer;
}

function createNewTaxContainer(addTaxContainer, jsonData) {
    const newTaxContainer = document.createElement('div');
    newTaxContainer.className = 'newTaxContainer';

    const taxNameContainer = document.createElement('div');
    taxNameContainer.className = 'taxNameContainer';

    const taxNameTitle = document.createElement('p');
    taxNameTitle.className = 'taxNameTitle';
    taxNameTitle.textContent = 'Tax Name';

    const taxName = document.createElement('p')
    taxName.contentEditable = true
    taxName.className = 'taxName'
    taxName.textContent = 'Tax ' + (jsonData.TaxRates.length + 1);

    taxNameContainer.appendChild(taxNameTitle);
    taxNameContainer.appendChild(taxName);

    const taxPercentContainer = document.createElement('div');
    taxPercentContainer.className = 'taxPercentContainer';

    const taxPercentTitle = document.createElement('p');
    taxPercentTitle.className = 'taxPercentTitle';
    taxPercentTitle.textContent = 'Tax Percent';

    const taxPercent = document.createElement('p')
    taxPercent.contentEditable = true
    taxPercent.className = 'taxPercent'

    let previousRateValue

    taxPercent.addEventListener('input', function(event) {
        let enteredValue = taxPercent.textContent.replace(/[^\d.]/g, '');
        enteredValue = enteredValue.replace(/(\..*)\./g, '$1');
    
        taxPercent.textContent = enteredValue;
    });
    
    taxPercent.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const enteredValue = taxPercent.textContent;
            previousRateValue = enteredValue; 
            taxPercent.blur()
        }
    });
    
    taxPercent.addEventListener('blur', function(event) {
        if (event.key !== 'Enter') {
            taxPercent.textContent = previousRateValue;
        }
    });

    let previoustaxName

    taxName.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const enteredValue = taxName.textContent;
            previoustaxName = enteredValue; 
            taxName.blur()
        }
    });
    
    taxName.addEventListener('blur', function(event) {
        if (event.key !== 'Enter') {
            taxName.textContent = previoustaxName;
        }
    });

    const saveTaxButton = document.createElement('button');
    saveTaxButton.classList.add('saveTaxButton');
    saveTaxButton.classList.add('taxButton')
    saveTaxButton.textContent = 'Save Tax';
    
    saveTaxButton.addEventListener('click', () => {
        saveTax(newTaxContainer, addTaxContainer, taxPercent, taxName)
    });
    
    taxPercentContainer.appendChild(taxPercentTitle);
    taxPercentContainer.appendChild(taxPercent);
    taxPercentContainer.appendChild(saveTaxButton);
    
    newTaxContainer.appendChild(taxNameContainer);
    newTaxContainer.appendChild(taxPercentContainer);
    
    addTaxContainer.parentNode.insertBefore(newTaxContainer, addTaxContainer);
}

function saveTax(newTaxContainer, addTaxContainer, taxPercent, taxName) {
    if (taxName.textContent == "") {
        showToolTip(taxName, 'Tax Name cannot be Empty');
    } else if (taxPercent.textContent == "") {
        showToolTip(taxName, 'Tax Name cannot be Empty');
    } else {
        const newTaxRate = {
            TaxRateId: getRandomInt(),
            MenuId: jsonData.MenuId,
            Name: taxName.textContent,
            Rate: Number(taxPercent.textContent)
        }

        jsonData.TaxRates.push(newTaxRate);
        console.log('new Tax added');

        updateLocalStorage(slotManagerInstance.currentSlot);

        newTaxContainer.remove()
        const savedTax = createSavedTax(newTaxRate)

        addTaxContainer.parentNode.insertBefore(savedTax, addTaxContainer);
    }
}

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

function editTax(savedTaxContainer, taxRate, savedTaxName, savedTaxRate) {
    const editTaxContainer = document.createElement('div');
    editTaxContainer.className = 'editTaxContainer';
    editTaxContainer.id = taxRate.TaxRateId

    const taxNameContainer = document.createElement('div');
    taxNameContainer.className = 'taxNameContainer';

    const taxNameTitle = document.createElement('p');
    taxNameTitle.className = 'taxNameTitle';
    taxNameTitle.textContent = 'Tax Name';

    const taxName = document.createElement('p')
    taxName.contentEditable = true
    taxName.className = 'taxName'
    taxName.textContent = taxRate.Name

    taxNameContainer.appendChild(taxNameTitle);
    taxNameContainer.appendChild(taxName);

    const taxPercentContainer = document.createElement('div');
    taxPercentContainer.className = 'taxPercentContainer';

    const taxPercentTitle = document.createElement('p');
    taxPercentTitle.className = 'taxPercentTitle';
    taxPercentTitle.textContent = 'Tax Percent';

    const taxPercent = document.createElement('p')
    taxPercent.contentEditable = true
    taxPercent.className = 'taxPercent'
    taxPercent.textContent = taxRate.Rate

    let previousRateValue = taxRate.Rate

    taxPercent.addEventListener('input', function(event) {
        let enteredValue = taxPercent.textContent.replace(/[^\d.]/g, '');
        enteredValue = enteredValue.replace(/(\..*)\./g, '$1');
    
        taxPercent.textContent = enteredValue;
    });
    
    taxPercent.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const enteredValue = taxPercent.textContent;
            previousRateValue = enteredValue; 
            taxPercent.blur()
        }
    });
    
    taxPercent.addEventListener('blur', function(event) {
        if (event.key !== 'Enter') {
            taxPercent.textContent = previousRateValue;
        }
    });

    let previousTaxName = taxRate.Name

    taxName.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const enteredValue = taxName.textContent;
            previousTaxName = enteredValue; 
            taxName.blur()
        }
    });
    
    taxName.addEventListener('blur', function(event) {
        if (event.key !== 'Enter') {
            taxName.textContent = previousTaxName;
        }
    });

    const saveTaxButton = document.createElement('button');
    saveTaxButton.classList.add('saveTaxButton');
    saveTaxButton.classList.add('taxButton')
    saveTaxButton.textContent = 'Save Tax';
    
    saveTaxButton.addEventListener('click', () => {
        updateTax(taxPercent, savedTaxContainer, editTaxContainer, savedTaxName, savedTaxRate, taxRate)
    });
    
    taxPercentContainer.appendChild(taxPercentTitle);
    taxPercentContainer.appendChild(taxPercent);
    taxPercentContainer.appendChild(saveTaxButton);
    
    editTaxContainer.appendChild(taxNameContainer);
    editTaxContainer.appendChild(taxPercentContainer);
    
    savedTaxContainer.replaceWith(editTaxContainer)
}

function updateTax(taxPercent, savedTaxContainer, editTaxContainer, savedTaxName, savedTaxRate, taxRate) {
    const taxName = editTaxContainer.querySelector('.taxName');
    
    if (taxName.textContent == "") {
        showToolTip(taxName, 'Tax Name cannot be Empty');
    } else if (taxPercent.textContent == "") {
        showToolTip(taxPercent, 'Tax Percent cannot be Empty');
    } else {
        const taxRateToUpdate = jsonData.TaxRates.find(tax => tax.TaxRateId == taxRate.TaxRateId);
        taxRateToUpdate.Rate = parseFloat(taxPercent.textContent);
        taxRateToUpdate.Name = taxName.textContent.trim();
        
        updateLocalStorage(slotManagerInstance.currentSlot);

        savedTaxName.textContent = 'Tax Name: ' + taxName.textContent;
        savedTaxRate.textContent = 'Tax Percent: ' + taxPercent.textContent + '%';

        editTaxContainer.replaceWith(savedTaxContainer);
    }
}

function removeTax(savedTaxContainer, removeTaxButton, taxRate) {
    if (removeTaxButton.id == taxRate.TaxRateId) {
        jsonData.TaxRates = jsonData.TaxRates.filter(tax => tax.TaxRateId !== taxRate.TaxRateId);
        updateLocalStorage(slotManagerInstance.currentSlot)
        savedTaxContainer.remove();
    }
}

export { createTaxContainer }