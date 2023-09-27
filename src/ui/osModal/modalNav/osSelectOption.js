import { 
    jsonData,
    getOsIndex,
    updateSectionLocalStorage 
} from '../../context.js'

function createSelectOptionContainer(menuOs, itemId, sectionId) {
    const selectOptionContainer = document.createElement('div')
    selectOptionContainer.className = 'selectOptionContainer'

    const selectOptionCell = createSelectOptionCell(menuOs, itemId, sectionId)
    selectOptionContainer.appendChild(selectOptionCell)

    createMaxLenghtButton(selectOptionContainer)

    return selectOptionContainer
}

function createSelectOptionCell(menuOs, itemId, sectionId) {
    const selectOptionCell = document.createElement('div')
    selectOptionCell.className = 'selectOptionCell'

    const selectOption = createSelectOption(menuOs, itemId, sectionId)
    selectOptionCell.appendChild(selectOption)

    return selectOptionCell
}

function createSelectOption(menuOs, itemId, sectionId) {
    const selectOption = document.createElement('div')
    selectOption.className = 'selectOption'

    const minCountCell = createMinCountCell(menuOs, itemId, sectionId)
    selectOption.appendChild(minCountCell)

    const dashCountCell = document.createElement('p')
    dashCountCell.className = 'dashCountCell'
    dashCountCell.textContent= '-'
    selectOption.appendChild(dashCountCell)
    
    const maxCountCell = createMaxCountCell(menuOs, itemId, sectionId)
    selectOption.appendChild(maxCountCell)

    return selectOption
}

//////////////////////

function createMinCountCell(menuOs, itemId, sectionId) {
    //Name Cell
    const minCountCell = document.createElement('div');
    minCountCell.classList.add('minCountCell');

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
            console.log(minCountArray);
            const minSelectCount = minCountArray.find((p) => p.id == menuOs.MenuItemOptionSetId)
            console.log(minSelectCount);
            minSelectCount.textContent = newMinOsCount;
            console.log(minSelectCount.textContent);
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

    updateSectionLocalStorage()
}

function createMaxCountCell(menuOs, itemId, sectionId) {
    //Name Cell
    const maxCountCell = document.createElement('div');
    maxCountCell.classList.add('maxCountCell');

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
            updateMaxCount(menuOs.MenuItemOptionSetId, itemId, sectionId, newMaxOsCount);
            originalName = newMaxOsCount;
            maxCount.blur();
            const maxCountArray = Array.from(document.getElementsByClassName('maxSelectCount'));
            console.log(maxCountArray);
            const maxSelectCount = maxCountArray.find((p) => p.id == menuOs.MenuItemOptionSetId)
            console.log(maxSelectCount);
            maxSelectCount.textContent = newMaxOsCount;
            console.log(maxSelectCount.textContent);
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
function updateMaxCount(osHeaderId, itemId, sectionId, osMaxCount) {
    const {itemIndex, sectionIndex, osIndex} = getOsIndex(sectionId, itemId, osHeaderId)
    jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MaxSelectCount = Number(osMaxCount);

    updateSectionLocalStorage()
}

///////////////////////


function createMaxLenghtButton(selectOptionContainer) {
    const maxLengthButton = document.createElement('button');
    maxLengthButton.classList.add('sectionButton')
    maxLengthButton.classList.add('maxLengthButton')
    selectOptionContainer.appendChild(maxLengthButton);
    const maxLengthButtonImg = document.createElement('img')
    maxLengthButtonImg.classList.add('sectionButtonImg')
    maxLengthButtonImg.src = '../../assets/upArrowIcon.svg'
    maxLengthButton.appendChild(maxLengthButtonImg)
}


export { createSelectOptionContainer }