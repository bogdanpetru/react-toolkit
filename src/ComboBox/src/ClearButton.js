import React from 'react';
import { CloseIcon } from './Icons';

const ClearButton = ({ onClear, className, closeIcon, size }) => {
  const closeIconProps = {
    className,
    size,
    onClick: event => {
      // don't lose focus
      event.preventDefault();
      event.stopPropagation();
      onClear();
    }
  };

  let closeIconEl;
  if (closeIcon && closeIcon !== true) {
    const closeIconParams = {
      onClear,
      domProps: closeIconProps
    };

    closeIconEl =
      typeof closeIcon === 'function' ? closeIcon(closeIconParams) : closeIcon;
  }

  if (closeIconEl === undefined) {
    closeIconEl = <CloseIcon {...closeIconProps} />;
  }

  return closeIconEl;
};

ClearButton.defaultProps = {
  size: 10
};

export default ClearButton;
