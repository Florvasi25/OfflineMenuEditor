import { updateMaxCount } from './osMaxCount.js'

import { updateOsDomIds } from '../../context.js'

function createMaxLenghtButton(selectOptionContainer, menuOs) {
    const maxLengthButton = document.createElement('button');
    maxLengthButton.classList.add('sectionButton')
    maxLengthButton.classList.add('maxLengthButton')
    
    selectOptionContainer.appendChild(maxLengthButton);
    
    const maxLengthButtonImg = document.createElement('img')
    maxLengthButtonImg.classList.add('sectionButtonImg')
    maxLengthButtonImg.src = '../../assets/upArrowIcon.svg'
    
    maxLengthButton.appendChild(maxLengthButtonImg)

    maxLengthButton.addEventListener('click', () => {
        maxLength(menuOs)
    })
}

function maxLength(menuOs) {
    const optionsArray = Array.from(document.getElementsByClassName('optionRow'));
    const optionsLength = optionsArray.length;

    const maxCount = document.querySelector('.maxCount');
    if (maxCount) {
        maxCount.textContent = optionsLength;
    }

    const oldGroupOsId = menuOs.groupOsId
    updateMaxCount(menuOs.groupOsId, optionsLength);
    updateOsDomIds(menuOs, oldGroupOsId)
}


export { createMaxLenghtButton }