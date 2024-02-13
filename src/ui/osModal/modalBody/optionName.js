import {
    updateLocalStorage,
    groupedOs,
    groupOptionSets,
    itemlessOs,
    updateItemlessLocalStorage
} from '../../context.js'

function createOptionNameCell(menuOption, menuOs) {
    //Name Cell
    const optionNameCell = document.createElement('div');
    optionNameCell.classList.add('optionNameCell');

    const optionName = createOptionName(menuOption, menuOs)
    optionNameCell.appendChild(optionName);

    return optionNameCell
}

import { slotManagerInstance } from  "../../mainContainer.js";

//Handles Name Edits
function createOptionName(menuOption, menuOs) {
    const optionName = document.createElement('p');
    optionName.classList.add('optionName');
    optionName.contentEditable = true;
    if(menuOption.Name == '' || menuOption.Name == null){
        menuOption.Name = 'Empty';
        optionName.textContent = 'Empty';
    }else{
        optionName.textContent = menuOption.Name;
    }

    let originalName = menuOption.Name;

    optionName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newOptionName = optionName.textContent;
            originalName = newOptionName;
            optionName.blur();

            const indexOfOption = menuOs.MenuItemOptionSetItems.findIndex(
                option => option.MenuItemOptionSetItemId == menuOption.MenuItemOptionSetItemId
            )

            updateOptionName(indexOfOption, menuOs, newOptionName);

            if (groupedOs[menuOs.groupOsId]) {
                const optionsIds = groupedOs[menuOs.groupOsId].map(
                    os => os.MenuItemOptionSetItems[indexOfOption].MenuItemOptionSetItemId.toString()
                );
                const optionNamePreviewArray = Array.from(document.getElementsByClassName('optionNamePreview'));
                const optionNamePreview = optionNamePreviewArray.filter(p => optionsIds.includes(p.id));
                optionNamePreview.forEach(os => {
                    os.textContent = menuOption.Name
                })
            }
        } else if (e.key === 'Escape') {
            optionName.blur();
        }
    });

    optionName.addEventListener('blur', () => {
        optionName.textContent = originalName;
        optionName.classList.remove('sectionClicked')
    });

    optionName.addEventListener('click', () => {
        optionName.classList.add('sectionClicked')
    })

    return optionName
}

//Updates Name
function updateOptionName(indexOfOption, menuOs, newOptionName) {

    if (groupedOs[menuOs.groupOsId]) {
        groupedOs[menuOs.groupOsId].forEach(os =>
            os.MenuItemOptionSetItems[indexOfOption].Name = newOptionName
        );

        groupOptionSets()
        updateLocalStorage(slotManagerInstance.currentSlot);
    } else if (itemlessOs.includes(menuOs)){
        const option = menuOs.MenuItemOptionSetItems[indexOfOption]
        option.Name = newOptionName
        updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
    }
}

export { createOptionNameCell }