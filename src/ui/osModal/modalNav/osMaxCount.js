import {
    updateLocalStorage,
    groupedOs,
    itemlessOs,
    groupOptionSets,
    updateItemlessLocalStorage
} from '../../context.js'

function createMaxCountCell(menuOs) {
    //Name Cell
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

//Handles Name Edits
function createMaxCount(menuOs) {
    const maxCount = document.createElement('p');
    maxCount.classList.add('maxCount');
    maxCount.contentEditable = true;
    maxCount.textContent = menuOs.MaxSelectCount;

    let originalName = menuOs.MaxSelectCount;

    maxCount.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newMaxOsCount = maxCount.textContent;
            originalName = newMaxOsCount;
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
        }
    });

    maxCount.addEventListener('blur', () => {
        maxCount.textContent = originalName;
        maxCount.classList.remove('sectionClicked')
    });

    maxCount.addEventListener('click', () => {
        maxCount.classList.add('sectionClicked')
    })

    return maxCount
}

//Updates Name
function updateMaxCount(menuOs, osMaxCount) {
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
}