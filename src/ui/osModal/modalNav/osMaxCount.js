import {
    updateLocalStorage,
    groupedOs,
    itemlessOs,
    groupOptionSets,
    addItemlessOs,
    deleteItemlessOs
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
            const maxCountArray = Array.from(document.getElementsByClassName('maxSelectCount'));
            const maxSelectCount = maxCountArray.filter((p) => p.id == menuOs.groupOsId)
            updateMaxCount(menuOs.groupOsId, newMaxOsCount);
            maxSelectCount.forEach(os => {
                os.textContent = newMaxOsCount;
                os.id = menuOs.groupOsId
            })

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
function updateMaxCount(groupOsId, osMaxCount) {
    if (groupedOs[groupOsId]) {
        groupedOs[groupOsId].forEach(os => {
            os.MaxSelectCount = osMaxCount
        })
        groupOptionSets()
        updateLocalStorage()
    } else if (itemlessOs[groupOsId]) {
        itemlessOs[groupOsId].MaxSelectCount = osMaxCount
        addItemlessOs(itemlessOs[groupOsId])
        deleteItemlessOs(groupOsId)
    }
}

export { 
    createMaxCountCell, 
    updateMaxCount 
}