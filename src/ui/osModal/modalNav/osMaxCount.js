import {
    updateLocalStorage,
    groupedOs,
    itemlessOs,
    groupOptionSets,
    updateItemlessLocalStorage
} from '../../context.js'

import { 
    showToolTip, 
    removeToolTip 
} from '../../toolTip.js'

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
    maxCount.contentEditable = true;
    maxCount.textContent = menuOs.MaxSelectCount;

    let originalName = menuOs.MaxSelectCount;

    maxCount.addEventListener('keydown', (e) => {
        const inputKey = e.key;
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        if (e.key === 'Enter') {
            e.preventDefault();
            const newMaxOsCount = maxCount.textContent.trim();

            const optionsArray = Array.from(document.getElementsByClassName('optionRow'));
            const optionsLength = optionsArray.length;

            if (newMaxOsCount === '' || isNaN(newMaxOsCount) || parseInt(newMaxOsCount) === 0) {
                showToolTip(maxCount, 'MaxCount cannot be Empty or 0');
                maxCount.textContent = originalName; // Revert back to the original number
                return;
            } else if (parseInt(newMaxOsCount) > optionsLength) {
                showToolTip(maxCount, 'MaxCount cannot be greater than the length of Options');
                maxCount.textContent = originalName; // Revert back to the original number
                return;
            } else {
                removeToolTip(maxCount);
                originalName = newMaxOsCount; // Update the original number
            }

            maxCount.blur();
            updateMaxCount(menuOs, newMaxOsCount);

            if (groupedOs[menuOs.groupOsId]) {
                const optionSetIds = groupedOs[menuOs.groupOsId].map(os => os.MenuItemOptionSetId.toString());
                const maxSelectCountArray = Array.from(document.getElementsByClassName('maxSelectCount'));
                const maxSelectCount = maxSelectCountArray.filter(p => optionSetIds.includes(p.id));
                maxSelectCount.forEach(os => {
                    os.textContent = menuOs.MaxSelectCount
                })
            }
        } else if (e.key === 'Escape') {
            maxCount.textContent = originalName;
            maxCount.blur();
        } else if (!allowedKeys.includes(inputKey) && inputKey !== 'Backspace' && inputKey !== 'Delete' && inputKey !== 'ArrowLeft' && inputKey !== 'ArrowRight') {
            e.preventDefault(); // Prevent typing characters other than numbers
        }
    });

    maxCount.addEventListener('blur', () => {
        maxCount.textContent = originalName;
        maxCount.classList.remove('sectionClicked');
    });

    maxCount.addEventListener('click', () => {
        maxCount.classList.add('sectionClicked');
    });

    return maxCount;
}

// Updates MaxCount
function updateMaxCount(menuOs, osMaxCount) {
    const optionsArray = Array.from(document.getElementsByClassName('optionRow'));
    const optionsLength = optionsArray.length;

    if (parseInt(osMaxCount) > optionsLength) {
        showToolTip(maxCount, 'MaxCount cannot be greater than the length of Options');
        return;
    }

    if (groupedOs[menuOs.groupOsId]) {
        groupedOs[menuOs.groupOsId].forEach(os => {
            os.MaxSelectCount = osMaxCount
        })
        groupOptionSets()
        updateLocalStorage()
    } else if (itemlessOs.includes(menuOs)){
        menuOs.MaxSelectCount = osMaxCount
        updateItemlessLocalStorage();
    }
}

export {
    createMaxCountCell,
    updateMaxCount
};
