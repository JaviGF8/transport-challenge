import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Input from '../Input';
import OutsideClick from '../OutsideClick';

const Selector = ({
  className,
  clearable,
  disabled,
  labelKey,
  onSelect,
  options,
  placeholder,
  searchable,
  selected,
  valueKey,
}) => {
  const [ inputValue, setInputValue ] = useState('');
  const [ filtered, setFiltered ] = useState(options || []);
  const [ selectedOption, setSelectedOption ] = useState(selected);
  const [ visible, setVisible ] = useState(false);
  const [ optionsWidth, setOptionsWidth ] = useState(null);

  const divRef = useCallback((node) => {
    if (node && node.getBoundingClientRect) {
      setOptionsWidth(node.getBoundingClientRect().width);
    }
  });

  const outsideRef = useRef();

  OutsideClick(outsideRef, () => {
    if (visible) {
      setVisible(false);
    }
  });

  useEffect(() => {
    // On change input value or options
    let filteredOptions = options ? [ ...options ] : [];

    if (selectedOption) {
      setSelectedOption(null);
    }
    if (inputValue) {
      let label = null;
      filteredOptions = options.filter((option) => {
        label = labelKey && option[labelKey] ? option[labelKey] : option;
        return (
          label &&
          label.toString().toLowerCase &&
          -1 <
            label
              .toString()
              .toLowerCase()
              .indexOf(inputValue.toString().toLowerCase())
        );
      });
    }

    setFiltered(filteredOptions);
  }, [ inputValue, options ]);

  useEffect(() => {
    // On change selected option
    if (selectedOption) {
      setVisible(false);
      if (onSelect && 'function' === typeof onSelect) {
        onSelect(selectedOption, valueKey && selectedOption && selectedOption[valueKey]);
      }
    }
  }, [ selectedOption ]);

  useEffect(() => {
    // On change selected
    if (selected) {
      const val = (labelKey && selected[labelKey]) || selected;

      setSelectedOption(val);
    }
  }, [ selected ]);

  const value =
    selected || (!labelKey && selectedOption) || (selectedOption && labelKey && selectedOption[labelKey]) || inputValue;

  return (
    <div
      className={`custom-selector${className ? ` ${className}` : ''}${disabled ? ' disabled' : ''}`}
      ref={divRef}
      onClick={() => setVisible(true)}>
      <div ref={outsideRef}>
        <div className="custom-selector-input">
          <Input
            className={`${disabled ? 'disabled' : ''}`}
            disabled={!searchable || disabled}
            onChange={(val) => {
              setInputValue(val);
            }}
            onFocus={() => setVisible(true)}
            placeholder={placeholder}
            value={value}
          />
          {clearable && (
            <button
              className={`clear-btn${value ? ' visible' : ''}`}
              onClick={() => {
                setVisible(false);
                setSelectedOption(null);
                setInputValue('');
                if (onSelect && 'function' === typeof onSelect) {
                  onSelect();
                }
              }}
              type="button">
              x
            </button>
          )}
        </div>
        <div
          className={`custom-selector-options fadein${visible ? ' visible shadow' : ''}`}
          style={{ width: optionsWidth }}>
          {filtered &&
            0 < filtered.length &&
            filtered.map((option, idx) => (
              <div
                key={(valueKey && option[valueKey]) || idx}
                className="custom-selector-option"
                onClick={() => {
                  setSelectedOption(option);
                }}>
                <p>{(labelKey && option[labelKey]) || option}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

Selector.defaultProps = {
  className: null,
  clearable: true,
  disabled: false,
  labelKey: 'label',
  onSelect: () => true,
  options: [],
  placeholder: null,
  searchable: true,
  selected: null,
  valueKey: 'value',
};

Selector.propTypes = {
  className: PropTypes.string,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  labelKey: PropTypes.string,
  onSelect: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  searchable: PropTypes.bool,
  selected: PropTypes.any,
  valueKey: PropTypes.string,
};

export default Selector;
