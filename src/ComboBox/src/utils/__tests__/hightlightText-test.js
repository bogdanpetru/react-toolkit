import hightlightText from '../hightlightText';

describe('hightlightText', () => {
  it('contains - returns a structure marking the matched text', () => {
    const test = 'hello world';
    const expected = ['hel', { match: 'lo w' }, 'orld'];
    expect(
      hightlightText({
        queryText: 'lo w',
        text: test,
        mode: 'contains'
      })
    ).to.deep.equal(expected);
  });
  it('starts width - returns a structure marking the matched text', () => {
    const text = 'hello world';
    const expected = [{ match: 'hell' }, 'o world'];

    const test = hightlightText({
      text,
      queryText: 'hell',
      mode: 'startsWidth'
    });
    expect(test).to.deep.equal(expected);
  });
});
