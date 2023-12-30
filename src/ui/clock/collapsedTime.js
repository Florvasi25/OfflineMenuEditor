import {
    createAndAppend,  
    addTextContent
}  from '../helpers.js';

import {
    jsonData, 
    getRandomInt, 
    updateLocalStorage,
} from '../context.js'

import {
    disableSectionAvailabilityBtn,
    enableSectionAvailabilityBtn,
    unlockAvailabilityBtn,
    blockAvailabilityBtn
} from './sectionAvailability.js'

function createDropDownMenu(clockHeaderDiv, sectionIndex) {
    let selectedOptionIndex = jsonData.MenuSections[sectionIndex].MenuSectionAvailability.AvailabilityMode;
    const dropdown = createAndAppend(clockHeaderDiv, 'div', 'dropdownmenucollapsed');
    const button = createAndAppend(dropdown, 'button', 'buttondropdownmenucollapsed');
    addTextContent(button, 'Select Mode ↓');
    const content = createAndAppend(dropdown, 'div', 'dropdownmenu-content');

    button.onclick = function(event) {
        event.stopPropagation();
        content.classList.toggle('showdropdownmenu');
    };

    const options = [
        'Display Always',
        'DisplayBasedOnTimes',
        'DisplayAlwaysStartCollapsed',
        'DisplayAlwaysStartCollapsedBasedOnTimes'
    ];

    options.forEach(function(optionText, index) {
        const optionId = `option-${index}`; 
        const optionContainer = createAndAppend(content, 'div', 'radio-option-container');
        const radio = createAndAppend(optionContainer, 'input', 'radio-button');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('id', optionId);
        radio.setAttribute('name', 'mode');
        radio.setAttribute('value', optionText);

        if(index == selectedOptionIndex) { radio.checked = true;}

        const label = createAndAppend(optionContainer, 'label', 'radio-option-label');
        label.setAttribute('for', optionId);
        label.textContent = optionText; 

        radio.addEventListener('click', function() {
            console.log(label.textContent);
            setAvailabilityMode(sectionIndex, index);
        });
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            content.classList.remove('showdropdownmenu');
        }
    });
}

function setAvailabilityMode(sectionIndex, index){
    jsonData.MenuSections[sectionIndex].MenuSectionAvailability.AvailabilityMode = index;
    if(index == 2 || index == 0){ 
        blockTimeTable();
        disableSectionAvailabilityBtn();
        blockAvailabilityBtn();
    }else{
        unlockTimeTable();
        enableSectionAvailabilityBtn();
        unlockAvailabilityBtn();
    }
}

function getAvailabilityMode(sectionIndex){
    return jsonData.MenuSections[sectionIndex].MenuSectionAvailability.AvailabilityMode;
}

function blockTimeTable(){
    const timeInputs = getTimeInputs();
    timeInputs.forEach(function(input) {
        input.disabled = true; 
    });
}

function unlockTimeTable(){
    const timeInputs = getTimeInputs();
    timeInputs.forEach(function(input) {
        input.disabled = false; 
    });
}

function getTimeInputs(){
    return document.querySelectorAll('input[type="time"]');
}


export{
    createDropDownMenu,
    getAvailabilityMode,
    setAvailabilityMode,
    blockTimeTable,
    unlockTimeTable
}