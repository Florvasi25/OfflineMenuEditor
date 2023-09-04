// import {
//     jsonData,
//     getSectionIndex,
//     updateCounterLocalStorage,
//     updateSectionLocalStorage,
// } from './context.js';

function itemClockButton(itemButtonsCell) {
    const clockButton = document.createElement('button');
    clockButton.classList.add('sectionButton')
    clockButton.classList.add('clockButton')
    itemButtonsCell.appendChild(clockButton);
    const clockButtonImg = document.createElement('img')
    clockButtonImg.classList.add('sectionButtonImg')
    clockButtonImg.src = '../../assets/clockIcon.svg'
    clockButton.appendChild(clockButtonImg)

}

export {
    itemClockButton,
}