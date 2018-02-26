import React from 'react';
import Tag from '../Tag';
import { mount } from 'enzyme';

describe('tag', () => {
  describe('border', () => {
    it('adds border on style', () => {
      const wrapper = mount(<Tag border="1px solid red" />);
      expect(
        wrapper
          .find('div')
          .at(0)
          .props().style.border
      ).to.equal('1px solid red');
    });
  });
  describe('padding', () => {
    it('adds padding on style', () => {
      const wrapper = mount(<Tag padding={20} />);
      expect(
        wrapper
          .find('div')
          .at(0)
          .props().style.padding
      ).to.equal(20);
    });
  });
  describe('width', () => {
    it('adds width on style', () => {
      const wrapper = mount(<Tag width={20} />);
      expect(
        wrapper
          .find('div')
          .at(0)
          .props().style.width
      ).to.equal(20);
    });
  });
  describe('height', () => {
    it('adds height on style', () => {
      const wrapper = mount(<Tag height={20} />);
      expect(
        wrapper
          .find('div')
          .at(0)
          .props().style.height
      ).to.equal(20);
    });
  });
  describe('style', () => {
    it('gets added on tag', () => {
      const wrapper = mount(<Tag style={{ color: 'red' }} />);
      expect(
        wrapper
          .find('div')
          .at(0)
          .props().style.color
      ).to.equal('red');
    });
  });
});
