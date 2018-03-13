function setInputSelection(input, startPos, endPos) {
  // input.focus();
  if (input.selectionStart !== undefined) {
    input.selectionStart = startPos;
    input.selectionEnd = endPos;
  } else if (document.selection && document.selection.createRange) {
    // IE branch
    input.select();
    const range = document.selection.createRange();
    range.collapse(true);
    range.moveEnd('character', endPos);
    range.moveStart('character', startPos);
    range.select();
  }
}

export default setInputSelection;
