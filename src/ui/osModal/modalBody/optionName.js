import {
    updateLocalStorage,
    groupedOs,
    groupOptionSets,
    itemlessOs,
    updateItemlessOsKey,
    updateOptionDomIds,
    updateOsDomIds
} from '../../context.js'

function createOptionNameCell(menuOption, menuOs) {
    //Name Cell
    const optionNameCell = document.createElement('div');
    optionNameCell.classList.add('optionNameCell');

    const optionName = createOptionName(menuOption, menuOs)
    optionNameCell.appendChild(optionName);

    return optionNameCell
}

//Handles Name Edits
function createOptionName(menuOption, menuOs) {
    const optionName = document.createElement('p');
    optionName.classList.add('optionName');
    optionName.contentEditable = true;
    optionName.textContent = menuOption.Name;

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

            updateOptionName(indexOfOption, menuOs.groupOsId, newOptionName);

            const optionsIds = groupedOs[menuOs.groupOsId].map(
                os => os.MenuItemOptionSetItems[indexOfOption].MenuItemOptionSetItemId.toString()
            );
            const optionNamePreviewArray = Array.from(document.getElementsByClassName('optionNamePreview'));
            const optionNamePreview = optionNamePreviewArray.filter(p => optionsIds.includes(p.id));
            optionNamePreview.forEach(os => {
                os.textContent = menuOption.Name
            })
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
function updateOptionName(indexOfOption, groupOsId, newOptionName) {

    if (groupedOs[groupOsId]) {
        groupedOs[groupOsId].forEach(os =>
            os.MenuItemOptionSetItems[indexOfOption].Name = newOptionName
        );

        groupOptionSets()
        updateLocalStorage()
    } else if (itemlessOs[groupOsId]) {
        const option = itemlessOs[groupOsId].MenuItemOptionSetItems[indexOfOption]
        option.Name = newOptionName
        updateItemlessOsKey(groupOsId)
    }
}

export { createOptionNameCell }