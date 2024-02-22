import { updateLocalStorage } from '../context.js';

import { showToolTip } from '../toolTip.js';

import { slotManagerInstance } from '../mainContainer.js';

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
    checkbox.className = 'checkbox';
    checkbox.checked = checked;

    const label = document.createElement('label');
    label.className = 'checkboxLabel';
    label.textContent = displayTaxValue;

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);

    return checkboxContainer;
}

export { createDisplayTaxContainer }