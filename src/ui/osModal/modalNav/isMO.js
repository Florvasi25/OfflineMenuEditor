import {
    itemlessOs,
    updateItemlessLocalStorage,
} from '../../context.js'

import { slotManagerInstance } from "../../mainContainer.js";
import { showToolTip } from '../../toolTip.js';

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
            menuOs.IsMasterOptionSet = this.checked; // Update IsMasterOptionSet based on checkbox state

            const selectOptionContainer = document.getElementsByClassName('selectOptionContainer')[0];
            const maxLengthButton = document.getElementsByClassName('maxLengthButton')[0];

            if (menuOs.IsMasterOptionSet) {
                const minCount = document.querySelector('.minCount');
                minCount.textContent = 1
                menuOs.MinSelectCount = 1
    
                const maxCount = document.querySelector('.maxCount');
                maxCount.textContent = 1
                menuOs.MaxSelectCount = 1

                selectOptionContainer.style.opacity = 0.50;
                selectOptionContainer.style.cursor = 'not-allowed';
                maxLengthButton.style.display = 'none';
            } else {
                selectOptionContainer.style.opacity = 1;
                selectOptionContainer.style.cursor = 'default';
                maxLengthButton.style.display = 'flex';
            }
        } else {
            showToolTip(checkbox, 'Only Itemless OS can be modified');
            event.preventDefault(); // Prevent default click behavior
            event.stopPropagation(); // Stop event propagation
        }

        updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
    });

    // Append checkbox to isMOContainer
    isMOContainer.appendChild(textMO);
    isMOContainer.appendChild(checkbox);

    return isMOContainer;
}

export { createIsMOContainer };
