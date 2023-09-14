// import {
//     jsonData,
//     getSectionIndex,
//     updateCounterLocalStorage,
//     updateSectionLocalStorage,
// } from './context.js';

function createElementWithClasses(tagName, ...classes) {
    const element = document.createElement(tagName);
    element.classList.add(...classes);
    return element;
}

function createAndAppend(parent, tagName, ...classes) {
    const element = createElementWithClasses(tagName, ...classes);
    parent.appendChild(element);
    return element;
}

function addTextContent(element, text) {
    element.textContent = text;
}


function sectionClockButton(sectionButtonsCell) {
    const clockButton = createAndAppend(sectionButtonsCell, 'button', 'sectionButton', 'clockButton');
    const clockButtonImg = createAndAppend(clockButton, 'img', 'sectionButtonImg');
    clockButtonImg.src = '../../assets/clockIcon.svg';

    clockButton.addEventListener('click', () => {
        const clockBodyDiv = createClockBody();
        const clockSaveBtn = clockBodyDiv.parentElement.querySelector('.clockBtn-save');
        createClockTable(clockBodyDiv, clockSaveBtn);
    });
}

function createClockBody() {
    const clockModalDiv = createAndAppend(document.body, 'div', 'clockModal');
    clockModalDiv.id = 'clockModalID';

    const clockDialogDiv = createAndAppend(clockModalDiv, 'div', 'clock-dialog');
    const clockContentDiv = createAndAppend(clockDialogDiv, 'div', 'clock-content');
    
    const clockHeaderDiv = createAndAppend(clockContentDiv, 'div', 'clock-header');
    const clockTitle = createAndAppend(clockHeaderDiv, 'h5', 'clock-title');
    addTextContent(clockTitle, 'Menu Section Hours');

    const clockCloseIcon = createAndAppend(clockHeaderDiv, 'span', 'clockBtn-close');
    clockCloseIcon.innerHTML = '&times;';
    clockCloseIcon.addEventListener('click', () => {
        clockModalDiv.style.display = 'none';
    });

    const clockBodyDiv = createAndAppend(clockContentDiv, 'div', 'clock-body');

    const clockFooterDiv = createAndAppend(clockContentDiv, 'div', 'clock-footer');
    const clockSaveBtn = createAndAppend(clockFooterDiv, 'button', 'clockBtn', 'clockBtn-save');
    addTextContent(clockSaveBtn, 'Save Changes');

    clockModalDiv.style.display = 'block';
    return clockBodyDiv;
}

function createClockTable(clockBodyDiv, clockSaveBtn) {
    const clockTable = createAndAppend(clockBodyDiv, 'table', 'clockTable');
    const clockThead = createAndAppend(clockTable, 'thead');
    const clockTbody = createAndAppend(clockTable, 'tbody');

    const clockHeaders = ['Day', 'Open', 'Close'];
    const clockHeaderRow = createAndAppend(clockThead, 'tr');

    clockHeaders.forEach(text => {
        const clockTh = createAndAppend(clockHeaderRow, 'th', 'clockTableHeader');
        addTextContent(clockTh, text);
    });

    const clockDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    clockDays.forEach(day => {
        const clockRow = createAndAppend(clockTbody, 'tr');
        
        [day, '01:00', '00:00'].forEach((text, index) => {
            const clockTd = createAndAppend(clockRow, 'td');
            addTextContent(clockTd, text);

            if (index != 0) {
                clockTd.contentEditable = true;

                // Ensure the content does not exceed 5 characters
                clockTd.addEventListener('input', function(evt) {
                    if (clockTd.textContent.length > 5) {
                        clockTd.textContent = clockTd.textContent.substring(0, 5);
                    }
                });

                // Function to validate the time
                function validateTime() {
                    const parts = clockTd.textContent.split(':');
                    if (
                        parts.length !== 2 || // Ensure there's only one colon
                        parts[0].length !== 2 || // Ensure hours have two digits
                        parts[1].length !== 2 || // Ensure minutes have two digits
                        isNaN(parts[0]) || // Ensure hours are a number
                        isNaN(parts[1]) || // Ensure minutes are a number
                        parseInt(parts[0]) < 0 || // Ensure hours are not negative
                        parseInt(parts[1]) < 0 || // Ensure minutes are not negative
                        parseInt(parts[0]) > 23 || // Ensure hours are 0-23
                        parseInt(parts[1]) > 59 // Ensure minutes are 0-59
                    ) {
                        clockTd.textContent = '00:00';
                    }
                }

                // Validate the time when focus is lost
                clockTd.addEventListener('blur', validateTime);

                // Validate the time when "Enter" is pressed
                clockTd.addEventListener('keydown', function(evt) {
                    if (evt.key === 'Enter') {
                        evt.preventDefault(); // prevent new line when pressing enter
                        validateTime();
                    }
                });
            }
        });
    });

    clockSaveBtn.addEventListener('click', () => {

        const timeTable = [];
    
        // Loop through the rows of the table body
        const tableRows = clockBodyDiv.querySelector('table').querySelector('tbody').rows;
        for (const row of tableRows) {
            const cells = row.cells;
    
            const day = cells[0].innerText;
            const openTime = cells[1].innerText;
            const closeTime = cells[2].innerText;
    
            // Store the data in an object and push it to the timeTable array
            timeTable.push({
                day,
                openTime,
                closeTime,
            });
        }
    
        // Store the updated timetable in localStorage
        localStorage.setItem('timeTable', JSON.stringify(timeTable));
    });

}




export {
    sectionClockButton,
} 
