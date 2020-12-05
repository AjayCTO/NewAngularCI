/* eslint-disable max-statements */
/**
 * @fileOverview
 * @author Zoltan Toth
 * @version 2.2.0
 */

/**
 * @description
 * Vanilla JavaScript dropdown - a tiny (~600 bytes gzipped) select tag replacement.
 *
 * @class
 * @param {(string|Object)} options.elem - HTML id of the select or the DOM element.
 */
const CustomSelect = (options) => {
  const elem = typeof options.elem === 'string' ? document.getElementById(options.elem) : options.elem;
  const mainClass = 'form__dropdown';
  const titleClass = 'form__dropdown-title';
  const listClass = 'form__dropdown-list';
  const optgroupClass = 'form__dropdown-optgroup';
  const selectedClass = 'is-selected';
  const openClass = 'is-open';
  const selectOpgroups = elem.getElementsByTagName('optgroup');
  const selectOptions = elem.options;
  // eslint-disable-next-line indent
  const optionsLength = selectOptions.length;
  let index = 0;

  // creating the pseudo-select container
  const selectContainer = document.createElement('div');

  selectContainer.className = mainClass;

  if (elem.id) {
    selectContainer.id = `custom-${elem.id}`;
  }

  // creating the always visible main button
  const button = document.createElement('button');

  button.className = titleClass;
  button.textContent = selectOptions[0].textContent;
  button.setAttribute('value', selectOptions[0].textContent);

  // creating the UL
  const ul = document.createElement('ul');
  ul.className = listClass;

  // dealing with optgroups
  if (selectOpgroups.length) {
    for (let i = 0; i < selectOpgroups.length; i++) {
      const div = document.createElement('div');
      div.innerText = selectOpgroups[i].label;
      div.classList.add(optgroupClass);

      ul.appendChild(div);
      generateOptions(selectOpgroups[i].getElementsByTagName('option'));
    }
  } else {
    generateOptions(selectOptions);
  }

  // appending the button and the list
  selectContainer.appendChild(button);
  selectContainer.appendChild(ul);

  // pseudo-select is ready - append it and hide the original
  elem.parentNode.insertBefore(selectContainer, elem);
  elem.style.display = 'none';
  selectContainer.closest('.form__col').addEventListener('click', onClick);

  /**
   * Generates a list from passed options.
   *
   * @param {object} options - options for the whole select or for an optgroup.
   */
  function generateOptions(options) {
    for (let i = 0; i < options.length; i++) {
      const li = document.createElement('li');

      li.innerText = options[i].textContent;
      li.setAttribute('data-value', options[i].value);
      li.setAttribute('data-index', index++);

      if (selectOptions[elem.selectedIndex] != undefined && selectOptions[elem.selectedIndex].textContent === options[i].textContent) {
        li.classList.add(selectedClass);
        button.textContent = options[i].textContent;
        button.setAttribute('value', options[i].textContent);
      }

      ul.appendChild(li);
    }
  }

  /**
   * Closes the current select on any click outside of it.
   *
   */
  document.addEventListener('click', function (e) {
    if (!selectContainer.closest('.form__col').contains(e.target)) close();
  });

  /**
   * Handles the clicks on current select.
   *
   * @param {object} e - The item the click occured on.
   */
  function onClick(e) {
    e.preventDefault();

    const t = e.target; // || e.srcElement; - uncomment for IE8
    if (t.className === titleClass || t.tagName === 'LABEL') {
      toggle();
    }

    if (t.tagName === 'LI') {
      selectContainer.querySelector('.' + titleClass).innerText = t.innerText;
      selectContainer.querySelector('.' + titleClass).setAttribute('value', t.innerText);
      elem.options.selectedIndex = t.getAttribute('data-index');

      //trigger 'change' event
      const evt = new CustomEvent('change');
      elem.dispatchEvent(evt);

      // highlight the selected
      for (let i = 0; i < optionsLength; i++) {
        ul.querySelectorAll('li')[i].classList.remove(selectedClass);
      }
      t.classList.add(selectedClass);

      close();
      if (t.innerText === '') {
        ul.closest('.form__col').classList.remove('form__col--active');
      }
    }
  }

  /**
   * Toggles the open/close state of the select on title's clicks.
   *
   * @public
   */
  function toggle() {
    ul.classList.toggle(openClass);
    ul.closest('.form__col').classList.add('form__col--active');
  }

  /**
   * Opens the select.
   *
   * @public
   */
  function open() {
    ul.classList.add(openClass);
  }

  /**
   * Closes the select.
   *
   * @public
   */
  function close() {
    ul.classList.remove(openClass);
  }

  return {
    toggle: toggle,
    close: close,
    open: open,
  };
};

export default CustomSelect;
