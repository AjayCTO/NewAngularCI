/**
 * Function to export to theme.js
 *
 * @function action
 */

const action = () => {
  const html = document.querySelector('html');
  const actionButtons = Array.from(html.querySelectorAll('.js-action'));

  function actionAttrs() {
    const htmlClass = this.getAttribute('data-html-class') ? this.getAttribute('data-html-class') : '-';
    const activeClass = this.getAttribute('data-active-class') ? this.getAttribute('data-active-class') : 'is-active';
    let el;
    html.classList.toggle(htmlClass);

    this.classList.toggle(activeClass);
    const state = this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false';
    this.setAttribute('aria-expanded', state);

    if (this.hasAttribute('data-parent')) {
      el = this.getAttribute('data-parent');
      const parentClass = this.getAttribute('data-parent-class') ? this.getAttribute('data-parent-class') : 'is-active';
      const parent = this.closest(el);
      parent.classList.toggle(parentClass);
      if (this.hasAttribute('data-action')) {
        parent.nextElementSibling.classList.toggle(parentClass);
        if (html.classList.contains('action-is-active')) {
          document.querySelector('.action--is-active .action__close').click();
        }
      }
    }

    if (this.hasAttribute('data-also-trigger')) {
      const also = this.getAttribute('data-also-trigger');
      const alsoClass = this.getAttribute('data-also-class') ? this.getAttribute('data-also-class') : 'is-active';
      this.closest('.table__action').querySelector(also).classList.toggle(alsoClass);
    }

    if (this.hasAttribute('data-clone')) {
      if (this.classList.contains('is-active')) {
        const clone = this.cloneNode(true);
        const cloneTop = this.offsetTop;
        const cloneLeft = this.offsetLeft;
        const attachTo = this.getAttribute('data-clone');
        let classes = '';
        while (clone.attributes.length > 0) {
          if (clone.attributes[0].name === 'class') {
            classes = clone.attributes[0].value;
          }
          clone.removeAttribute(clone.attributes[0].name);
        }
        classes = classes.replace('icons__item', '').replace('js-action', '').replace('is-active', '').replace(/\s/g, '');
        clone.classList.add('icons__item', classes, 'icons__item--clone');
        clone.style.setProperty('top', `${cloneTop}px`);
        clone.style.setProperty('left', `${cloneLeft}px`);
        html.querySelector(attachTo).appendChild(clone);
        setTimeout(() => {
          html.querySelector('.icons__item--clone').classList.add('icons__item--is-active', 'is-active');
        }, 100);
      } else {
        document.querySelector('.icons__item--clone').remove();
      }
    }

    if (this.hasAttribute('data-focus')) {
      el = this.getAttribute('data-focus');
      html.querySelector(el).focus();
    }
  }

  actionButtons.forEach((actionButton) => {
    actionButton.addEventListener('click', actionAttrs, false);
  });
};

export default action;
