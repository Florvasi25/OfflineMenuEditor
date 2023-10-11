import {
    updateLocalStorage,
    getItemIndex,
    jsonData,
} from '../context.js'

function itemVisibilityButton(itemRow, menuItem, itemNameCell, sectionId) {
    const visibilityButton = document.createElement('button');
    visibilityButton.classList.add('sectionButton')
    visibilityButton.classList.add('visibilityButton')
    visibilityButton.addEventListener('click', () => {
        SectionAvailability(itemRow, sectionId, itemRow.id);
    });
    itemNameCell.appendChild(visibilityButton);
    const visibilityButtonImg = document.createElement('img')
    visibilityButtonImg.classList.add('sectionButtonImg')
    visibilityButtonImg.src = '../../assets/visibilityIcon.svg'
    visibilityButton.appendChild(visibilityButtonImg)

    //Unavailable Sections - Gray
    if (!menuItem.IsAvailable) {
        itemRow.classList.add('unavailable');
        visibilityButton.classList.add('hiddenSection')
    }

    //Changes the color of the Visibility Button according to its availability
    visibilityButton.addEventListener('click', () => {
        if (!menuItem.IsAvailable) {
            visibilityButton.classList.add('hiddenSection')
        } else {
            visibilityButton.classList.remove('hiddenSection')
        }
    })
}

//Section Availability
function SectionAvailability(itemRow, sectionId, itemId) {

    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
    if (itemIndex !== -1) {
        const isAvailableNew = !jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].IsAvailable
        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].IsAvailable = isAvailableNew

        itemRow.classList.toggle('unavailable', !isAvailableNew);

        updateLocalStorage()
    }
}

export { itemVisibilityButton }