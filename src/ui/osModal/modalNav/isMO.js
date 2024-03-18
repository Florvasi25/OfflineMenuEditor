import { 
    updateLocalStorage,
    jsonData
} from "../../context.js";
import { slotManagerInstance } from "../../mainContainer.js";
import { showToolTipMO } from "../../toolTip.js";

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

    // Make checkbox non-interactive
    checkbox.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default click behavior
        event.stopPropagation(); // Stop event propagation
    });

    // Append checkbox to isMOContainer
    isMOContainer.appendChild(textMO);
    isMOContainer.appendChild(checkbox);

    return isMOContainer;
}

export { createIsMOContainer };
