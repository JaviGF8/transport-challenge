import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

const calculatePages = ({ maxPages, pagesToShow, actualPage }) => {
  const pagesToRender = [ actualPage ];

  for (let i = 1; i <= pagesToShow; i++) {
    if (pagesToRender.length === pagesToShow) {
      break;
    }

    if (actualPage + i <= maxPages && pagesToShow > pagesToRender.length) {
      pagesToRender.push((actualPage + i).toString());
    }

    if (0 < actualPage - i && pagesToShow > pagesToRender.length) {
      pagesToRender.push((actualPage - i).toString());
    }
  }

  return pagesToRender.sort((a, b) => a - b);
};

const Paginator = ({ className, currentPage, disabled, maxPages, onChange, pagesToShow }) => {
  const [ pagesToRender, setPagesToRender ] = useState([ '1' ]);
  const [ actualPage, setActualPage ] = useState(1);

  useEffect(() => {
    if (maxPages && pagesToShow && actualPage) {
      setPagesToRender(calculatePages({ maxPages, pagesToShow, actualPage }));
    }
  }, [ maxPages, pagesToShow, actualPage ]);
  useEffect(() => {
    setActualPage(parseFloat(currentPage));
  }, [ currentPage ]);

  return (
    <div className={`custom-paginator${className ? ` ${className}` : ''}`}>
      <Button
        className={1 === actualPage ? 'selected' : null}
        disabled={disabled || 1 === actualPage}
        onClick={() => {
          if (onChange && 'function' === typeof onChange) {
            onChange(actualPage - 1);
          }
          setActualPage(parseFloat(actualPage - 1));
        }}
        text="Prev."
      />
      {pagesToRender.map((page) => (
        <Button
          key={page}
          className={actualPage === page ? 'selected' : null}
          disabled={disabled || actualPage === page}
          onClick={() => {
            if (onChange && 'function' === typeof onChange) {
              onChange(page);
            }
            setActualPage(parseFloat(page));
          }}
          text={page}
        />
      ))}
      <Button
        className={maxPages === actualPage ? 'selected' : null}
        disabled={disabled || maxPages === actualPage}
        onClick={() => {
          if (onChange && 'function' === typeof onChange) {
            onChange(actualPage + 1);
          }
          setActualPage(parseFloat(actualPage + 1));
        }}
        text="Next"
      />
    </div>
  );
};

Paginator.defaultProps = {
  className: null,
  currentPage: 1,
  disabled: false,
  maxPages: 1,
  onChange: () => true,
  pagesToShow: 5,
};

Paginator.propTypes = {
  className: PropTypes.string,
  currentPage: PropTypes.number,
  disabled: PropTypes.bool,
  maxPages: PropTypes.number,
  onChange: PropTypes.func,
  pagesToShow: PropTypes.number,
};

export default Paginator;
