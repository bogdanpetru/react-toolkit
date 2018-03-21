import getLabelWrapperSize from './getLabelWrapperSize';

/** label wrapper must have the full width of
 * the progressbar in some cases (see getWrappersStyles)
 * so oposite label is placed in the right position
 **/

function getWrappersStyles({
  labelPosition,
  dimension,
  fillSize,
  remainingSize,
  parentSize
}) {
  /**
   * one of the label wrapper will have
   * a size in % equal to the entire with of the component
   * so we can have different label color for each part
   */
  let fillLabelWrapperStyle;
  let remainingLabelWrapperStyle;

  /**
   * on fill/remianing relativ positions
   * labelWrapper needs to have the same dimension
   * as portion that has label.
   * e.g. fillCenter, must have labelWrapper 100%
   */
  if (labelPosition === 'fillCenter' || labelPosition === 'fillEnd') {
    fillLabelWrapperStyle = {
      [dimension]: `100%`
    };
    remainingLabelWrapperStyle = {
      [dimension]: parentSize //`${getLabelWrapperSize(remainingSize)}%`
    };
  } else if (
    labelPosition === 'remainingCenter' ||
    labelPosition === 'remainingStart'
  ) {
    fillLabelWrapperStyle = {
      [dimension]: parentSize //`${getLabelWrapperSize(fillSize)}%`
    };
    remainingLabelWrapperStyle = {
      [dimension]: `100%`
    };
  } else {
    fillLabelWrapperStyle = {
      [dimension]: parentSize //`${getLabelWrapperSize(fillSize)}%`
    };
    remainingLabelWrapperStyle = {
      [dimension]: parentSize //`${getLabelWrapperSize(remainingSize)}%`
    };
  }

  return {
    fillLabelWrapperStyle,
    remainingLabelWrapperStyle
  };
}

export default getWrappersStyles;
