function osCaseButton(osBtnsCell) {
    const caseButton = document.createElement('button');
    caseButton.classList.add('sectionButton')
    caseButton.classList.add('newOsButton')
    osBtnsCell.appendChild(caseButton);
    const caseButtonImg = document.createElement('img')
    caseButtonImg.classList.add('sectionButtonImg')
    caseButtonImg.src = '../../assets/caseIcon.svg'
    caseButton.appendChild(caseButtonImg)
}

export { osCaseButton }