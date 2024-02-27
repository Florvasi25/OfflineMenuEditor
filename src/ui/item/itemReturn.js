import { updateLocalStorage } from '../context.js';
import { slotManagerInstance } from '../mainContainer.js';

function createItemReturnCell(menuItem) {
    const itemReturnCell = document.createElement('div');
    itemReturnCell.classList.add('itemReturnCell');

    const itemReturnFifteenCell = document.createElement('div');
    itemReturnFifteenCell.classList.add('itemReturnFifteenCell');

    const itemReturnFifteenText = document.createElement('p');
    itemReturnFifteenText.classList.add('itemReturnFifteenText');
    itemReturnFifteenText.textContent = "0.15";

    const itemReturnFifteenCheckbox = document.createElement('input');
    itemReturnFifteenCheckbox.type = "checkbox";
    itemReturnFifteenCheckbox.classList.add('itemReturnFifteenCheckbox');
    
    itemReturnFifteenCheckbox.checked = menuItem.DepositReturnFee === 0.15;

    itemReturnFifteenCheckbox.addEventListener('change', () => {
        if (itemReturnFifteenCheckbox.checked) {
            menuItem.DepositReturnFee = 0.15;
            itemReturnTwentyFiveCheckbox.checked = false;
        } else {
            menuItem.DepositReturnFee = null;
        }

        updateLocalStorage(slotManagerInstance.currentSlot);
    });

    const itemReturnTwentyFiveCell = document.createElement('div');
    itemReturnTwentyFiveCell.classList.add('itemReturnTwentyFiveCell');

    const itemReturnTwentyFiveText = document.createElement('p');
    itemReturnTwentyFiveText.classList.add('itemReturnTwentyFiveText');
    itemReturnTwentyFiveText.textContent = "0.25";

    const itemReturnTwentyFiveCheckbox = document.createElement('input');
    itemReturnTwentyFiveCheckbox.type = "checkbox";
    itemReturnTwentyFiveCheckbox.classList.add('itemReturnTwentyFiveCheckbox');
    
    itemReturnTwentyFiveCheckbox.checked = menuItem.DepositReturnFee === 0.25;

    itemReturnTwentyFiveCheckbox.addEventListener('change', () => {
        if (itemReturnTwentyFiveCheckbox.checked) {
            menuItem.DepositReturnFee = 0.25;
            itemReturnFifteenCheckbox.checked = false;
        } else {
            menuItem.DepositReturnFee = null;
        }

        updateLocalStorage(slotManagerInstance.currentSlot);
    });

    itemReturnFifteenCell.appendChild(itemReturnFifteenText);
    itemReturnFifteenCell.appendChild(itemReturnFifteenCheckbox);
    
    itemReturnTwentyFiveCell.appendChild(itemReturnTwentyFiveText);
    itemReturnTwentyFiveCell.appendChild(itemReturnTwentyFiveCheckbox);

    itemReturnCell.appendChild(itemReturnFifteenCell);
    itemReturnCell.appendChild(itemReturnTwentyFiveCell);

    return itemReturnCell;
}

export { createItemReturnCell };
