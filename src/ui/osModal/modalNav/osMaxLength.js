import { updateMaxCount } from './osMaxCount.js'

import { groupedOs } from '../../context.js'

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

    if (groupedOs[menuOs.groupOsId]) {
        const optionSetIds = groupedOs[menuOs.groupOsId].map(os => os.MenuItemOptionSetId.toString());
        const maxSelectCountArray = Array.from(document.getElementsByClassName('maxSelectCount'));
        const maxSelectCount = maxSelectCountArray.filter(p => optionSetIds.includes(p.id));
        maxSelectCount.forEach(os => {
            os.textContent = optionsLength
        })
    }

    updateMaxCount(menuOs, optionsLength);
}


export { createMaxLenghtButton }