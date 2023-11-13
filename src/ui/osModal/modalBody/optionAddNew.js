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
    updateGroupedIdItemlessOs,
    groupOptionSets,
    updateOsDomIds,
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
        groupOptionId: crypto.randomUUID(),
    };
    const oldGroupOsId = menuOs.groupOsId

    if (groupedOs[menuOs.groupOsId]) {
        groupedOs[menuOs.groupOsId].forEach((os) => {
            const optionIds = getLocalStorageOptionSetItemsIDs();
            const newOptionId = getUniqueRandomInt(optionIds);
            updateItemCounterLocalStorage(newOptionId, true);

            const emptyOptionCopy = { ...emptyOptionJson };
            emptyOptionCopy.MenuItemOptionSetItemId = newOptionId;

            os.MenuItemOptionSetItems.push(emptyOptionCopy);

        });

        groupOptionSets();
        updateLocalStorage();
    } else if (itemlessOs[menuOs.groupOsId]) {
        const optionIds = getLocalStorageOptionSetItemsIDs();
        const newOptionId = getUniqueRandomInt(optionIds);
        updateItemCounterLocalStorage(newOptionId, true);

        emptyOptionJson.MenuItemOptionSetItemId = newOptionId;

        itemlessOs[menuOs.groupOsId].MenuItemOptionSetItems.push(
            emptyOptionJson
        );

        updateGroupedIdItemlessOs(menuOs);
    } else {
        console.warn("Warn: No option set found");
    }

    updateOsDomIds(menuOs, oldGroupOsId);

    updatePreview(menuOs, emptyOptionJson);

    const optionRow = createOption(
        optionRowsContainer,
        menuOs,
        emptyOptionJson
    );

    optionRowsContainer.appendChild(optionRow);

    setColorOfRows(optionRowsContainer);
}

function updatePreview(menuOs, emptyOptionJson) {
    const optionContainerPreviewArray = Array.from(
        document.getElementsByClassName("optionContainer")
    );

    const optionContainerPreview = optionContainerPreviewArray.filter(
        (element) => {
            const groupOsId = element.getAttribute("groupOsId");
            return groupOsId === menuOs.groupOsId;
        }
    );

    if (optionContainerPreview) {
        optionContainerPreview.forEach((osRowOptionContainerPreview) => {
            const newOptionRow = createOptionRow(emptyOptionJson);
            osRowOptionContainerPreview.appendChild(newOptionRow);
        });
    }
}

export { createOptionButton };
