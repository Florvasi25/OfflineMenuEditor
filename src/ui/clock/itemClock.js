import { 
    jsonData, 
    getRandomInt,
    updateLocalStorage
} from '../context.js'

import {
    createAndAppend,
    addTextContent,
    createClockBody,
    createClockTable,
    createInputCell,
    dayMappingToName
} from './clockUtils.js'


function itemClockButton(itemButtonsCell, itemId) {
    const clockButton = createAndAppend(itemButtonsCell, 'button', 'sectionButton', 'clockButton');
    const clockButtonImg = createAndAppend(clockButton, 'img', 'sectionButtonImg');
    clockButtonImg.src = '../../assets/clockIcon.svg';
    clockButton.addEventListener('click', () => {
        const clockElements = createClockBody();
        const clockModalDiv = clockElements.clockModalDiv;
        const clockFooterDiv = clockElements.clockFooterDiv;
        const clockBodyDiv = clockElements.clockBodyDiv;
        const clockTitle = clockElements.clockTitle;
        const clockSaveBtn = createAndAppend(clockFooterDiv, 'button', 'clockBtn', 'clockBtn-save');
        addTextContent(clockSaveBtn, 'Save Changes');
        clockSaveBtn.addEventListener('click', () => {clockModalDiv.style.display = 'none';});
        addTextContent(clockTitle, 'Menu Item Hours');
        //const clockSaveBtn = clockBodyDiv.parentElement.querySelector('.clockBtn-save');  
        const item = getItem(jsonData, itemId); 
        createClockTable(clockBodyDiv, clockFooterDiv, clockSaveBtn, item, itemId);
    });
}

function createItemTableRows(parentElement, item) {
    const dayOrder = [1, 2, 3, 4, 5, 6, 0];
    const timesMapping = {};
    item.DailySpecialHours.forEach(time => {
        timesMapping[time.dayOfWeek] = {
            start: time.StartTime,
            close: time.CloseTime
        };
    });

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

// Store the data in an object and push it to the jsonData local storage
function storeItemTimeTableInJson(dayOfWeek, StartTime, CloseTime, Period, id) {
    const itemRow = document.getElementById(id);
    jsonData.MenuSections.forEach(section => {
        section.MenuItems.forEach(item => {
            if(item.MenuItemId == id) {
                if(!item.DailySpecialHours) {
                    item.DailySpecialHours = [];
                }   
                // Remove any object from DailySpecialHours that has the same dayOfWeek 
                // as the object we are pushing, to avoid duplicated objects.
                item.DailySpecialHours = 
                    item.DailySpecialHours.filter(time => time.dayOfWeek !== dayOfWeek);    
                // If it's the first object, get a random ID,
                // Otherwise, it maps through all the BusinessHoursPeriodIds of the objects in DailySpecialHours, 
                // determines the highest value using Math.max, and adds +1. 
                let Id = (item.DailySpecialHours.length === 0) ? 
                    getRandomInt() : 
                    Math.max(...item.DailySpecialHours.map(items => items.BusinessHoursPeriodId)) + 1;    
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
                item.DailySpecialHours.push(newTime);
            }
    })})
    updateLocalStorage();
    changeItemClockIcon(itemRow, id);
}

function changeItemClockIcon(itemRow, itemId){
    var item = getItem(jsonData, itemId);
    const clockButtonImg = itemRow.querySelector('.sectionButton.clockButton .sectionButtonImg');
    if (item?.DailySpecialHours?.length > 1)
    {
        clockButtonImg.src = '../../assets/greenClockIcon.svg';
    }else {clockButtonImg.src = '../../assets/clockIcon.svg';}
}

function getItem(jsonData, itemId) {
    if (!jsonData || !jsonData.MenuSections) return null;
    for (let section of jsonData.MenuSections) {
        const foundItem = section.MenuItems && section.MenuItems.find(MenuItem => MenuItem.MenuItemId == itemId);
        if (foundItem) {
            return foundItem;
        }
    }
    return null;
}

export {
    itemClockButton,
    createItemTableRows,
    storeItemTimeTableInJson,
    changeItemClockIcon
}