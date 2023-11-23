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

import {
    createAndAppend,  
    addTextContent
}  from '../helpers.js';

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

function createClockBody() {
    const clockModalDiv = createAndAppend(document.body, 'div', 'clockModal');
    clockModalDiv.id = 'clockModalID';
    const clockDialogDiv = createAndAppend(clockModalDiv, 'div', 'clock-dialog');
    const clockContentDiv = createAndAppend(clockDialogDiv, 'div', 'clock-content');
    const clockHeaderDiv = createAndAppend(clockContentDiv, 'div', 'clock-header');
    const clockTitle = createAndAppend(clockHeaderDiv, 'h5', 'clock-title');
    addTextContent(clockTitle, 'Menu Section Hours');
    const clockCloseIcon = createAndAppend(clockHeaderDiv, 'div', 'clockBtn-close');
    clockCloseIcon.innerHTML = 'X';
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

function createClockTable(clockModalDiv, clockBodyDiv, clockFooterDiv, clockSaveBtn, data, id) {
    const clockTable = createAndAppend(clockBodyDiv, 'table', 'clockTable');
    const clockThead = createAndAppend(clockTable, 'thead');
    const clockTbody = createAndAppend(clockTable, 'tbody');
    clockTbody.className = 'clockTBody';
    createTableHeaders(clockThead, ['Day', 'Open', 'Close']);
    const tableRows = clockBodyDiv.querySelector('table').querySelector('tbody').rows;

    if (data.MenuItems) { // checks if 'data' is section or item
        createSectionTableRows(clockTbody, data);
        if (data.MenuItems[0]) {clockSaveBtn.classList.add('clockBtn-save');} 
        else { clockSaveBtn.classList.add('clockBtn-save-disabled');
    }
    } else { createItemTableRows(clockTbody, data); }
    
    clockSaveBtn.addEventListener('click', () => { 
        if (!allTimesAreDefault(tableRows)) { 
            setupSaveChanges(clockBodyDiv, clockFooterDiv, id, data);
            clockModalDiv.style.display = 'none';
        }
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
    timeInput.className = 'timeInput';
    timeInput.value = text;
}

// Function to check if all times are the default values in the entire table
function allTimesAreDefault(tableRows) {
    let allDefaults = true;
    for (const row of tableRows) {
        const StartTime = row.cells[1].querySelector('input').value;
        const CloseTime = row.cells[2].querySelector('input').value;
        if (StartTime !== '01:00' || CloseTime !== '00:00') {
            allDefaults = false;
            break;
        }
    }
    return allDefaults;
}

// Function to process and save changes based on the time table
function processSaveChanges(tableRows, data, id, clockFooterDiv) {
    for (const row of tableRows) {
        const cells = row.cells;
        const dayName = cells[0].innerText;
        const dayOfWeek = invertedDayMapping[dayName];
        const StartTime = cells[1].querySelector('input').value;
        const CloseTime = cells[2].querySelector('input').value;
        const Period = calculatePeriod(StartTime, CloseTime);

        if (data.MenuItems) {
            storeSectionTimeTableInJson(dayOfWeek, StartTime, CloseTime, Period, id);
            availabilityTimes(id, clockFooterDiv);
        } else {
            storeItemTimeTableInJson(dayOfWeek, StartTime, CloseTime, Period, id);
        }
    }
}

// Original function refactored to use the separate concerns
function setupSaveChanges(clockBodyDiv, clockFooterDiv, id, data) {
    const tableRows = clockBodyDiv.querySelector('table').querySelector('tbody').rows;
    processSaveChanges(tableRows, data, id, clockFooterDiv);
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
    processSaveChanges,
    calculatePeriod,
    dayMappingToName,
    invertedDayMapping
}