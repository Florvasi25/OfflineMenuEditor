import { createOption } from "./osBody.js";

import {
    jsonData,
    updateItemCounterLocalStorage,
    updateLocalStorage,
    getLocalStorageOptionSetItemsIDs,
    getUniqueRandomInt,
    getRandomInt,
    groupedOs,
    setColorOfRows,
    itemlessOs,
    updateItemlessLocalStorage,
    groupOptionSets,
} from "../../context.js";

import { createOptionRow } from "../../optionSet/osOptionsContainer.js";

function createOptionButton(optionRowsContainer, menuOs) {
    const newOptionButton = document.createElement("button");
    newOptionButton.className = "optionAddNew";
    newOptionButton.textContent = "New Option";

    //Add Section
    newOptionButton.addEventListener("click", () => {
        handleClickNewOptionButton(optionRowsContainer, menuOs);
    });

    return newOptionButton;
}

function handleClickNewOptionButton(optionRowsContainer, menuOs) {
    let emptyOptionJson = {
        CatalogItemId: null,
        MenuId: jsonData.MenuId,
        MenuItemOptionSetItemId: null,
        Name: "New Option " + getRandomInt(),
        Price: 0,
        TaxRateId: null,
        TaxRate: null,
        TaxValue: 0,
        TaxRateName: null,
        IsAvailable: true,
        DisplayOrder: menuOs.MenuItemOptionSetItems.length,
        IsDeleted: false,
        Tags: [],
        NextMenuItemOptionSetId: null,
        PublicId: crypto.randomUUID(),
        ImageName: null,
        ImageUrl: null,
        CellAspectRatio: 0,
        CellLayoutType: 0,
        OptionSetItemMetadata: [],
        ExternalImageUrl: null,
    };
    const groupOsId = menuOs.groupOsId;

    if (groupedOs[groupOsId]) {
        groupedOs[groupOsId].forEach((os) => {
            const optionIds = getLocalStorageOptionSetItemsIDs();
            const newOptionId = getUniqueRandomInt(optionIds);
            updateItemCounterLocalStorage(newOptionId, true);

            const emptyOptionCopy = { ...emptyOptionJson };
            emptyOptionCopy.MenuItemOptionSetItemId = newOptionId;

            os.MenuItemOptionSetItems.push(emptyOptionCopy);

            if (os.MenuItemOptionSetId === menuOs.MenuItemOptionSetId) {
                const optionRow = createOption(
                    optionRowsContainer,
                    menuOs,
                    emptyOptionCopy
                );
                optionRowsContainer.appendChild(optionRow);
            }

            updatePreview(os, emptyOptionCopy);
        });

        groupOptionSets();
        updateLocalStorage();

    } else if (itemlessOs.includes(menuOs)){
        const optionIds = getLocalStorageOptionSetItemsIDs();
        const newOptionId = getUniqueRandomInt(optionIds);
        updateItemCounterLocalStorage(newOptionId, true);

        emptyOptionJson.MenuItemOptionSetItemId = newOptionId;

        menuOs.MenuItemOptionSetItems.push(
            emptyOptionJson
        );

        const optionRow = createOption(
            optionRowsContainer,
            menuOs,
            emptyOptionJson
        );
        optionRowsContainer.appendChild(optionRow);

        updateItemlessLocalStorage();
    } else {
        console.warn("Warn: No option set found");
    }

    setColorOfRows(optionRowsContainer);
}

function updatePreview(menuOs, emptyOptionJson) {
    const optionContainerPreviewArray = Array.from(
        document.getElementsByClassName("optionContainer")
    );

    const optionContainerPreview = optionContainerPreviewArray.find(
        p => p.id == menuOs.MenuItemOptionSetId
    );

    if (optionContainerPreview) {
        const newOptionRow = createOptionRow(emptyOptionJson);
        optionContainerPreview.appendChild(newOptionRow);
    }
}

export { createOptionButton, updatePreview };
