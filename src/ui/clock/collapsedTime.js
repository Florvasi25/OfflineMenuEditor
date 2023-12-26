import {
    createAndAppend,  
    addTextContent
}  from '../helpers.js';

import {
    jsonData, 
    getRandomInt, 
    updateLocalStorage,
} from '../context.js'

function createDropDownMenu(clockHeaderDiv) {
    const dropdown = createAndAppend(clockHeaderDiv, 'div', 'dropdownmenucollapsed');
    const button = createAndAppend(dropdown, 'button', 'buttondropdownmenucollapsed');
    addTextContent(button, 'Select Mode ↓');
    const content = createAndAppend(dropdown, 'div', 'dropdownmenu-content');

    button.onclick = function(event) {
        event.stopPropagation();
        content.classList.toggle('showdropdownmenu');
    };

    const options = [
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

        const label = createAndAppend(optionContainer, 'label', 'radio-option-label');
        label.setAttribute('for', optionId);
        label.textContent = optionText; 

        radio.addEventListener('click', function() {
            console.log(label.textContent);
            setTimeout(function() {
                content.classList.remove('showdropdownmenu');
            }, 500);
        });
    });


    document.addEventListener('click', function(event) {
        const isClickInside = dropdown.contains(event.target);
        if (!isClickInside) {
            content.classList.remove('showdropdownmenu');
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            content.classList.remove('showdropdownmenu');
        }
    });
}

export{
    createDropDownMenu
}