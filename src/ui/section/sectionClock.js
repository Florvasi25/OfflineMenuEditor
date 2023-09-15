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
        createClockTable(clockBodyDiv, clockSaveBtn, sectionId);
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

function createClockTable(clockBodyDiv, clockSaveBtn, sectionId) {
    const clockTable = createAndAppend(clockBodyDiv, 'table', 'clockTable');
    const clockThead = createAndAppend(clockTable, 'thead');
    const clockTbody = createAndAppend(clockTable, 'tbody');

    const clockHeaders = ['Day', 'Open', 'Close'];
    const clockHeaderRow = createAndAppend(clockThead, 'tr');

    clockHeaders.forEach(text => {
        const clockTh = createAndAppend(clockHeaderRow, 'th', 'clockTableHeader');
        addTextContent(clockTh, text);
    });

    Object.keys(dayMapping).forEach(day => {
        const clockRow = createAndAppend(clockTbody, 'tr');
        
        [day, '01:00', '00:00'].forEach((text, index) => {
            const clockTd = createAndAppend(clockRow, 'td');
            
            if (index === 0) {
                addTextContent(clockTd, text);
            } else {
                const timeInput = createAndAppend(clockTd, 'input');
                timeInput.type = 'time';
                timeInput.value = text;

            }
        });
    });

    clockSaveBtn.addEventListener('click', () => {

        // Loop through the rows of the table body
        const tableRows = clockBodyDiv.querySelector('table').querySelector('tbody').rows;
        for (const row of tableRows) {
            const cells = row.cells;
    
            const dayName = cells[0].innerText;
            const dayOfWeek = dayMapping[dayName]; // get the corresponding number for the day
            const StartTime = cells[1].querySelector('input').value;
            const closeTime = cells[2].querySelector('input').value;

            let Period = calculatePeriod(StartTime, closeTime)
            
            storeTimeTableinJson(dayOfWeek, StartTime, closeTime, Period, sectionId);
        }
    });
}

// Store the data in an object and push it to the jsonData local storage
function storeTimeTableinJson(dayOfWeek, StartTime, closeTime, Period, sectionId) {

    jsonData.MenuSections.forEach(MenuSection => {
        if (sectionId == MenuSection.MenuSectionId) {

            MenuSection.MenuSectionAvailability.AvailabilityMode = 1;
            MenuSection.MenuSectionAvailability.MenuSectionId = sectionId;

            // Check if AvailableTimes already has values; if not, initialize it as an empty array
            if (!MenuSection.MenuSectionAvailability.AvailableTimes) {
                MenuSection.MenuSectionAvailability.AvailableTimes = [];
            } else {
                // Remove any object from AvailableTimes that has the same dayOfWeek as newTime, to avoid duplicated objects.
                MenuSection.MenuSectionAvailability.AvailableTimes = MenuSection.MenuSectionAvailability.AvailableTimes.filter(time => time.dayOfWeek !== dayOfWeek);
            }

            // If it's the first object, get a random ID,
            // Otherwise, it maps through all the BusinessHoursPeriodIds of the objects in AvailableTimes, 
            // determines the highest value using Math.max, and adds +1. 
            let Id = (MenuSection.MenuSectionAvailability.AvailableTimes.length === 0) ? 
                getRandomInt() : 
                Math.max(...MenuSection.MenuSectionAvailability.AvailableTimes.map(item => item.BusinessHoursPeriodId)) + 1;
            
            // Create the new time object
            const newTime = {
                BusinessHoursPeriodId: Id,
                dayOfWeek,
                StartTime,
                closeTime,
                Period,
                StartTimeEarly: StartTime,
                PeriodEarly: "00:00"
            };    
            
            // Push the new time to the array
            MenuSection.MenuSectionAvailability.AvailableTimes.push(newTime);

            updateSectionLocalStorage();
        }
    });
}



function calculatePeriod(StartTime, closeTime) {
    const [startHours, startMinutes] = StartTime.split(':').map(Number);
    const [endHours, endMinutes] = closeTime.split(':').map(Number);

    // Construct start and end dates - we only use them for time, so the day doesn't matter.
    const startDate = new Date(2020, 0, 1, startHours, startMinutes);
    const endDate = new Date(2020, 0, 1, endHours, endMinutes);

    if (StartTime == closeTime) {
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
    sectionClockButton,
} 
