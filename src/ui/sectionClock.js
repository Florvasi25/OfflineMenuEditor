// import {
//     jsonData,
//     getSectionIndex,
//     updateCounterLocalStorage,
//     updateSectionLocalStorage,
// } from './context.js';

function sectionClockButton(sectionButtonsCell) {
    const clockButton = document.createElement('button');
    clockButton.classList.add('sectionButton')
    clockButton.classList.add('clockButton')
    sectionButtonsCell.appendChild(clockButton);
    const clockButtonImg = document.createElement('img')
    clockButtonImg.classList.add('sectionButtonImg')
    clockButtonImg.src = '../../assets/clockIcon.svg'
    clockButton.appendChild(clockButtonImg)

}

export {
    sectionClockButton,
}