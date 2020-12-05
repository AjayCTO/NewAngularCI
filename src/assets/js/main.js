import '@babel/polyfill';
import toggle from './lib/_toggle';
import action from './lib/_action';
import trigger from './lib/_trigger';
import modal from './lib/_modal';
import tables from './lib/_tables';
import inputFocus from './lib/_inputFocus';
import inputClear from './lib/_inputClear';
import datePicker from './lib/_datePicker';
import dropdown from './lib/_dropdown';

// import toggle from './lib/_toggle';
// import action from './lib/_action';
// import trigger from './lib/_trigger';
// import modal from './lib/_modal';
// import tables from './lib/_tables';
// import inputFocus from './lib/_inputFocus';
// import inputClear from './lib/_inputClear';
// import datePicker from './lib/_datePicker';
// import dropdown from './lib/_dropdown';


document.onreadystatechange = () => {

  switch (document.readyState) {

    case 'loading':
      // The document is still loading.
      break;
    case 'interactive':
      // The document has finished loading. We can now access the DOM elements.
      // But sub-resources such as images, stylesheets and frames are still loading.
      break;
    case 'complete':

      // The page is fully loaded.
      toggle();
      action();
      trigger();
      modal();
      tables();
      inputFocus();
      inputClear();
      datePicker();
      dropdown();
      document.querySelector('html').classList.remove('no-js');
      document.querySelector('body').classList.remove('preload');

      break;
    default:
      break;
  }
};
