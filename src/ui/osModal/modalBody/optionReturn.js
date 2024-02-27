import { 
    updateLocalStorage,
    updateItemlessLocalStorage,
    groupedOs,
    itemlessOs,
    groupOptionSets
} from '../../context.js';

import { slotManagerInstance } from '../../mainContainer.js';

function createOptionReturnCell(menuOption, menuOs) {
    const optionReturnCell = document.createElement('div');
    optionReturnCell.classList.add('optionReturnCell');

    const optionReturnFifteenCell = document.createElement('div');
    optionReturnFifteenCell.classList.add('optionReturnFifteenCell');

    const optionReturnFifteenText = document.createElement('p');
    optionReturnFifteenText.classList.add('optionReturnFifteenText');
    optionReturnFifteenText.textContent = "0.15";

    const optionReturnFifteenCheckbox = document.createElement('input');
    optionReturnFifteenCheckbox.type = "checkbox";
    optionReturnFifteenCheckbox.classList.add('optionReturnFifteenCheckbox');
    
    optionReturnFifteenCheckbox.checked = menuOption.DepositReturnFee === 0.15;

    const indexOfOption = menuOs.MenuItemOptionSetItems.findIndex(
        option => option.MenuItemOptionSetItemId == menuOption.MenuItemOptionSetItemId
    );
    
    optionReturnFifteenCheckbox.addEventListener('change', () => {
        if (groupedOs[menuOs.groupOsId]) {
            groupedOs[menuOs.groupOsId].forEach(os => {
                const option = os.MenuItemOptionSetItems[indexOfOption]
    
                if (optionReturnFifteenCheckbox.checked) {
                    option.DepositReturnFee = 0.15;
                    optionReturnTwentyFiveCheckbox.checked = false;
                } else {
                    option.DepositReturnFee = null;
                }
            })
            groupOptionSets();
            updateLocalStorage(slotManagerInstance.currentSlot);
        } else if (itemlessOs.includes(menuOs)){
            const option = menuOs.MenuItemOptionSetItems[indexOfOption]
    
            if (optionReturnFifteenCheckbox.checked) {
                option.DepositReturnFee = 0.15;
                optionReturnTwentyFiveCheckbox.checked = false;
            } else {
                option.DepositReturnFee = null;
            }
    
            updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
        }
    })

    const optionReturnTwentyFiveCell = document.createElement('div');
    optionReturnTwentyFiveCell.classList.add('optionReturnTwentyFiveCell');

    const optionReturnTwentyFiveText = document.createElement('p');
    optionReturnTwentyFiveText.classList.add('optionReturnTwentyFiveText');
    optionReturnTwentyFiveText.textContent = "0.25";

    const optionReturnTwentyFiveCheckbox = document.createElement('input');
    optionReturnTwentyFiveCheckbox.type = "checkbox";
    optionReturnTwentyFiveCheckbox.classList.add('optionReturnTwentyFiveCheckbox');
    
    optionReturnTwentyFiveCheckbox.checked = menuOption.DepositReturnFee === 0.25;

    optionReturnTwentyFiveCheckbox.addEventListener('change', () => {
        if (optionReturnTwentyFiveCheckbox.checked) {
            menuOption.DepositReturnFee = 0.25;
            optionReturnFifteenCheckbox.checked = false;
        } else {
            menuOption.DepositReturnFee = null;
        }

        updateLocalStorage(slotManagerInstance.currentSlot);
    });

    optionReturnTwentyFiveCheckbox.addEventListener('change', () => {
        if (groupedOs[menuOs.groupOsId]) {
            groupedOs[menuOs.groupOsId].forEach(os => {
                const option = os.MenuItemOptionSetItems[indexOfOption]
    
                if (optionReturnTwentyFiveCheckbox.checked) {
                    option.DepositReturnFee = 0.25;
                    optionReturnFifteenCheckbox.checked = false;
                } else {
                    option.DepositReturnFee = null;
                }
            })
            groupOptionSets();
            updateLocalStorage(slotManagerInstance.currentSlot);
        } else if (itemlessOs.includes(menuOs)){
            const option = menuOs.MenuItemOptionSetItems[indexOfOption]
    
            if (optionReturnTwentyFiveCheckbox.checked) {
                option.DepositReturnFee = 0.25;
                optionReturnFifteenCheckbox.checked = false;
            } else {
                option.DepositReturnFee = null;
            }
    
            updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
        }
    })

    optionReturnFifteenCell.appendChild(optionReturnFifteenText);
    optionReturnFifteenCell.appendChild(optionReturnFifteenCheckbox);
    
    optionReturnTwentyFiveCell.appendChild(optionReturnTwentyFiveText);
    optionReturnTwentyFiveCell.appendChild(optionReturnTwentyFiveCheckbox);

    optionReturnCell.appendChild(optionReturnFifteenCell);
    optionReturnCell.appendChild(optionReturnTwentyFiveCell);

    return optionReturnCell;
}

export { createOptionReturnCell };
