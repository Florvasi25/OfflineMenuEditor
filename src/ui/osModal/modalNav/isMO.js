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
            
            const minCount = document.querySelector('.minCount');
            const maxCount = document.querySelector('.maxCount');
            
            if (menuOs.IsMasterOptionSet) {
                minCount.textContent = 1
                minCount.contentEditable = false;
                minCount.style.cursor = 'not-allowed';
                menuOs.MinSelectCount = 1
    
                maxCount.textContent = 1
                maxCount.contentEditable = false;
                maxCount.style.cursor = 'not-allowed';
                menuOs.MaxSelectCount = 1

                selectOptionContainer.style.opacity = 0.50;
                selectOptionContainer.style.cursor = 'not-allowed';
                maxLengthButton.style.display = 'none';
            } else {
                selectOptionContainer.style.opacity = 1;
                selectOptionContainer.style.cursor = 'default';
                
                maxLengthButton.style.display = 'flex';

                minCount.contentEditable = true;
                minCount.style.cursor = 'text';

                maxCount.contentEditable = true;
                maxCount.style.cursor = 'text';
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
