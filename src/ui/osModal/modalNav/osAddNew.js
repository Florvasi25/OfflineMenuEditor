function osNewButton(osBtnsCell) {
    const newOsButton = document.createElement('button');
    newOsButton.classList.add('sectionButton')
    newOsButton.classList.add('newOsButton')
    osBtnsCell.appendChild(newOsButton);
    const newOsButtonImg = document.createElement('img')
    newOsButtonImg.classList.add('sectionButtonImg')
    newOsButtonImg.src = '../../assets/plusIcon.svg'
    newOsButton.appendChild(newOsButtonImg)
}

export { osNewButton }