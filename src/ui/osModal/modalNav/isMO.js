import {
    itemlessOs,
    updateItemlessLocalStorage,
} from '../../context.js'

import { slotManagerInstance } from "../../mainContainer.js";

function createIsMOContainer(menuOs) {
    const isMOContainer = document.createElement('div');
    isMOContainer.className = 'isMOContainer';

    const textMO = document.createElement('p');
    textMO.className = 'textMO';
    textMO.textContent = 'Master Option';

    // Create checkbox element
    const checkbox = document.createElement('input');
    checkbox.className = 'checkboxMO';
    checkbox.type = 'checkbox';

    checkbox.checked = menuOs.IsMasterOptionSet; // Checkbox checked state reflects menuOs.IsMasterOptionSet

    checkbox.addEventListener('click', function(event) {
        if (itemlessOs.includes(menuOs)) {
            this.checked != this.checked;
            menuOs.IsMasterOptionSet = this.checked; // Update IsMasterOptionSet based on checkbox state
            updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
        } else {
            event.preventDefault(); // Prevent default click behavior
            event.stopPropagation(); // Stop event propagation
        }
    });

    // Append checkbox to isMOContainer
    isMOContainer.appendChild(textMO);
    isMOContainer.appendChild(checkbox);

    return isMOContainer;
}

export { createIsMOContainer };
