import { osDeleteButton } from './osDelete.js'

import { osDuplicateButton } from './osDuplicate.js'

import { osNewButton } from './osAddNew.js'

import { osCaseButton } from './osCase.js'

function createOsBtnsCell(menuOs) {
    const osBtnsCell = document.createElement('div')
    osBtnsCell.className = 'osBtnsCell'

    osNewButton(osBtnsCell, menuOs)

    osCaseButton(osBtnsCell)

    osDeleteButton(osBtnsCell, menuOs)

    osDuplicateButton(osBtnsCell, menuOs)

    return osBtnsCell
}

export { createOsBtnsCell }