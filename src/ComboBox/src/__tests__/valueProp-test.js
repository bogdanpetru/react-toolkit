import React from 'react';
import { shallow, mount } from 'enzyme';

import Combo from '../ComboBox';
import Item from '../List/Item';

const dataSource = [
  { id: 1, label: 'test1' },
  { id: 2, label: 'test2' },
  { id: 3, label: 'test3' }
];

describe('value props', () => {
  describe('defaultValue', () => {
    it('should be used as initial state', () => {
      const wrapper = shallow(<Combo defaultValue={20} />);
      expect(wrapper.instance().getValue()).to.equal(20);
    });
  });

  describe('value', () => {
    it('should be used insted of state', () => {
      const wrapper = shallow(<Combo defaultValue={20} value={30} />);
      expect(wrapper.instance().getValue()).to.equal(30);
    });
    it("doesn't change when a change is triggered", () => {
      const wrapper = shallow(<Combo defaultValue={20} value={30} />);
      wrapper.instance().setValue(55);
      expect(wrapper.instance().getValue()).to.equal(30);
      // state should not be changed
      expect(wrapper.state().value).to.equal(20);
    });
    it('renders what is inside label key when an object', () => {
      const wrapper = mount(
        <Combo
          multiple
          value={[
            {
              label: <div id="valueLabel">hello world</div>
            }
          ]}
        />
      );
      expect(wrapper.find('#valueLabel')).to.have.length(1);
    });
  });

  describe('onChange', () => {
    it('should be called when setValue is called', () => {
      const onChange = sinon.spy();
      const wrapper = shallow(
        <Combo defaultValue={20} value={30} onChange={onChange} />
      );
      wrapper.instance().setValue(55);
      expect(onChange.called).to.be.true;
      expect(onChange.args[0][0]).to.equal(55);
    });
  });

  describe('value change', () => {
    it('multiple adds correct values', () => {
      const wrapper = shallow(<Combo multiple dataSource={dataSource} />);
      wrapper.instance().handleItemClick(1);
      expect(wrapper.instance().getValue()).to.deep.equal([1]);
      wrapper.instance().handleItemClick(1);
      expect(wrapper.instance().getValue()).to.equal(null);
      wrapper.instance().handleItemClick(1);
      wrapper.instance().handleItemClick(3);
      expect(wrapper.instance().getValue()).to.deep.equal([1, 3]);
    });
  });

  describe('isSelectedItemValid', () => {
    it('filters out invalid values', () => {
      const isSelectedItemValid = ({ id }) => id !== 2; // 2 is not allowed
      const wrapper = shallow(
        <Combo
          multiple
          dataSource={dataSource}
          defaultValue={[1, 3]}
          isSelectedItemValid={isSelectedItemValid}
        />
      );
      const instance = wrapper.instance();
      expect(instance.getValue()).to.deep.equal([1, 3]);
      instance.selectItem(2);
      expect(instance.getValue()).to.deep.equal([1, 3]);
    });
  });

  describe('clear', () => {
    it('sets value and text to null', () => {
      const wrapper = mount(
        <Combo searchable defaultText="hello world" defaultValue={['test']} />
      );
      const instance = wrapper.instance();
      expect(instance.getValue()).to.deep.equal(['test']);
      expect(instance.getText()).to.deep.equal('hello world');
      instance.clear();
      expect(instance.getValue()).to.deep.equal(null);
      expect(instance.getText()).to.deep.equal(null);
    });
  });

  describe('changeValueOnNavigation', () => {
    it('changes value when active item changes', () => {
      const wrapper = shallow(
        <Combo
          searchable
          changeValueOnNavigation
          multiple={false}
          dataSource={dataSource}
          defaultValue={1}
          defaultActiveItem={1}
          expanded
        />
      );
      wrapper.instance().navigateToNextItem(1);
      expect(wrapper.instance().getValue()).to.equal(2);
    });
  });

  describe('allowSelectionToggle', () => {
    it('only when it is true allows single value deselection', () => {
      const wrapper = shallow(
        <Combo
          dataSource={dataSource}
          multiple={false}
          defaultValue={1}
          allowSelectionToggle={false}
        />
      );
      wrapper.instance().selectItem(1);
      expect(wrapper.instance().getValue()).to.equal(1);
    });
  });

  describe('clearValueOnEmpty', () => {
    it('clears value when text is cleared, on single value', () => {
      const wrapper = shallow(
        <Combo
          clearValueOnEmpty
          defaultValue={20}
          multiple={false}
          defaultText="hello world"
        />
      );
      expect(wrapper.instance().getValue()).to.equal(20);
      wrapper.instance().setText('');
      expect(wrapper.instance().getValue()).to.be.null;
    });
  });

  describe('allowCustomTagCreation', () => {
    it('when text is entered and no item matched the search, by pressing enter a new value is created', () => {
      const wrapper = mount(
        <Combo
          allowCustomTagCreation
          dataSource={[{ id: 1, label: 'test' }]}
          defaultValue={null}
          defaultText={'hello world'}
          multiple={false}
        />
      );
      expect(wrapper.instance().getValue()).to.be.null;
      wrapper.simulate('keyDown', { key: 'Enter' });
      expect(wrapper.instance().getValue()).to.equal('hello world');
    });
  });
});
