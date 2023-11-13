import {
    updateLocalStorage,
    groupedOs,
    groupOptionSets,
    itemlessOs,
    updateItemlessOsKey
} from "../../context.js";

function optionVisibilityButton(
    optionButtonsCell,
    optionRow,
    menuOption,
    menuOs
) {
    const visibilityButton = document.createElement("button");
    visibilityButton.classList.add("sectionButton");
    visibilityButton.classList.add("visibilityButton");
    visibilityButton.addEventListener("click", () => {
        SectionAvailability(optionRow, menuOs, menuOption);
    });
    optionButtonsCell.appendChild(visibilityButton);
    const visibilityButtonImg = document.createElement("img");
    visibilityButtonImg.classList.add("sectionButtonImg");
    visibilityButtonImg.src = "../../assets/visibilityIcon.svg";
    visibilityButton.appendChild(visibilityButtonImg);

    //Unavailable Sections - Gray
    if (!menuOption.IsAvailable) {
        optionRow.classList.add("unavailable");
        visibilityButton.classList.add("hiddenSection");
    }

    //Changes the color of the Visibility Button according to its availability
    visibilityButton.addEventListener("click", () => {
        if (!menuOption.IsAvailable) {
            visibilityButton.classList.add("hiddenSection");
        } else {
            visibilityButton.classList.remove("hiddenSection");
        }
    });
}

//Section Availability
function SectionAvailability(optionRow, menuOs, menuOption) {
    const optionToHide = optionRow.id;
    const oldGroupOsId = menuOs.groupOsId;

    const indexOfOption = menuOs.MenuItemOptionSetItems.findIndex(
        option => option.MenuItemOptionSetItemId == menuOption.MenuItemOptionSetItemId
    )

    if (optionToHide) {
        if (groupedOs[oldGroupOsId]) {
            groupedOs[oldGroupOsId].forEach((os) => {
                const option = os.MenuItemOptionSetItems[indexOfOption]

                optionRow.classList.toggle("unavailable", option.IsAvailable);
                option.IsAvailable = !option.IsAvailable;
            });
            groupOptionSets();
            updateLocalStorage();

            const optionsIds = groupedOs[menuOs.groupOsId].map(
                os => os.MenuItemOptionSetItems[indexOfOption].MenuItemOptionSetItemId.toString()
            );
            const osRowOptionArray = Array.from(document.getElementsByClassName('osRowOption'));
            const osRowOption = osRowOptionArray.filter(p => optionsIds.includes(p.id));
            osRowOption.forEach(os => {
                os.classList.toggle('unavailable', !menuOption.IsAvailable)
            })

        } else if (itemlessOs[oldGroupOsId]) {
            const option = itemlessOs[groupOsId].MenuItemOptionSetItems[indexOfOption]
            optionRow.classList.toggle("unavailable", option.IsAvailable);
            option.IsAvailable = !option.IsAvailable;
            updateItemlessOsKey(oldGroupOsId);
        }
    }
}

export { optionVisibilityButton };
