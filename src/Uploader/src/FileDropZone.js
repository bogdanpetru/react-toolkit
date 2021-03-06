/**
 * Copyright (c) 2015-present, Zippy Technologies
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from '@zippytech/react-class/autoBind';
import cleanProps from '../../common/cleanProps';

import join from '../../common/join';
import shouldComponentUpdate from '../../common/shouldComponentUpdate';

import FileDroppable from './FileDroppable';

import {
  hocDefaultProps,
  hocPropTypes,
  fdzDefaultProps,
  fdzPropTypes
} from './props';

import { FileListPropTypes } from './Filelist/src/FileList';

import pickProps from './utils/pick-props';

import {
  FileDropZoneRenderer,
  WrappedFileDropZoneRenderer
} from './FileDropZoneRenderer';

/**
 * File DropZone switcher component
 * ========================================================================
 */

class FileDropZone extends Component {
  constructor(props, context) {
    super(props, context);
    autoBind(this);

    this.state = { isValid: null };
  }

  componentWillReceiveProps() {
    const forwardProp = this._fileDZ && this._fileDZ.getForwardProp();
    const { isValid, acceptInvalid } = forwardProp;
    this.setState({ isValid, acceptInvalid });
  }

  setDropZoneRef(el) {
    this._fileDZ = el;
  }

  clearFiles() {
    return this._fileDZ.clearFiles && this._fileDZ.clearFiles();
  }

  getTotalFileSize() {
    return this._fileDZ.getTotalFileSize && this._fileDZ.getTotalFileSize();
  }

  getFileNames() {
    return this._fileDZ.getFileNames && this._fileDZ.getFileNames();
  }

  getFiles() {
    return this._fileDZ.getFiles && this._fileDZ.getFiles();
  }

  removeFileAt(idx) {
    return this._fileDZ.removeFileAt && this._fileDZ.removeFileAt(idx);
  }

  removeFile(id) {
    return this._fileDZ.removeFile && this._fileDZ.removeFile(id);
  }

  addFiles(files) {
    return this._fileDZ.addFiles && this._fileDZ.addFiles(files);
  }

  revalidateFiles() {
    return this._fileDZ.revalidateFiles && this._fileDZ.revalidateFiles();
  }

  render() {
    const { props } = this;
    const { noEvents, uploadProgress, i18n } = props;

    const fileDropZoneSpecificProps = pickProps(
      this.props,
      FileDropZone.propTypes
    );
    const hocSpecificProps = cleanProps(this.props, hocPropTypes);
    if (noEvents) {
      return (
        <FileDropZoneRenderer
          {...fileDropZoneSpecificProps}
          forwardProp={hocSpecificProps}
          i18n={i18n}
          connected={props.connected}
          ref={this.setDropZoneRef}
        />
      );
    }
    // fileRef in constructor
    return <WrappedFileDropZoneRenderer ref={this.setDropZoneRef} {...props} />;
  }
}

FileDropZone.defaultProps = {
  ...hocDefaultProps,
  ...fdzDefaultProps
};

FileDropZone.propTypes = {
  connected: PropTypes.bool,

  i18n: PropTypes.object,
  ...FileListPropTypes,
  ...hocPropTypes,
  ...fdzPropTypes
};

export default FileDropZone;
export { FileDropZoneRenderer, FileDroppable };
