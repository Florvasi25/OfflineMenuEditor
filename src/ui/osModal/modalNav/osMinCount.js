import { 
    updateLocalStorage,
    groupedOs,
    itemlessOs,
    groupOptionSets,
    updateItemlessOsKey
} from '../../context.js'

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
        if (e.key === 'Enter') {
            e.preventDefault();
            const newMinOsCount = minCount.textContent;
            originalMinCount = newMinOsCount;
            minCount.blur();

            const oldGroupOsId = menuOs.groupOsId

            updateMinCount(oldGroupOsId, newMinOsCount);
            
            const optionSetIds = groupedOs[menuOs.groupOsId].map(os => os.MenuItemOptionSetId.toString());
            const minSelectCountArray = Array.from(document.getElementsByClassName('minSelectCount'));
            const minSelectCount = minSelectCountArray.filter(p => optionSetIds.includes(p.id));
            minSelectCount.forEach(os => {
                os.textContent = menuOs.MinSelectCount
            })
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
function updateMinCount(groupOsId, osMinCount) {
    if (groupedOs[groupOsId]) {
        groupedOs[groupOsId].forEach(os => {
            os.MinSelectCount = Number(osMinCount)
        })
        groupOptionSets()
        updateLocalStorage()
    } else if (itemlessOs[groupOsId]) {
        itemlessOs[groupOsId].MinSelectCount = Number(osMinCount)
        updateItemlessOsKey(groupOsId)
    }
}

export { createMinCountCell }