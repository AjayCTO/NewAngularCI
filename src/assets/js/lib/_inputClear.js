/**
 * Clear inputs with a button
 * eg:
 * <button type="button" class="js-clear" data-field-to-clear="#search">
 *   <div class="icons__icon"><?php the_svg('icon--remove'); ?></div>
 * </button>
 */

const inputClear = () => {
  if (!document.querySelectorAll('.js-clear').length > 0) return false;

  const html = document.querySelector('html');
  const clearButtons = Array.from(html.querySelectorAll('.js-clear'));

  function clearValues() {
    const targetInput = this.getAttribute('data-field-to-clear');
    console.log(targetInput);
    html.querySelector(targetInput).value = '';
    html.querySelector(targetInput).focus();
  }



  clearButtons.forEach((clearButton) => {
    clearButton.addEventListener('click', clearValues, false);
  });
};

export default inputClear;
