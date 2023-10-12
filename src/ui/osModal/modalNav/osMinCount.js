import { 
    updateLocalStorage,
    groupedOs 
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
            updateMinCount(menuOs.groupOsId, newMinOsCount);
            originalMinCount = newMinOsCount;
            minCount.blur();
            const minCountArray = Array.from(document.getElementsByClassName('minSelectCount'));
            const minSelectCount = minCountArray.filter((p) => p.id == menuOs.groupOsId)
            minSelectCount.forEach(os => {
                os.textContent = newMinOsCount;
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

    groupedOs[groupOsId].forEach(os => {
        os.MinSelectCount = Number(osMinCount)
    })

    updateLocalStorage()
}

export { createMinCountCell }