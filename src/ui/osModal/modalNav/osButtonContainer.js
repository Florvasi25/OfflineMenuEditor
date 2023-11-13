import { osDeleteButton } from './osDelete.js'

import { osDuplicateButton } from './osDuplicate.js'

import { osNewButton } from './osAddNew.js'

import { osCaseButton } from './osCase.js'

function createOsBtnsCell(menuOs, osModalContainer) {
    const osBtnsCell = document.createElement('div')
    osBtnsCell.className = 'osBtnsCell'

    osNewButton(osBtnsCell, menuOs)

    osCaseButton(osBtnsCell)

    osDeleteButton(osBtnsCell)

    osDuplicateButton(osBtnsCell, menuOs, osModalContainer)

    return osBtnsCell
}

export { createOsBtnsCell }