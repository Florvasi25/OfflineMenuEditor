import { 
    jsonData,
    getOsIndex, 
} from '../context.js'

function createOptionsContainer(osRowOption, sectionId, itemId, osId) {
    const optionContainer = document.createElement('div');
    optionContainer.classList.add('optionContainer');
    osRowOption.parentNode.insertBefore(optionContainer, osRowOption.nextSibling);
    createOptionRows(optionContainer, sectionId, itemId, osId);    
}

function createOptionRows(optionContainer, sectionId, itemId, osId) {
    const {itemIndex, sectionIndex, osIndex} = getOsIndex(sectionId, itemId, osId)
    const menuOptions = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems;
    
    menuOptions.forEach(menuOption => {
        const osRowOption = createOsHeader(menuOption)
        optionContainer.appendChild(osRowOption);
    });
}


function createOsHeader(menuOption) {
    const osRowOption = document.createElement('div');
    osRowOption.classList.add('osRowOption');
    osRowOption.classList.add('draggable');
    osRowOption.classList.add('folded')
    osRowOption.id = menuOption.MenuItemOptionSetId
    osRowOption.textContent = menuOption.Name

    // const dropAndName = document.createElement('div')
    // dropAndName.className = 'dropAndName'
    // osRowOption.appendChild(dropAndName)

    // const osDropDown = createOsDropdown(osRowOption)
    // dropAndName.appendChild(osDropDown)

    // const osNameHeader = createOsNameHeader(menuOption)
    // dropAndName.appendChild(osNameHeader)

    // const osSelectOptionContainer = createOsSelectOption(menuOption)
    // osRowOption.appendChild(osSelectOptionContainer)

    return osRowOption
}

// function createOsNameHeader(menuOption) {
//     const osNameHeader = document.createElement('p')
//     osNameHeader.className = 'osNameHeader'
//     osNameHeader.textContent = menuOption.Name    

//     return osNameHeader
// }

// function createOsSelectOption(menuOption) {
//     const osSelectOptionContainer = document.createElement('div')
//     osSelectOptionContainer.className = 'osSelectOptionContainer'
//     osSelectOptionContainer.innerHTML = `${menuOption.MinSelectCount} - ${menuOption.MaxSelectCount}`

//     return osSelectOptionContainer
// }

export {
    createOptionsContainer,
}