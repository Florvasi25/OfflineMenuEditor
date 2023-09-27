import { 
    jsonData,
    getOsIndex,
    updateSectionLocalStorage 
} from '../../context.js'

function createOsNameCell(menuOs, itemId, sectionId) {
    //Name Cell
    const osNameCell = document.createElement('div');
    osNameCell.classList.add('osNameCell');

    const osNameHeader = createOsName(menuOs, itemId, sectionId)
    osNameCell.appendChild(osNameHeader);
    
    return osNameCell
}

//Handles Name Edits
function createOsName(menuOs, itemId, sectionId) {
    const osName = document.createElement('p');
    osName.classList.add('osName');
    osName.contentEditable = true;
    osName.textContent = menuOs.Name;

    let originalName = menuOs.Name;

    osName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newOsName = osName.textContent;
            updateName(menuOs.MenuItemOptionSetId, itemId, sectionId, newOsName);
            originalName = newOsName;
            osName.blur();
            const osNameHeaderArray = Array.from(document.getElementsByClassName('osNameHeader')); 
            const osNameHeader = osNameHeaderArray.find((p) => p.id == menuOs.MenuItemOptionSetId)
            osNameHeader.textContent = newOsName;
        } else if (e.key === 'Escape') {
            osName.textContent = originalName;
            osName.blur();
        }
    });

    osName.addEventListener('blur', () => {
        osName.textContent = originalName;
        osName.classList.remove('sectionClicked')
    });

    osName.addEventListener('click', () => {
        osName.classList.add('sectionClicked')
    })

    return osName
}

//Updates Name
function updateName(osHeaderId, itemId, sectionId, osName) {
    const {itemIndex, sectionIndex, osIndex} = getOsIndex(sectionId, itemId, osHeaderId)
    jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].Name = osName;

    updateSectionLocalStorage()
}

export { createOsNameCell }