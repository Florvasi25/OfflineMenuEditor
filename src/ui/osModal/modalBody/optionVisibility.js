import {
    updateLocalStorage,
    getOptionIndex,
    jsonData,
} from '../../context.js'

function optionVisibilityButton(optionButtonsCell, optionRow, menuOption, sectionId, itemId, osId) {
    const visibilityButton = document.createElement('button');
    visibilityButton.classList.add('sectionButton')
    visibilityButton.classList.add('visibilityButton')
    visibilityButton.addEventListener('click', () => {
        SectionAvailability(optionRow, sectionId, itemId, osId, optionRow.id);
    });
    optionButtonsCell.appendChild(visibilityButton);
    const visibilityButtonImg = document.createElement('img')
    visibilityButtonImg.classList.add('sectionButtonImg')
    visibilityButtonImg.src = '../../assets/visibilityIcon.svg'
    visibilityButton.appendChild(visibilityButtonImg)

    //Unavailable Sections - Gray
    if (!menuOption.IsAvailable) {
        optionRow.classList.add('unavailable');
        visibilityButton.classList.add('hiddenSection')
    }

    //Changes the color of the Visibility Button according to its availability
    visibilityButton.addEventListener('click', () => {
        if (!menuOption.IsAvailable) {
            visibilityButton.classList.add('hiddenSection')
        } else {
            visibilityButton.classList.remove('hiddenSection')
        }
    })
}

//Section Availability
function SectionAvailability(optionRow, sectionId, itemId, osId, optionId) {

    const {sectionIndex, itemIndex, osIndex, optionIndex} = getOptionIndex(sectionId, itemId, osId, optionId);
    if (itemIndex !== -1) {
        const isAvailableNew = !jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems[optionIndex].IsAvailable
        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems[optionIndex].IsAvailable = isAvailableNew

        optionRow.classList.toggle('unavailable', !isAvailableNew);

        const osRowOptionPreviewArray = Array.from(document.getElementsByClassName('osRowOption'));
        const osRowOptionPreview = osRowOptionPreviewArray.find((p) => p.id == optionId)
        if (osRowOptionPreview) {
            osRowOptionPreview.classList.toggle('unavailable', !isAvailableNew)
        }

        updateLocalStorage()
    }
}

export { optionVisibilityButton }