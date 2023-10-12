import {
    updateLocalStorage,
    groupedOs
} from '../../context.js'

function createMaxCountCell(menuOs, itemId, sectionId) {
    //Name Cell
    const maxCountCell = document.createElement('div');
    maxCountCell.classList.add('maxCountCell');

    const maxText = document.createElement('p')
    maxText.textContent = 'Max'
    maxText.className = 'countText'
    maxCountCell.appendChild(maxText)

    const maxCount = createMaxCount(menuOs, itemId, sectionId)
    maxCountCell.appendChild(maxCount);
    
    return maxCountCell
}

//Handles Name Edits
function createMaxCount(menuOs, itemId, sectionId) {
    const maxCount = document.createElement('p');
    maxCount.classList.add('maxCount');
    maxCount.contentEditable = true;
    maxCount.textContent = menuOs.MaxSelectCount;

    let originalName = menuOs.MaxSelectCount;

    maxCount.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newMaxOsCount = maxCount.textContent;
            updateMaxCount(menuOs.groupOsId, newMaxOsCount);
            originalName = newMaxOsCount;
            maxCount.blur();
            const maxCountArray = Array.from(document.getElementsByClassName('maxSelectCount'));
            const maxSelectCount = maxCountArray.filter((p) => p.id == menuOs.groupOsId)
            maxSelectCount.forEach(os => {
                os.textContent = newMaxOsCount;
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
    groupedOs[groupOsId].forEach(os => {
        os.MaxSelectCount = Number(osMaxCount)
    })

    updateLocalStorage()
}

export { 
    createMaxCountCell, 
    updateMaxCount 
}