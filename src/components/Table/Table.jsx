import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import Paginator from '../base/Paginator';
import Selector from '../base/Selector';

const Table = ({ className, columns, elementKey, elements, notFoundText }) => {
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ end, setEnd ] = useState(1);
  const [ init, setInit ] = useState(1);
  const [ displayedElements, setDisplayedElements ] = useState([]);
  const [ maxPages, setMaxPages ] = useState(20);
  const [ totalDisplayed, setTotalDisplayed ] = useState(20);

  useEffect(() => {
    // On change elements or total displayed
    if (elements && elements.length) {
      setDisplayedElements([ ...elements ].slice(0, totalDisplayed));
      setMaxPages(Math.ceil(elements.length / totalDisplayed));
      setInit(1);
      setEnd(totalDisplayed > elements.length ? elements.length : totalDisplayed);
    }
  }, [ elements, totalDisplayed ]);

  useEffect(() => {
    // On change current page
    if (elements && elements.length) {
      const start = (currentPage - 1) * totalDisplayed;
      const finish = start + totalDisplayed;
      setDisplayedElements([ ...elements ].slice(start, finish));
      setInit(start + 1);
      setEnd(finish > elements.length ? elements.length : finish);
    }
  }, [ currentPage ]);

  return (
    <div className={`custom-table${className ? ` ${className}` : ''}`}>
      <div className="table-content">
        <div>
          <div className="table-header">
            <div className="table-row">
              {columns &&
                0 < columns.length &&
                columns.map((column) => (
                  <div className="table-cell" key={column && column.label}>
                    {column && column.value}
                  </div>
                ))}
            </div>
          </div>
          <div className="table-body">
            {displayedElements && 0 < displayedElements.length ? (
              displayedElements.map((element) => (
                <div
                  key={element && element[elementKey]}
                  className={`table-row fadein${element && element.className ? ` ${element.className}` : ''}`}>
                  {columns &&
                    0 < columns.length &&
                    columns.map((column, idx) => (
                      <div className="table-cell" key={idx}>
                        {element && column.value && element[column.value]}
                      </div>
                    ))}
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>{notFoundText}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {displayedElements && 0 < displayedElements.length && (
        <div className="custom-table-footer">
          <div>
            <p>
              Displaying from {init} to {end}
            </p>
          </div>
          <Paginator currentPage={currentPage} maxPages={maxPages} onChange={setCurrentPage} pagesToShow={3} />
          <Selector
            clearable={false}
            labelKey={null}
            options={[ 5, 10, 20, 50 ]}
            onSelect={setTotalDisplayed}
            searchable={false}
            selected={totalDisplayed}
            valueKey={null}
          />
        </div>
      )}
    </div>
  );
};

Table.defaultProps = {
  className: null,
  columns: [],
  elements: [],
  notFoundText: 'Elements not found',
};

Table.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.array,
  elementKey: PropTypes.string.isRequired,
  elements: PropTypes.array,
  notFoundText: PropTypes.string,
};

export default Table;
