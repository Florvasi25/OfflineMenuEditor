function createItemReturnCell(itemRow, menuItem, sectionId) {
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

    itemReturnFifteenCheckbox.addEventListener('change', function() {
        if (itemReturnFifteenCheckbox.checked) {
            itemReturnTwentyFiveCheckbox.checked = false;
        }
    });

    const itemReturnTwentyFiveCell = document.createElement('div');
    itemReturnTwentyFiveCell.classList.add('itemReturnTwentyFiveCell');

    const itemReturnTwentyFiveText = document.createElement('p');
    itemReturnTwentyFiveText.classList.add('itemReturnTwentyFiveText');
    itemReturnTwentyFiveText.textContent = "0.25";

    const itemReturnTwentyFiveCheckbox = document.createElement('input');
    itemReturnTwentyFiveCheckbox.type = "checkbox";
    itemReturnTwentyFiveCheckbox.classList.add('itemReturnTwentyFiveCheckbox');

    itemReturnTwentyFiveCheckbox.addEventListener('change', function() {
        if (itemReturnTwentyFiveCheckbox.checked) {
            itemReturnFifteenCheckbox.checked = false;
        }
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
