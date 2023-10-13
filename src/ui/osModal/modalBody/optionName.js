import { 
    jsonData,
    getOptionIndex,
    updateLocalStorage,
    groupedOs
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
            updateOptionName(menuOption.groupOptionId, menuOs.groupOsId, newOptionName);
            originalName = newOptionName;
            optionName.blur();

            const optionContainerPreviewArray = Array.from(document.getElementsByClassName('optionContainer'));

            const optionContainerPreview = optionContainerPreviewArray.filter((element) => {
              const groupOsId = element.getAttribute('groupOsId');
              return groupOsId === menuOs.groupOsId;
            });
            
            if (optionContainerPreview) {
                optionContainerPreview.forEach((optionNamePreview) => {
                    const optionNamePreviewArray = Array.from(optionNamePreview.getElementsByClassName('optionNamePreview'));
                    
                    optionNamePreviewArray.forEach(optionPreview => {
                        if (optionPreview.id === menuOption.groupOptionId) {
                            optionPreview.textContent = newOptionName;
                        }
                    });
                });
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
function updateOptionName(groupOptionId, groupOsId, newOptionName) {
    groupedOs[groupOsId].forEach(os => {
        const option = os.MenuItemOptionSetItems.find(option => option.groupOptionId == groupOptionId)
        option.Name = newOptionName
    })

    updateLocalStorage()
}

export { createOptionNameCell }