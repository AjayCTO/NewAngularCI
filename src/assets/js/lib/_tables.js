/* eslint no-new: 0 */
import Tabulator from 'tabulator-tables';

/**
 * Function to export to theme.js
 *
 * @function tableMove
 */

const tables = () => {
  const html = document.querySelector('html');
  if (html.querySelector('.tabulator')) {
    new Tabulator('.tabulator', {
      height: '500px',
      layout: 'fitDataFill',
      movableColumns: true,
      // pagination: 'local',
      // paginationSize: 10,
      // paginationElement: 'test',
      // footerElement: "<div class='tabulator-footer-statements'></div>",
      // pageLoaded() {
      //   const rowCount = this.getDataCount();
      //   const rows = this.getRows(true);
      //   const currentPage = this.getPage(); // returns the current page
      //   const pageSize = this.getPageSize(); // returns the current number of items per page
      //   const start = (currentPage - 1) * pageSize;
      //   let end = 0;
      //   if (rows.length < currentPage * pageSize) {
      //     end = start + (rows.length % pageSize);
      //   } else {
      //     end = start + pageSize;
      //   }
      //   document.querySelector('.tabulator-footer-statements').innerHTML = `Statements ${start + 1}-${end} of ${rowCount}`;
      // }
    });
  }
};

export default tables;
