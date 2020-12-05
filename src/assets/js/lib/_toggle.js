/**
 * Function to export to theme.js
 *
 * @function toggle
 */

const toggle = () => {
  const html = document.querySelector('html');
  const toggleButtons = Array.from(html.querySelectorAll('.js-toggle'));

  function toggleAttrs(evt) {

    if (evt.target !== this && !evt.target.closest('.icons__label') && !evt.target.closest('.icons__icon')) return;
    // if (!html.classList.contains(this.getAttribute('data-html-class'))) {
    //   // Revert current active toggle
    //   toggleButtons.forEach((toggleButton) => {
    //     html.classList.remove(toggleButton.getAttribute('data-html-class'));
    //     toggleButton.classList.remove('is-active');
    //     const state1 = toggleButton.getAttribute('aria-expanded') === 'false' ? 'true' : 'false';
    //     toggleButton.setAttribute('aria-expanded', state1);
    //   });
    // }

    // const htmlClass = this.getAttribute('data-html-class');
    // html.classList.toggle(htmlClass);

    this.classList.toggle('is-active');
    const state = this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false';
    this.setAttribute('aria-expanded', state);

    if (this.getAttribute('data-focus')) {
      const el = this.getAttribute('data-focus');
      html.querySelector(el).focus();
    }
  }



  toggleButtons.forEach((toggleButton) => {
    toggleButton.addEventListener('click', toggleAttrs, false);
  });
};

export default toggle;
