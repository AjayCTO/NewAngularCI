/**
 * Modal Script
 */

const modal = () => {
  const html = document.querySelector('html');
  const modalDivs = Array.from(html.querySelectorAll('.js-modal'));
  const modalClosures = Array.from(html.querySelectorAll('[data-close]'));



  function modalCloseButton() {
    const targetModal = this.getAttribute('data-close');
    html.querySelector(`[data-target-modal="${targetModal}"] > div > .modal__close`).click();
  }



  function modalClose(outerWrap, targetModal) {
    const contents = Array.from(html.querySelector('.modal__content').children);
    contents.forEach((content) => {
      if (!content.classList.contains('modal__close')) {
        html.querySelector(targetModal).appendChild(content);
      }
    });
    outerWrap.remove();
    html.classList.remove('js-modal-page');
  }



  function modalInnerClose(innerWrap, targetModal) {
    const contents = Array.from(html.querySelector('.modal__content--inner').children);
    contents.forEach((content) => {
      if (!content.classList.contains('modal__close')) {
        html.querySelector(targetModal).appendChild(content);
      }
    });
    innerWrap.remove();
  }



  function createInnerModal(el, targetModal) {
    const innerWrap = document.createElement('div');
    innerWrap.setAttribute('class', 'modal__wrap modal__wrap--inner');
    innerWrap.setAttribute('data-target-modal', targetModal);

    const innerContents = Array.from(html.querySelector(targetModal).children);
    const innerModalContent = document.createElement('div');
    innerModalContent.setAttribute('class', 'modal__content modal__content--inner');
    innerContents.forEach((innerContent) => {
      innerModalContent.appendChild(innerContent);
    });

    innerWrap.appendChild(innerModalContent);
    el.closest('.form__section').appendChild(innerWrap);

    const innerClose = document.createElement('div');
    innerClose.setAttribute('class', 'modal__close');
    innerClose.innerHTML = '<button type="button">Close</button>';
    innerClose.addEventListener('click', () => {
      modalInnerClose(innerWrap, targetModal);
    });
    innerModalContent.appendChild(innerClose);
  }



  function modalFire() {
    const targetModal = this.getAttribute('data-modal');
    if (html.classList.contains('js-modal-page')) {
      createInnerModal(this, targetModal);
      return;
    }
    html.classList.add('js-modal-page');

    const outerWrap = document.createElement('div');
    outerWrap.setAttribute('class', 'modal');

    const wrap = document.createElement('div');
    wrap.setAttribute('class', 'modal__wrap');
    wrap.setAttribute('data-target-modal', targetModal);

    const contents = Array.from(html.querySelector(targetModal).children);
    const modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modal__content');
    contents.forEach((content) => {
      modalContent.appendChild(content);
    });

    wrap.appendChild(modalContent);

    const close = document.createElement('div');
    close.setAttribute('class', 'modal__close');
    close.innerHTML = '<button type="button">Close</button>';
    close.addEventListener('click', () => {
      modalClose(outerWrap, targetModal);
    });
    // html.querySelector('[data-close="#testModal"]').addEventListener('click', () => {
    //   modalClose(outerWrap, targetModal);
    // });
    modalContent.appendChild(close);

    outerWrap.appendChild(wrap);
    document.body.appendChild(outerWrap);
  }



  modalDivs.forEach((modalDiv) => {
    modalDiv.addEventListener('click', modalFire, false);
  });



  modalClosures.forEach((modalClosure) => {
    modalClosure.addEventListener('click', modalCloseButton, false);
  });

};

export default modal;
