import {
    updateLocalStorage,
    groupedOs,
    itemlessOs,
    updateItemlessLocalStorage
} from '../../context.js'

import { showToolTip } from '../../toolTip.js'

import { slotManagerInstance } from  "../../mainContainer.js";

function createMinCountCell(menuOs) {
    //Name Cell
    const minCountCell = document.createElement('div');
    minCountCell.classList.add('minCountCell');

    const minText = document.createElement('p')
    minText.textContent = 'Min'
    minText.className = 'countText'
    minCountCell.appendChild(minText)

    const minCount = createMinCount(menuOs)
    minCountCell.appendChild(minCount);

    return minCountCell
}

//Handles Name Edits
function createMinCount(menuOs) {
    const minCount = document.createElement('p');
    minCount.classList.add('minCount');
    minCount.contentEditable = true;
    minCount.textContent = menuOs.MinSelectCount;

    // Check if IsMasterOptionSet is true, then disable content editing
    if (menuOs.IsMasterOptionSet) {
        minCount.contentEditable = false;
    } else {
        minCount.contentEditable = true;
    }

    minCount.addEventListener('keydown', (e) => {
        const inputKey = e.key;
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        let originalMinCount = menuOs.MinSelectCount;
        // console.log('originalMinCount', originalMinCount);

        if (e.key === 'Enter') {
            e.preventDefault();
            const newMinOsCount = minCount.textContent.trim();
            // originalMinCount = newMinOsCount;

            const optionsArray = Array.from(document.getElementsByClassName('optionRow'));
            const optionsLength = optionsArray.length;

            if (newMinOsCount === '' || isNaN(newMinOsCount)) {
                showToolTip(minCount, 'MinCount cannot be Empty');
                minCount.textContent = originalMinCount; // Revert back to the original number
                return;
            } else if (parseInt(newMinOsCount) > optionsLength) {
                showToolTip(minCount, 'MinCount cannot be greater than the length of Options');
                minCount.textContent = originalMinCount; // Revert back to the original number
                return;
            } else if (parseInt(newMinOsCount) > menuOs.MaxSelectCount) { 
                showToolTip(minCount, 'MinCount cannot be greater than MaxCount');
                minCount.textContent = originalMinCount; // Revert back to the original number
                return;
            } else {
                originalMinCount = newMinOsCount; // Update the original number
                // console.log('OK - newMinOsCount', newMinOsCount);
            }

            updateMinCount(menuOs, newMinOsCount);
            minCount.blur();

            if (groupedOs[menuOs.groupOsId]) {
                const optionSetIds = groupedOs[menuOs.groupOsId].map(os => os.MenuItemOptionSetId.toString());
                const minSelectCountArray = Array.from(document.getElementsByClassName('minSelectCount'));
                const minSelectCount = minSelectCountArray.filter(p => optionSetIds.includes(p.id));
                minSelectCount.forEach(os => {
                    os.textContent = newMinOsCount
                })
            }
        } else if (e.key === 'Escape') {
            minCount.textContent = originalMinCount;
            minCount.blur();
        } else if (!allowedKeys.includes(inputKey) && inputKey !== 'Backspace' && inputKey !== 'Delete' && inputKey !== 'ArrowLeft' && inputKey !== 'ArrowRight') {
            e.preventDefault(); // Prevent typing characters other than numbers
        }
    });

    minCount.addEventListener('blur', () => {
        minCount.textContent = menuOs.MinSelectCount;
    });

    return minCount
}

//Updates Name
function updateMinCount(menuOs, osMinCount) {
    if (groupedOs[menuOs.groupOsId]) {
        groupedOs[menuOs.groupOsId].forEach(os => {
            os.MinSelectCount = Number(osMinCount)
        })
        updateLocalStorage(slotManagerInstance.currentSlot);
    } else if (itemlessOs.includes(menuOs)){
        menuOs.MinSelectCount = Number(osMinCount)
        updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
    }
}

function minLength(menuOs) {
    const optionsLength = Array.from(document.getElementsByClassName('optionRow')).length;

    const minCount = document.querySelector('.minCount');
    if (minCount) {
        minCount.textContent = optionsLength;
    }

    if (groupedOs[menuOs.groupOsId]) {
        const optionSetIds = groupedOs[menuOs.groupOsId].map(os => os.MenuItemOptionSetId.toString());
        const minSelectCountArray = Array.from(document.getElementsByClassName('minSelectCount'));
        const minSelectCount = minSelectCountArray.filter(p => optionSetIds.includes(p.id));
        minSelectCount.forEach(os => {
            os.textContent = optionsLength
        })
    }

    updateMinCount(menuOs, optionsLength);
}

export { 
    createMinCountCell,
    minLength
}