import { 
    jsonData,
    getOsIndex,
    updateLocalStorage 
} from '../../context.js'

function createMinCountCell(menuOs, itemId, sectionId) {
    //Name Cell
    const minCountCell = document.createElement('div');
    minCountCell.classList.add('minCountCell');

    const minText = document.createElement('p')
    minText.textContent = 'Min'
    minText.className = 'countText'
    minCountCell.appendChild(minText)

    const minCount = createMinCount(menuOs, itemId, sectionId)
    minCountCell.appendChild(minCount);
    
    return minCountCell
}

//Handles Name Edits
function createMinCount(menuOs, itemId, sectionId) {
    const minCount = document.createElement('p');
    minCount.classList.add('minCount');
    minCount.contentEditable = true;
    minCount.textContent = menuOs.MinSelectCount;

    let originalMinCount = menuOs.MinSelectCount;

    minCount.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newMinOsCount = minCount.textContent;
            updateMinCount(menuOs.MenuItemOptionSetId, itemId, sectionId, newMinOsCount);
            originalMinCount = newMinOsCount;
            minCount.blur();
            const minCountArray = Array.from(document.getElementsByClassName('minSelectCount'));
            const minSelectCount = minCountArray.find((p) => p.id == menuOs.MenuItemOptionSetId)
            minSelectCount.textContent = newMinOsCount;
        } else if (e.key === 'Escape') {
            minCount.textContent = originalMinCount;
            minCount.blur();
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
function updateMinCount(osHeaderId, itemId, sectionId, osMinCount) {
    const {itemIndex, sectionIndex, osIndex} = getOsIndex(sectionId, itemId, osHeaderId)
    jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MinSelectCount = Number(osMinCount);

    updateLocalStorage()
}

export { createMinCountCell }