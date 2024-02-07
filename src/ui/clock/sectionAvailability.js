import {
    jsonData,
    updateLocalStorage,
    getRandomInt
} from '../context.js'

import {
    calculatePeriod,
    invertedDayMapping
} from "./clockUtils.js";

import {
    createAndAppend,  
    addTextContent
}  from '../helpers.js';

import {
    getAvailabilityMode
}  from './collapsedTime.js';

import { slotManagerInstance } from '../mainContainer.js';

let clockSectionAvailabilityBtn;

function addSectionAvailabilityButton(clockFooterDiv, section) {
    clockSectionAvailabilityBtn = createAndAppend(clockFooterDiv, 'button', 'clockBtn', 'availabilityBtn');
    
    if (section.MenuSectionAvailability.AvailabilityMode == 1 || section.MenuSectionAvailability.AvailabilityMode == 3){
        enableSectionAvailabilityBtn();
        unlockAvailabilityBtn();  
    } else {
        disableSectionAvailabilityBtn(); 
        blockAvailabilityBtn();
    }

    clockSectionAvailabilityBtn.addEventListener('click', () => {
        if (clockSectionAvailabilityBtn.classList.contains('clockBtn-green')) {
            disableSectionAvailabilityBtn();  
        } else {
            enableSectionAvailabilityBtn();  
        }
    });
}
function availabilityTimes(sectionId, clockFooterDiv, sectionIndex){
    const availabilityMode = getAvailabilityMode(sectionIndex);
    if (clockSectionAvailabilityBtn.classList.contains('clockBtn-green') ) {
        storeAvailabilityTimes(sectionId, clockFooterDiv, availabilityMode);
    }else{
        deleteAvailabilityTimes(sectionId, availabilityMode)
    }
}

function storeAvailabilityTimes(sectionId, clockFooterDiv, availabilityMode)
{
 jsonData.MenuSections.forEach(MenuSection => {
    if (sectionId == MenuSection.MenuSectionId) {
        /*if(availabilityMode == 0 || availabilityMode == 2){
            MenuSection.MenuSectionAvailability.AvailabilityMode = 1;
        }*/
        MenuSection.MenuSectionAvailability.MenuSectionId = sectionId;
        getTableSchedule(clockFooterDiv, sectionId);
    }})
}

function deleteAvailabilityTimes(sectionId, availabilityMode)
{
    jsonData.MenuSections.forEach(MenuSection => {
        if (sectionId == MenuSection.MenuSectionId) {
            if(availabilityMode == 1 || availabilityMode == 3){
                MenuSection.MenuSectionAvailability.AvailabilityMode = 0;
            }
            MenuSection.MenuSectionAvailability.MenuSectionId = sectionId;
            if (MenuSection.MenuSectionAvailability.AvailableTimes) {
                MenuSection.MenuSectionAvailability.AvailableTimes = [];
                updateLocalStorage(slotManagerInstance.currentSlot);
            }
        }})
}

function removeAvailabilityTimes(sectionId){
jsonData.MenuSections.forEach(MenuSection => {
    if (sectionId == MenuSection.MenuSectionId) {
        MenuSection.MenuSectionAvailability.AvailabilityMode = 0;
        MenuSection.MenuSectionAvailability.MenuSectionId = sectionId;
        if (MenuSection.MenuSectionAvailability.AvailableTimes) {
            MenuSection.MenuSectionAvailability.AvailableTimes = [];
           updateLocalStorage(slotManagerInstance.currentSlot);
        }
    }})
}

function getTableSchedule(clockFooterDiv, id) {
    const clockContentDiv = clockFooterDiv.parentElement;
    const clockBodyDiv = clockContentDiv.querySelector('.clock-body');
    const tableRows = clockBodyDiv.querySelector('table').querySelector('tbody').rows;
    for (const row of tableRows) {
        const cells = row.cells;
        const dayName = cells[0].innerText;
        const DayOfWeek = invertedDayMapping[dayName]; // get the corresponding number for the day
        const StartTime = cells[1].querySelector('input').value;
        const CloseTime = cells[2].querySelector('input').value;
        let Period = calculatePeriod(StartTime, CloseTime)

        storeBikeTimeTableInJson(DayOfWeek, StartTime, CloseTime, Period, id);
    }
}

function storeBikeTimeTableInJson(DayOfWeek, StartTime, CloseTime, Period, sectionId) {
    jsonData.MenuSections.forEach(MenuSection => {
        if (sectionId == MenuSection.MenuSectionId) {
            if(!MenuSection.MenuSectionAvailability.AvailableTimes) {
                MenuSection.MenuSectionAvailability.AvailableTimes = [];
            }
            // Remove any object from AvailableTimes that has the same DayOfWeek 
            // as the object we are pushing, to avoid duplicated objects.
            MenuSection.MenuSectionAvailability.AvailableTimes = 
                MenuSection.MenuSectionAvailability.AvailableTimes.filter(time => time.DayOfWeek !== DayOfWeek);            
            // If it's the first object, get a random ID,
            // Otherwise, it maps through all the BusinessHoursPeriodIds of the objects in AvailableTimes, 
            // determines the highest value using Math.max, and adds +1. 
            let Id = (MenuSection.MenuSectionAvailability.AvailableTimes.length === 0) ? 
                getRandomInt() : 
                Math.max(...MenuSection.MenuSectionAvailability.AvailableTimes.map(item => item.BusinessHoursPeriodId)) + 1;
            // Create the new time object
            const newTime = {
                BusinessHoursPeriodId: Id,
                DayOfWeek,
                StartTime,
                CloseTime,
                Period,
                StartTimeEarly: StartTime,
                PeriodEarly: "00:00"
            };    
            // Push the new time to the array
            MenuSection.MenuSectionAvailability.AvailableTimes.push(newTime);
            updateLocalStorage(slotManagerInstance.currentSlot);
        }
    });
}

function enableSectionAvailabilityBtn(){
    clockSectionAvailabilityBtn.classList.remove('clockBtn-red');
    clockSectionAvailabilityBtn.classList.add('clockBtn-green');
    addTextContent(clockSectionAvailabilityBtn, 'Section Availability Enabled');  
}

function disableSectionAvailabilityBtn(){
    clockSectionAvailabilityBtn.classList.remove('clockBtn-green');
    clockSectionAvailabilityBtn.classList.add('clockBtn-red');
    addTextContent(clockSectionAvailabilityBtn, 'Section Availability Disabled'); 
}

function blockAvailabilityBtn(){
    //const btn = getAvailabilityBtn();
    clockSectionAvailabilityBtn.disabled = true; 
    clockSectionAvailabilityBtn.classList.add('clockBtn-disabled');
}

function unlockAvailabilityBtn(){
    //const btn = getAvailabilityBtn();
    clockSectionAvailabilityBtn.disabled = false; 
    clockSectionAvailabilityBtn.classList.remove('clockBtn-disabled');
    //btn.classList.add('clockBtn-red');
}
function getAvailabilityBtn(){
    return document.querySelector('.availabilityBtn');
}

export{
    addSectionAvailabilityButton,
    availabilityTimes,
    deleteAvailabilityTimes,
    removeAvailabilityTimes,
    enableSectionAvailabilityBtn,
    disableSectionAvailabilityBtn,
    unlockAvailabilityBtn,
    blockAvailabilityBtn
}