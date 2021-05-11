import React, { MouseEventHandler } from 'react';
import styled from '@emotion/styled';

export interface Option {
  value: string;
  text: string;
}

interface Props {
  value?: string;
  disabled?: string;
  options: Option[];
  onChange: (value: string) => void;
}

const SelectBox: React.FC<Props> = ({value, disabled, options = [], onChange}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleSelectClick = React.useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    e.stopPropagation();
    !isOpen && options.length && setIsOpen(true);
  }, [isOpen, setIsOpen, options])
  const handleOptionClick = React.useCallback<MouseEventHandler<HTMLUListElement>>(({target}) => {
    const value = (target as HTMLElement).getAttribute('data-value') ?? '';
    if(value !== disabled) {
      onChange(value);
      setIsOpen(false);
    }
  }, [onChange, setIsOpen, disabled]); 

  const currentText = React.useMemo(() => {
    return options.filter((option) => option.value === value)[0]?.text ?? options[0]?.text ?? '-'
  }, [value, options]);

  const handleBodyClick = React.useCallback((event) => {
    if(wrapperRef.current && wrapperRef.current !== event.target && !wrapperRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, [setIsOpen, wrapperRef]);

  React.useLayoutEffect(() => {
    const body = document.body;
    body.addEventListener('click', handleBodyClick);
    return () => {
      // @ts-ignore
      body.removeEventListener('click', handleBodyClick);
    }
    
  }, [wrapperRef, handleBodyClick]);

  return (
    <SelectBoxDiv 
      ref={wrapperRef}
      onClick={handleSelectClick}
    >
      <SelectText isBlur={!value}>{currentText}</SelectText>
      {isOpen && (
        <OptionBox>
          {options.map((option) => (
            <OptionBoxItem 
              key={option.value} 
              isActive={value === option.value} 
              onClick={handleOptionClick as MouseEventHandler}
              data-value={option.value}
              isDisabled={option.value === disabled}
            >
              {option.text}
            </OptionBoxItem>
          ))}
        </OptionBox>
      )}
    </SelectBoxDiv>
  )
}

SelectBox.displayName = 'SelectBox';
export default React.memo(SelectBox);

const SelectText = styled.p<{isBlur: boolean}>`
  min-width: 50px;
  font-size: 16px;
  color: #333;
  ${({isBlur}) => isBlur && `
    opacity: 0.4;
  `}
`;

const SelectBoxDiv = styled.div`
  position: relative;
  display: inline-flex;
  height: 30px;
  padding: 0 10px;
  cursor: pointer;
  border: 1px solid #333;
  align-items: center;
  justify-content: space-around;

  &::after {
    display: block;
    margin-left: 10px;
    margin-bottom: -5px;
    font-size: 16px;
    content: '▼';
  }
`;

const OptionBox = styled.div`
  position: absolute;
  left: -1px;
  top: calc(100% + 1px);
  width: calc(100% + 2px);
  border: 1px solid #333;
  border-top: 0;
  background-color: #fff;
  z-index: 500;
`;

const OptionBoxItem = styled.li<{isActive: boolean, isDisabled: boolean}>`
  padding: 5px 10px;
  font-size: 16px;
  line-height: 1.5;
  ${({isActive, isDisabled}) => `
    ${isActive && 'background-color: #f0f0f0;'};
    ${isDisabled && 'opacity: 0.4;'};
  `}
  &:hover {
    background-color: #f0f0f0;
  }
`;