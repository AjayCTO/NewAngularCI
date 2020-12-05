import CustomSelect from './_vanillaJsDropdown';

const dropdown = () => {
  if (!document.querySelectorAll('.form__select').length > 0) return false;

  const html = document.querySelector('html');
  const selects = Array.from(html.querySelectorAll('.form__select'));

  selects.forEach((select) => {
    CustomSelect({
      elem: select
    });
  });
};

export default dropdown;
