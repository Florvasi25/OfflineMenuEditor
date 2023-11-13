import { 
    updateLocalStorage,
    groupedOs,
    itemlessOs,
    groupOptionSets,
    updateItemlessOsKey,
    updateOsDomIds
} from '../../context.js'

function createOsNameCell(menuOs) {
    //Name Cell
    const osNameCell = document.createElement('div');
    osNameCell.classList.add('osNameCell');

    const osNameHeader = createOsName(menuOs)
    osNameCell.appendChild(osNameHeader);
    
    return osNameCell
}

//Handles Name Edits
function createOsName(menuOs) {
    const osName = document.createElement('p');
    osName.classList.add('osName');
    osName.contentEditable = true;
    osName.textContent = menuOs.Name;

    let originalName = menuOs.Name;

    osName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newOsName = osName.textContent;
            originalName = newOsName;
            osName.blur();
            const oldGroupOsId = menuOs.groupOsId
            updateName(oldGroupOsId, newOsName);
            // updateOsDomIds(menuOs, oldGroupOsId)
            const optionSetIds = groupedOs[menuOs.groupOsId].map(os => os.MenuItemOptionSetId.toString());
            const osNameHeaderArray = Array.from(document.getElementsByClassName('osNameHeader'));
            const osNameHeader = osNameHeaderArray.filter(p => optionSetIds.includes(p.id));
            osNameHeader.forEach(os => {
                os.textContent = menuOs.Name;
            })
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
function updateName(groupOsId, osName) {
    if (groupedOs[groupOsId]) {
        groupedOs[groupOsId].forEach(os => {
            os.Name = osName
        })
        groupOptionSets()
        updateLocalStorage()
    } else if (itemlessOs[groupOsId]) {
        itemlessOs[groupOsId].Name = osName
        updateItemlessOsKey(groupOsId)
    }
}



export { createOsNameCell }