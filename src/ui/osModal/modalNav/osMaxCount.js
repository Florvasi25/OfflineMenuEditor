import {
    updateLocalStorage,
    groupedOs,
    itemlessOs,
    updateItemlessLocalStorage
} from '../../context.js'

import { showToolTip } from '../../toolTip.js'

import { slotManagerInstance } from  "../../mainContainer.js";

function createMaxCountCell(menuOs) {
    // MaxCount Cell
    const maxCountCell = document.createElement('div');
    maxCountCell.classList.add('maxCountCell');

    const maxText = document.createElement('p')
    maxText.textContent = 'Max'
    maxText.className = 'countText'
    maxCountCell.appendChild(maxText)

    const maxCount = createMaxCount(menuOs)
    maxCountCell.appendChild(maxCount);

    return maxCountCell
}

// Handles MaxCount Edits
function createMaxCount(menuOs) {
    const maxCount = document.createElement('p');
    maxCount.classList.add('maxCount');
    maxCount.textContent = menuOs.MaxSelectCount;

    // Check if IsMasterOptionSet is true, then disable content editing
    if (menuOs.IsMasterOptionSet) {
        maxCount.contentEditable = false;
    } else {
        maxCount.contentEditable = true;
    }

    maxCount.addEventListener('keydown', (e) => {
        const inputKey = e.key;
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        let originalMaxCount = menuOs.MaxSelectCount;

        if (e.key === 'Enter') {
            e.preventDefault();
            const newMaxOsCount = maxCount.textContent.trim();

            const optionsArray = Array.from(document.getElementsByClassName('optionRow'));
            const optionsLength = optionsArray.length;

            if (newMaxOsCount === '' || isNaN(newMaxOsCount) || parseInt(newMaxOsCount) === 0) {
                showToolTip(maxCount, 'MaxCount cannot be Empty or 0');
                maxCount.textContent = originalMaxCount; // Revert back to the original number
                return;
            } else if (parseInt(newMaxOsCount) > optionsLength) {
                showToolTip(maxCount, 'MaxCount cannot be greater than the length of Options');
                maxCount.textContent = originalMaxCount; // Revert back to the original number
                return;
            } else if (parseInt(newMaxOsCount) < parseInt(menuOs.MinSelectCount)) {
                showToolTip(maxCount, 'MaxCount cannot be lower than MinCount');
                maxCount.textContent = originalMaxCount; // Revert back to the original number
                return;
            } else {
                originalMaxCount = newMaxOsCount; // Update the original number
            }

            updateMaxCount(menuOs, newMaxOsCount);
            maxCount.blur();

            if (groupedOs[menuOs.groupOsId]) {
                const optionSetIds = groupedOs[menuOs.groupOsId].map(os => os.MenuItemOptionSetId.toString());
                const maxSelectCountArray = Array.from(document.getElementsByClassName('maxSelectCount'));
                const maxSelectCount = maxSelectCountArray.filter(p => optionSetIds.includes(p.id));
                maxSelectCount.forEach(os => {
                    os.textContent = newMaxOsCount
                })
            }
        } else if (e.key === 'Escape') {
            maxCount.textContent = originalMaxCount;
            maxCount.blur();
        } else if (!allowedKeys.includes(inputKey) && inputKey !== 'Backspace' && inputKey !== 'Delete' && inputKey !== 'ArrowLeft' && inputKey !== 'ArrowRight') {
            e.preventDefault(); // Prevent typing characters other than numbers
        }
    });

    maxCount.addEventListener('blur', () => {
        maxCount.textContent = menuOs.MaxSelectCount;
    });

    return maxCount;
}

// Updates MaxCount
function updateMaxCount(menuOs, osMaxCount) {
    if (groupedOs[menuOs.groupOsId]) {
        groupedOs[menuOs.groupOsId].forEach(os => {
            os.MaxSelectCount = Number(osMaxCount)
        })
        updateLocalStorage(slotManagerInstance.currentSlot);
    } else if (itemlessOs.includes(menuOs)){
        menuOs.MaxSelectCount = Number(osMaxCount)
        updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
    }
}

export {
    createMaxCountCell,
    updateMaxCount
};
