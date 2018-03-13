import clamp from '../clamp';

describe('clamp', () => {
  it('returns min with value is less than min', () => {
    expect(clamp(1, 2, 3)).toEqual(2);
  });
  it('returns max with value is bigger than max', () => {
    expect(clamp(5, 2, 3)).toEqual(3);
  });
  it('returns the same value whe it is in the interval', () => {
    expect(clamp(4, 2, 5)).toEqual(4);
  });
});
