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

    let originalMinCount = menuOs.MinSelectCount;

    minCount.addEventListener('keydown', (e) => {
        const inputKey = e.key;
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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
            } else {
                removeToolTip(minCount);
                originalMinCount = newMinOsCount; // Update the original number
            }

            minCount.blur();
            updateMinCount(menuOs, newMinOsCount);

            if (groupedOs[menuOs.groupOsId]) {
                const optionSetIds = groupedOs[menuOs.groupOsId].map(os => os.MenuItemOptionSetId.toString());
                const minSelectCountArray = Array.from(document.getElementsByClassName('minSelectCount'));
                const minSelectCount = minSelectCountArray.filter(p => optionSetIds.includes(p.id));
                minSelectCount.forEach(os => {
                    os.textContent = menuOs.MinSelectCount
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
        minCount.textContent = originalMinCount;
        minCount.classList.remove('sectionClicked')
    });

    minCount.addEventListener('click', () => {
        minCount.classList.add('sectionClicked')
    })

    return minCount
}

//Updates Name
function updateMinCount(menuOs, osMinCount) {
    if (groupedOs[menuOs.groupOsId]) {
        groupedOs[menuOs.groupOsId].forEach(os => {
            os.MinSelectCount = Number(osMinCount)
        })
        groupOptionSets()
        updateLocalStorage()
    } else if (itemlessOs.includes(menuOs)){
        menuOs.MinSelectCount = Number(osMinCount)
        updateItemlessLocalStorage();
    }
}

export { createMinCountCell }