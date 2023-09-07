// import {
//     jsonData,
//     getSectionIndex,
//     updateCounterLocalStorage,
//     updateSectionLocalStorage,
// } from './context.js';

function sectionClockButton(sectionButtonsCell) {
    const clockButton = document.createElement('button');
    clockButton.classList.add('sectionButton')
    clockButton.classList.add('clockButton')
    sectionButtonsCell.appendChild(clockButton);
    const clockButtonImg = document.createElement('img')
    clockButtonImg.classList.add('sectionButtonImg')
    clockButtonImg.src = '../../assets/clockIcon.svg'
    clockButton.appendChild(clockButtonImg)

    clockButton.addEventListener('click', () => {
        const clockBodyDiv = createClockModal();
        createClockTable(clockBodyDiv);
    });
}

function createClockModal() {
  // Create the main modal div
  const clockModalDiv = document.createElement('div');
  clockModalDiv.classList.add('clockModal');
  clockModalDiv.id = 'clockModalID';

  // Create modal dialog div
  const clockDialogDiv = document.createElement('div');
  clockDialogDiv.classList.add('clock-dialog');

  // Create modal content div
  const clockContentDiv = document.createElement('div');
  clockContentDiv.classList.add('clock-content');

  // Create header
  const clockHeaderDiv = document.createElement('div');
  clockHeaderDiv.classList.add('clock-header');
  const clockTitle = document.createElement('h5');
  clockTitle.classList.add('clock-title');
  clockTitle.id = 'clockModalTitle';
  clockTitle.textContent = 'Menu Section Hours';
  const clockCloseIcon = document.createElement('span');
  clockCloseIcon.classList.add('clockBtn-close');
  clockCloseIcon.innerHTML = '&times;';
  clockCloseIcon.addEventListener('click', () => {
      clockModalDiv.style.display = 'none';
  });
  clockHeaderDiv.appendChild(clockTitle);
  clockHeaderDiv.appendChild(clockCloseIcon);

  // Create body
  const clockBodyDiv = document.createElement('div');
  clockBodyDiv.classList.add('clock-body');

  // Create footer
  const clockFooterDiv = document.createElement('div');
  clockFooterDiv.classList.add('clock-footer');

  const clockSaveBtn = document.createElement('button');
  clockSaveBtn.classList.add('clockBtn', 'clockBtn-save');
  clockSaveBtn.textContent = 'Save Changes';
  clockFooterDiv.appendChild(clockSaveBtn);

  clockContentDiv.appendChild(clockHeaderDiv);
  clockContentDiv.appendChild(clockBodyDiv);
  clockContentDiv.appendChild(clockFooterDiv);
  clockDialogDiv.appendChild(clockContentDiv);
  clockModalDiv.appendChild(clockDialogDiv);

  document.body.appendChild(clockModalDiv);

  // Show modal
  clockModalDiv.style.display = 'block';

  return clockBodyDiv;
}

function createClockTable(clockBodyDiv) {
  // Create table
  const clockTable = document.createElement('table');
  clockTable.classList.add('clockTable');
  const clockThead = document.createElement('thead');
  const clockTbody = document.createElement('tbody');

  // Create table header
  const clockHeaders = ['Day', 'Open', 'Close'];
  const clockHeaderRow = document.createElement('tr');
  clockHeaders.forEach(text => {
      const clockTh = document.createElement('th');
      clockTh.classList.add('clockTableHeader');
      clockTh.textContent = text;
      clockHeaderRow.appendChild(clockTh);
  });
  clockThead.appendChild(clockHeaderRow);

  // Create table body
  const clockDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  clockDays.forEach(day => {
      const clockRow = document.createElement('tr');
      [day, '01:00', '00:00'].forEach((text, index) => {
          const clockTd = document.createElement('td');
          clockTd.textContent = text;
          if (index != 0) {
              clockTd.contentEditable = true;
          }
          // Limit text to 5 characters
          clockTd.addEventListener('input', function(event) {
              if (clockTd.textContent.length > 5) {
                  clockTd.textContent = clockTd.textContent.substring(0, 5);
              }
          });
          // Optional: Prevent Enter key from adding a new line
          clockTd.addEventListener('keydown', function(event) {
              if (event.key === 'Enter') {
                  event.preventDefault();
              }
          });
          clockRow.appendChild(clockTd);
      });
      clockTbody.appendChild(clockRow);
  });

  // Append table components
  clockTable.appendChild(clockThead);
  clockTable.appendChild(clockTbody);

  // Add table to modal body
  clockBodyDiv.appendChild(clockTable);
}

export {
    sectionClockButton,
} 