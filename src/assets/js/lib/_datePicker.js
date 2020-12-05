/* eslint-disable max-len */
import flatpickr from 'flatpickr';
import inputFocus from './_inputFocus';

const datePicker = () => {
  if (!document.querySelectorAll('.flatpickr').length > 0) return false;

  const html = document.querySelector('html');
  const allDates = Array.from(html.querySelectorAll('.flatpickr'));

  allDates.forEach((allDate) => {
    const flatpickrMode = allDate.getAttribute('data-flatpickr-mode');
    flatpickr(allDate, {
      // A string of characters which are used to define how the date will be displayed in the input box.
      dateFormat: 'Y-m-d',
      // Whether clicking on the input should open the picker. You could disable this if you wish to open the calendar manually with.open()
      clickOpens: true,
      // Displays the calendar inline
      inline: false,
      // "single"  "single", "multiple", or "range"
      mode: flatpickrMode,
      onChange: function () {
        inputFocus();
      },
      // next/prev arrows
      prevArrow:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><g><rect width="12" height="12" transform="translate(12 12) rotate(-180)" fill="none"/><g><path d="M4,7.26a2,2,0,0,0,.76,1.57h0l0,0,2.86,2.19L8.9,9.46l-1.29-1L4.44,6A2,2,0,0,0,4,7.26Z" fill="#686f73"/><path d="M3.16,4.41,7.68,1,8.9,2.53,4.8,5.67A1.8,1.8,0,0,0,4.44,6,2,2,0,0,0,4,7.26a2,2,0,0,0,.76,1.57L3.17,7.59A2,2,0,0,1,3.16,4.41Z" fill="#686f73"/></g></g></svg>',
      nextArrow:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><g><rect width="12" height="12" fill="none"/><g><path d="M7.56,6,4.39,8.47l-1.29,1,1.22,1.59L7.18,8.86l0,0h0A2,2,0,0,0,8,7.26,2,2,0,0,0,7.56,6Z" fill="#686f73"/><path d="M8.84,4.41,4.32,1,3.1,2.53,7.2,5.67A1.8,1.8,0,0,1,7.56,6,2,2,0,0,1,8,7.26a2,2,0,0,1-.76,1.57L8.83,7.59A2,2,0,0,0,8.84,4.41Z" fill="#686f73"/></g></g></svg>'
    });
  });
};

export default datePicker;
