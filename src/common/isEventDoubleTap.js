const dblTouchTapMaxDelay = 300;
let latestTouchTap = {
  time: 0,
  target: null
};

function isEventDoubleTap(event) {
  const touchTap = {
    time: new Date().getTime(),
    target: event.currentTarget
  };
  const isFastDblTouchTap =
    touchTap.target === latestTouchTap.target &&
    touchTap.time - latestTouchTap.time < dblTouchTapMaxDelay;
  latestTouchTap = touchTap;
  return isFastDblTouchTap;
}

export default isEventDoubleTap;
