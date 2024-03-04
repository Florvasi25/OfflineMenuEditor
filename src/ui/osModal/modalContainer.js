import { createOsModalNav } from './modalNav/osNav.js'

import { createOsModalBody } from './modalBody/osBody.js'

import { createOsModalFooter } from './modalFooter/osFooter.js'

import { clickCount } from '../mainContainer.js'

function createOsModalContainer(menuOs) {
    const rightContainer = document.getElementById('rightContainer')
    
    const osModalContainer = document.createElement('div')
    osModalContainer.classList = 'osModalContainer'
    osModalContainer.id = menuOs.MenuItemOptionSetId

    const {osModalNav, closeOsModalBtn } = createOsModalNav(menuOs)
    osModalContainer.appendChild(osModalNav)

    const osModalBody = createOsModalBody(menuOs)
    osModalContainer.appendChild(osModalBody)

    const osModalFooter = createOsModalFooter(menuOs)
    osModalContainer.appendChild(osModalFooter)

    closeOsModalBtn.addEventListener('click', () => {
        osModalContainer.classList.remove('show');
        osModalContainer.classList.add('hide');
        setTimeout(() => {
            osModalContainer.style.display = 'none';
            osModalContainer.classList.remove('hide');
            osModalContainer.remove()
        }, 300);
    });

    rightContainer.appendChild(osModalContainer)

    if (osModalContainer) {
        var osModalContainerParagraphs = osModalContainer.querySelectorAll('p');
        osModalContainerParagraphs.forEach(function(paragraph) {
            var currentSize = parseInt(window.getComputedStyle(paragraph).fontSize);
            paragraph.style.fontSize = (currentSize + clickCount) + 'px';
        });
    }

    return osModalContainer
}

export { createOsModalContainer }
