import {
    updateMaxCount
} from './osMaxCount.js'

function createMaxLenghtButton(selectOptionContainer, menuOs, itemId, sectionId) {
    const maxLengthButton = document.createElement('button');
    maxLengthButton.classList.add('sectionButton')
    maxLengthButton.classList.add('maxLengthButton')
    
    selectOptionContainer.appendChild(maxLengthButton);
    
    const maxLengthButtonImg = document.createElement('img')
    maxLengthButtonImg.classList.add('sectionButtonImg')
    maxLengthButtonImg.src = '../../assets/upArrowIcon.svg'
    
    maxLengthButton.appendChild(maxLengthButtonImg)

    maxLengthButton.addEventListener('click', () => {
        maxLength(menuOs, itemId, sectionId)
    })
}

function maxLength(menuOs, itemId, sectionId) {
    const optionsArray = Array.from(document.getElementsByClassName('optionRow'));
    const optionsLength = optionsArray.length;

    const maxCount = document.querySelector('.maxCount');
    if (maxCount) {
        maxCount.textContent = optionsLength;
    }

    const maxCountArray = Array.from(document.getElementsByClassName('maxSelectCount'));
    const maxSelectCount = maxCountArray.find((p) => p.id == menuOs.MenuItemOptionSetId)
    maxSelectCount.textContent = optionsLength;

    updateMaxCount(menuOs.MenuItemOptionSetId, itemId, sectionId, optionsLength);
}


export { createMaxLenghtButton }