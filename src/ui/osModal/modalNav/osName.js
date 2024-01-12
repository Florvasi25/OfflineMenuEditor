import {
    updateLocalStorage,
    groupedOs,
    itemlessOs,
    groupOptionSets,
    updateItemlessLocalStorage
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

            updateName(menuOs, newOsName);

            if (groupedOs[menuOs.groupOsId]) {
                const optionSetIds = groupedOs[menuOs.groupOsId].map(os => os.MenuItemOptionSetId.toString());
                const osNameHeaderArray = Array.from(document.getElementsByClassName('osNameHeader'));
                const osNameHeader = osNameHeaderArray.filter(p => optionSetIds.includes(p.id));
                osNameHeader.forEach(os => {
                    os.textContent = newOsName;
                })
                if (newOsName == null || newOsName == '') {
                    osNameHeader.forEach(os => {
                        os.textContent = 'Empty';
                    })                
                } else {
                    osNameHeader.forEach(os => {
                        os.textContent = newOsName;
                    })                
                }
            }
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
function updateName(menuOs, osName) {
    if (groupedOs[menuOs.groupOsId]) {
        groupedOs[menuOs.groupOsId].forEach(os => {
            os.Name = osName
        })
        // groupOptionSets()
        updateLocalStorage()
    } else if (itemlessOs.includes(menuOs)){
        menuOs.Name = osName;
        updateItemlessLocalStorage();
    }
}



export { createOsNameCell }