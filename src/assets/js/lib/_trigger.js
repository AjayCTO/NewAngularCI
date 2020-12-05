/**
 * Just a small function to trigger an event on elements
 *
 */

const trigger = () => {
  const triggerButtons = Array.from(document.querySelectorAll('.js-trigger'));

  function triggerAttrs() {
    const el = this.getAttribute('data-trigger');
    document.querySelector(el).click();
  }

  triggerButtons.forEach((triggerButton) => {
    triggerButton.addEventListener('click', triggerAttrs, false);
  });
};

export default trigger;
