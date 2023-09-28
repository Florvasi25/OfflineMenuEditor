// import {
//     updateMaxCount
// } from './osMaxCount'

function createMaxLenghtButton(selectOptionContainer) {
    const maxLengthButton = document.createElement('button');
    maxLengthButton.classList.add('sectionButton')
    maxLengthButton.classList.add('maxLengthButton')
    
    selectOptionContainer.appendChild(maxLengthButton);
    
    const maxLengthButtonImg = document.createElement('img')
    maxLengthButtonImg.classList.add('sectionButtonImg')
    maxLengthButtonImg.src = '../../assets/upArrowIcon.svg'
    
    maxLengthButton.appendChild(maxLengthButtonImg)

}

export { createMaxLenghtButton }