import { emptyMenu } from '../emptyMenu.js'

import { setJsonData } from '../context.js'

import { generateHTML, 
    createBtnContainers, 
    createLeftContainer, 
    createTaxContainer,
    scrollUpButton 
} from '../mainContainer.js';

export class SlotManager {
    constructor() {
        this.currentSlot = 'jsonDataSlot1';
        this.currentItemlessOs = 'itemlessOsSlot1';
        this.currentSlotName = 'Slot 1';
        createBtnContainers();
        createLeftContainer();
        scrollUpButton()
        this.bindSlotButtonEvents();

        // Initialize slotTitle with the text from localStorage
        const slotTitle = document.querySelector('.slotTitle');
        const buttonId = 'slotButton1'; // Default id for the first slotButton
        const localStorageText = localStorage.getItem(buttonId);
        if (localStorageText) {
            slotTitle.textContent = localStorageText;
        }
    }

    bindSlotButtonEvents() {
        const slotButtons = document.querySelectorAll('.slotBtn');
        slotButtons.forEach(button => {
            button.addEventListener('click', event => {
                const slotNumber = event.target.id.replace('slotButton', '');
                const itemlessOsNumber = slotNumber;
                this.changeWorkspace(`jsonDataSlot${slotNumber}`, `itemlessOsSlot${itemlessOsNumber}`, `Slot ${slotNumber}`, button.id);
                
                // Update slotTitle text based on the clicked slotButton's id
                const slotTitle = document.querySelector('.slotTitle');
                const localStorageText = localStorage.getItem(button.id);
                if (localStorageText) {
                    slotTitle.textContent = localStorageText;
                }
            });

            button.addEventListener('blur', function () {
                localStorage.setItem(button.id, button.textContent);
            });
        });
    }

    changeWorkspace(jsonDataSlot, itemlessOsName, slotName, slotId) {
        this.currentSlot = jsonDataSlot;
        this.currentItemlessOs = itemlessOsName; 
        this.currentSlotName = slotName;
        console.log("SLOT: ", this.currentSlot, " Itemless: ", this.currentItemlessOs, " slot ID: ", slotId);
        this.updateWorkspace(slotId);
    
        // Update slotTitle.id to match the slotId
        const slotTitle = document.getElementsByClassName('slotTitle')[0];
        slotTitle.id = slotId;
    }

    updateWorkspace(slotId) {
        let jsonData = this.getJsonData();
        setJsonData(jsonData);
        //updateJsonData(jsonData);
        generateHTML(jsonData);
        createTaxContainer(jsonData);
        this.changeSlotTitle(slotId);
    }

    getJsonData() {
        return JSON.parse(localStorage.getItem(this.currentSlot)) ?? emptyMenu;
    }

    saveJsonData(jsonData) {
        localStorage.setItem(this.currentSlot, JSON.stringify(jsonData));
    }

    changeSlotTitle(slotId) {
        var slotTitle = document.getElementsByClassName('slotTitle')[0];
        slotTitle.id = slotId
        slotTitle.textContent = this.currentSlotName;
    }
}
