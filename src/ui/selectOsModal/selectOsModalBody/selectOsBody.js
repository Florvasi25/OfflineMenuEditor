import { groupedOs } from '../../context.js';

function createSelectOsModalBody() {
    const selectOsModalBody = document.createElement('div');
    selectOsModalBody.className = 'selectOsModalBody';

    const groupsArray = Object.values(groupedOs).map(item => {
        if (Array.isArray(item)) {
            return item[0];
        } else {
            return item;
        }
    });

    console.log('groupsArray', groupsArray);

    groupsArray.forEach(group => {
        console.log('group', group);
        const selectOsRowHeader = createSelectOsRowHeader(group)
        selectOsModalBody.appendChild(selectOsRowHeader)
    })


    return selectOsModalBody;
}

function createSelectOsRowHeader(group) {
    const name = document.createElement('p')
    name.textContent = group.Name
    console.log(name.textContent = group.Name);

    return name
}

export { createSelectOsModalBody };