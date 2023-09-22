import {
    jsonData, 
    getRandomInt, 
    updateSectionLocalStorage
} from '../context.js'

const dayMapping = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 0
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


function sectionClockButton(sectionButtonsCell, sectionId) {
    const clockButton = createAndAppend(sectionButtonsCell, 'button', 'sectionButton', 'clockButton');
    const clockButtonImg = createAndAppend(clockButton, 'img', 'sectionButtonImg');
    clockButtonImg.src = '../../assets/clockIcon.svg';

    clockButton.addEventListener('click', () => {
        const clockBodyDiv = createClockBody();
        const clockSaveBtn = clockBodyDiv.parentElement.querySelector('.clockBtn-save');  
        const seccion = getSection(jsonData, sectionId);    
        createClockTable(clockBodyDiv, clockSaveBtn, seccion, sectionId);
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

    clockSaveBtn.addEventListener('click', () => {clockModalDiv.style.display = 'none';});

    return clockBodyDiv;
}

function createClockTable(clockBodyDiv, clockSaveBtn, seccion, sectionId) {
    const clockTable = createAndAppend(clockBodyDiv, 'table', 'clockTable');
    const clockThead = createAndAppend(clockTable, 'thead');
    const clockTbody = createAndAppend(clockTable, 'tbody');

    createTableHeaders(clockThead, ['Day', 'Open', 'Close']);
    createTableRows(clockTbody, seccion);

    clockSaveBtn.addEventListener('click', () => {
        setupSaveChanges(clockBodyDiv, sectionId);
    });
}

function createTableHeaders(parentElement, headers) {
    const headerRow = createAndAppend(parentElement, 'tr');

    headers.forEach(text => {
        const headerCell = createAndAppend(headerRow, 'th', 'clockTableHeader');
        addTextContent(headerCell, text);
    });
}

function createTableRows(parentElement, menuSection) {
    const dayMappingToName = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    };
    const dayOrder = [1, 2, 3, 4, 5, 6, 0];

    const areDailySpecialHoursSame = compareDailySpecialHours(menuSection);
    console.log("Comparación: ", areDailySpecialHoursSame);
    const timesMapping = {};

    // If all DailySpecialHours are the same for all MenuItems, then take the DailySpecialHours data 
    if (areDailySpecialHoursSame && menuSection.MenuItems[0].DailySpecialHours) {
        menuSection.MenuItems[0].DailySpecialHours.forEach(time => {
            timesMapping[time.dayOfWeek] = {
                start: time.StartTime,
                close: time.CloseTime
            };
        });
    }

    // Go through each day and create a row for it
    dayOrder.forEach(dayKey => {
        const row = createAndAppend(parentElement, 'tr');
        const dayName = dayMappingToName[dayKey];

        // Default values
        let times = ['01:00', '00:00'];

        // If times for this day exists in timesMapping, overwrite the defaults
        if (timesMapping[dayKey]) {
            times = [timesMapping[dayKey].start, timesMapping[dayKey].close];
        }

        // Populate the row
        [dayName, ...times].forEach((text, index) => {
            if (index === 0) {
                const cell = createAndAppend(row, 'td');
                addTextContent(cell, text);
            } else {
                createInputCell(row, text);
            }
        });
    });
}


function createInputCell(parentRow, text) {
    const cell = createAndAppend(parentRow, 'td');
    const timeInput = createAndAppend(cell, 'input');
    timeInput.type = 'time';
    timeInput.value = text;
}

//loops through the table and gets the time table data.
function setupSaveChanges(clockBodyDiv, sectionId)
{
    // Loop through the rows of the table body
    const tableRows = clockBodyDiv.querySelector('table').querySelector('tbody').rows;
    for (const row of tableRows) {
        const cells = row.cells;

        const dayName = cells[0].innerText;
        const dayOfWeek = dayMapping[dayName]; // get the corresponding number for the day
        const StartTime = cells[1].querySelector('input').value;
        const CloseTime = cells[2].querySelector('input').value;    
        let Period = calculatePeriod(StartTime, CloseTime)
 
        storeTimeTableInJson(dayOfWeek, StartTime, CloseTime, Period, sectionId);
    }

}
// Store the data in an object and push it to the jsonData local storage
function storeTimeTableInJson(dayOfWeek, StartTime, CloseTime, Period, sectionId) {
    jsonData.MenuSections.forEach(MenuSection => {
        if (sectionId == MenuSection.MenuSectionId) {

            MenuSection.MenuItems.forEach(MenuItem => {

                if(!MenuItem.DailySpecialHours) {
                    MenuItem.DailySpecialHours = [];
                }

                // Remove any object from DailySpecialHours that has the same dayOfWeek 
                // as the object we are pushing, to avoid duplicated objects.
                MenuItem.DailySpecialHours = 
                    MenuItem.DailySpecialHours.filter(time => time.dayOfWeek !== dayOfWeek);

                // If it's the first object, get a random ID,
                // Otherwise, it maps through all the BusinessHoursPeriodIds of the objects in DailySpecialHours, 
                // determines the highest value using Math.max, and adds +1. 
                let Id = (MenuItem.DailySpecialHours.length === 0) ? 
                    getRandomInt() : 
                    Math.max(...MenuItem.DailySpecialHours.map(item => item.BusinessHoursPeriodId)) + 1;

                // Create the new time object
                const newTime = {
                    BusinessHoursPeriodId: Id,
                    dayOfWeek,
                    StartTime,
                    CloseTime,
                    Period,
                    StartTimeEarly: StartTime,
                    PeriodEarly: "00:00"
                };    

                // Push the new time to the array
                MenuItem.DailySpecialHours.push(newTime);

            });

            updateSectionLocalStorage();
        }
    });
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

function getAvailableTimes(jsonData, sectionId) {
    const foundSection = jsonData.MenuSections.find(MenuSection => MenuSection.MenuSectionId == sectionId);
    if (foundSection) {
        return foundSection.MenuSectionAvailability.AvailableTimes;
    }
    return null;
}

function getSection(jsonData, sectionId) {
    const foundSection = jsonData.MenuSections.find(MenuSection => MenuSection.MenuSectionId == sectionId);
    if (foundSection) {
        return foundSection;
    }
    return null;
}
function compareDailySpecialHours(menuSection) {
    if (!menuSection.MenuItems || menuSection.MenuItems.length <= 1) {
        return true; // if there's only one or no items, then they are inherently the same
    }

    const baseHours = menuSection.MenuItems[0].DailySpecialHours;

    for (let i = 1; i < menuSection.MenuItems.length; i++) {
        const currentHours = menuSection.MenuItems[i].DailySpecialHours;

        if (baseHours.length !== currentHours.length) {
            return false; // if the lengths are different, then they're not the same
        }

        for (let j = 0; j < baseHours.length; j++) {
            if (baseHours[j].DayOfWeek !== currentHours[j].DayOfWeek ||
                baseHours[j].StartTime !== currentHours[j].StartTime ||
                baseHours[j].Period !== currentHours[j].Period ||
                baseHours[j].StartTimeEarly !== currentHours[j].StartTimeEarly ||
                baseHours[j].PeriodEarly !== currentHours[j].PeriodEarly) {
                return false; // if any of the properties don't match, then they're not the same
            }
        }
    }

    return true; // if we made it here, then all DailySpecialHours are the same for all MenuItems
}


export {
    sectionClockButton,
} 
