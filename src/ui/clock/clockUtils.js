import {
    createSectionTableRows,
    storeSectionTimeTableInJson
} from './sectionClock.js'

import {
    createItemTableRows,
    storeItemTimeTableInJson
} from './itemClock.js'

import{
    availabilityTimes
}from './sectionAvailability.js'


const dayMappingToName = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
};

const invertedDayMapping = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
};

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
    clockCloseIcon.addEventListener('click', () => {clockModalDiv.style.display = 'none';});
    const clockBodyDiv = createAndAppend(clockContentDiv, 'div', 'clock-body');
    const clockFooterDiv = createAndAppend(clockContentDiv, 'div', 'clock-footer');
    clockModalDiv.style.display = 'block';
    
    return {
        clockModalDiv : clockModalDiv,
        clockBodyDiv: clockBodyDiv,
        clockTitle: clockTitle,
        clockFooterDiv : clockFooterDiv
    };
}

function createClockTable(clockBodyDiv, clockFooterDiv, clockSaveBtn, data, id) {
    const clockTable = createAndAppend(clockBodyDiv, 'table', 'clockTable');
    const clockThead = createAndAppend(clockTable, 'thead');
    const clockTbody = createAndAppend(clockTable, 'tbody');
    createTableHeaders(clockThead, ['Day', 'Open', 'Close']);

    if (data.MenuItems) { // checks if 'data' is section or item
        createSectionTableRows(clockTbody, data);
    } else {
        createItemTableRows(clockTbody, data);
    }
    clockSaveBtn.addEventListener('click', () => {
        setupSaveChanges(clockBodyDiv, clockFooterDiv, id, data);
    });
}

function createTableHeaders(parentElement, headers) {
    const headerRow = createAndAppend(parentElement, 'tr');
    headers.forEach(text => {
        const headerCell = createAndAppend(headerRow, 'th', 'clockTableHeader');
        addTextContent(headerCell, text);
    });
}

function createInputCell(parentRow, text) {
    const cell = createAndAppend(parentRow, 'td');
    const timeInput = createAndAppend(cell, 'input');
    timeInput.type = 'time';
    timeInput.value = text;
}

//loops through the table and gets the time table data.
function setupSaveChanges(clockBodyDiv, clockFooterDiv, id, data) {
    // Loop through the rows of the table body
    const tableRows = clockBodyDiv.querySelector('table').querySelector('tbody').rows;
    for (const row of tableRows) {
        const cells = row.cells;
        const dayName = cells[0].innerText;
        const dayOfWeek = invertedDayMapping[dayName]; // get the corresponding number for the day
        const StartTime = cells[1].querySelector('input').value;
        const CloseTime = cells[2].querySelector('input').value;    
        let Period = calculatePeriod(StartTime, CloseTime)
        if (data.MenuItems) {
            storeSectionTimeTableInJson(dayOfWeek, StartTime, CloseTime, Period, id); //for sections
            availabilityTimes(id, clockFooterDiv);
        } else {
            storeItemTimeTableInJson(dayOfWeek, StartTime, CloseTime, Period, id); // for items
        }
    }
}

function calculatePeriod(StartTime, CloseTime) {
    const [startHours, startMinutes] = StartTime.split(':').map(Number);
    const [endHours, endMinutes] = CloseTime.split(':').map(Number);
    // Construct start and end dates - we only use them for time, so the day doesn't matter.
    const startDate = new Date(2020, 0, 1, startHours, startMinutes);
    const endDate = new Date(2020, 0, 1, endHours, endMinutes);
    if (StartTime == CloseTime) {
        return "00:00"
    }
    // Check if end time is on the next day
    if (endDate <= startDate) {
        endDate.setDate(endDate.getDate() + 1);
    }
    // Calculate the difference
    const diffInMs = endDate - startDate;
    const hours = Math.floor(diffInMs / 3600000); // divide by number of milliseconds in an hour
    const minutes = Math.floor((diffInMs % 3600000) / 60000); // divide by number of milliseconds in a minute

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export {
    createAndAppend,
    addTextContent,
    createClockBody,
    createClockTable,
    createInputCell,
    setupSaveChanges,
    calculatePeriod,
    dayMappingToName,
    invertedDayMapping
}