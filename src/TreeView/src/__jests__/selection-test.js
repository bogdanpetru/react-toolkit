/**
 * Copyright (c) 2015-present, Zippy Technologies
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import TreeView from '../TreeView';
import Node from '../Node';
import { mount, shallow } from 'enzyme';

const NESTED_DATA_STRUCTURE = [
  {
    label: 'test 1'
  },
  {
    label: 'test 2',
    nodes: [
      {
        label: 'test 3'
      },
      {
        label: 'test 4'
      },
      {
        label: 'test 5'
      }
    ]
  }
];

describe('selection props', () => {
  describe('enableSelection', () => {
    it('should default to false', () => {
      const wrapper = mount(<TreeView dataSource={NESTED_DATA_STRUCTURE} />);
      expect(wrapper.props().enableSelection).toBe(false);
    });

    it('nodes should not be selected when if false and there is a selection', () => {
      const wrapper = mount(
        <TreeView selected={{ 0: true }} dataSource={NESTED_DATA_STRUCTURE} />
      );

      expect(
        wrapper
          .find(Node)
          .first()
          .props().selected
      ).toBe(undefined);
    });
  });

  describe('selection change by click', () => {
    it('should update selected state correct', () => {
      const wrapper = mount(
        <TreeView enableSelection dataSource={NESTED_DATA_STRUCTURE} />
      );
      wrapper
        .find(Node)
        .at(0)
        .instance()
        .onLabelClick({ stopPropagation: () => {} });
      wrapper
        .find(Node)
        .at(1)
        .instance()
        .onLabelClick({ stopPropagation: () => {} });
      expect(wrapper.state().selected).toEqual({
        '0': true,
        '1': true
      });
    });
  });

  describe('defaultSelected', () => {
    it('should be used as initial state for selected', () => {
      const wrapper = shallow(
        <TreeView
          defaultSelected={{ '0': true }}
          dataSource={NESTED_DATA_STRUCTURE}
        />
      );
      expect(wrapper.state().selected['0']).toBe(true);
    });
  });

  describe('selected', () => {
    it('should not update this.state.selected', () => {
      const wrapper = mount(
        <TreeView selected={{ '0': true }} dataSource={NESTED_DATA_STRUCTURE} />
      );
      const initialState = wrapper.state().selected;
      wrapper
        .find(Node)
        .at(1)
        .instance()
        .onLabelClick({ stopPropagation: () => {} });
      expect(wrapper.state().selected).toEqual(initialState);
    });

    it('should use correct selected state', () => {
      const selected = { '2': true };
      const wrapper = shallow(
        <TreeView
          dataSource={NESTED_DATA_STRUCTURE}
          selected={selected}
          defaultSelected={{ '1': true }}
        />
      );

      expect(wrapper.instance().getCurrentSelectedState()).toEqual(selected);
    });
  });

  describe('singleSelect', () => {
    it('should update state correctly', () => {
      const wrapper = mount(
        <TreeView
          singleSelect
          enableSelection
          defaultSelected={{ '0': true }}
          dataSource={NESTED_DATA_STRUCTURE}
        />
      );

      wrapper
        .find(Node)
        .at(1)
        .instance()
        .onLabelClick({ stopPropagation: () => {} });
      expect(wrapper.state().selected).toEqual({
        '1': true
      });
    });
  });

  describe('onSelectionChange', () => {
    it('should not call onSelectionChange when enableSelection is false', () => {
      const onSelectionChange = jest.fn();
      const wrapper = mount(
        <TreeView
          dataSource={NESTED_DATA_STRUCTURE}
          onSelectionChange={onSelectionChange}
        />
      );

      wrapper
        .find(Node)
        .at(0)
        .instance()
        .onLabelClick({ stopPropagation: () => {} });

      expect(onSelectionChange).toHaveBeenCalledTimes(0);
    });

    it('should call onSelectionChange when is enabled', () => {
      const onSelectionChange = jest.fn();
      const wrapper = mount(
        <TreeView
          enableSelection
          dataSource={NESTED_DATA_STRUCTURE}
          onSelectionChange={onSelectionChange}
        />
      );

      wrapper
        .find(Node)
        .at(0)
        .instance()
        .onLabelClick({ stopPropagation: () => {} });
      expect(onSelectionChange).toHaveBeenCalled();
    });

    it('should call onSelectionChange with correct new selected', () => {
      const onSelectionChange = jest.fn();
      const wrapper = mount(
        <TreeView
          enableSelection
          dataSource={NESTED_DATA_STRUCTURE}
          onSelectionChange={onSelectionChange}
        />
      );
      wrapper.setProps({ enableSelection: true, onSelectionChange });
      wrapper
        .find(Node)
        .at(0)
        .instance()
        .onLabelClick({ stopPropagation: () => {} });
      wrapper
        .find(Node)
        .at(1)
        .instance()
        .onLabelClick({ stopPropagation: () => {} });

      const test = onSelectionChange.mock.calls[1][0];

      expect(test.selected).toBe(true);
      expect(test.path).toEqual('1');
      expect(test.selectedMap).toEqual({
        '0': true,
        '1': true
      });
    });

    describe('getUpdatedDataSource', () => {
      it('should update correctly dataSource', () => {
        let newDataSource;
        const onSelectionChange = ({ getUpdatedDataSource }) => {
          newDataSource = getUpdatedDataSource(
            ({ node, nodeProps, selected }) => {
              node.customPropertyInjecter = true;
            }
          );
        };
        const wrapper = mount(
          <TreeView
            enableSelection
            dataSource={NESTED_DATA_STRUCTURE}
            onSelectionChange={onSelectionChange}
          />
        );

        wrapper
          .find(Node)
          .at(0)
          .instance()
          .onLabelClick({ stopPropagation: () => {} });

        expect(newDataSource).toBeDefined();
        expect(wrapper.state().data).not.toEqual(newDataSource);
        expect(newDataSource[0].customPropertyInjecter).toBe(true);
      });
    });
  });

  describe('isNodeSelected', () => {
    it('should be called with correct props', () => {
      const isNodeSelected = jest.fn();
      const wrapper = mount(
        <TreeView
          enableSelection
          isNodeSelected={isNodeSelected}
          dataSource={NESTED_DATA_STRUCTURE}
        />
      );

      const args = isNodeSelected.mock.calls[0][0];

      expect(isNodeSelected).toHaveBeenCalled();
      expect(args.index).toEqual(0);
    });

    it('should overwrite selection', () => {
      const isNodeSelected = () => false;

      const wrapper = mount(
        <TreeView
          enableSelection
          selected={{ 0: true }}
          isNodeSelected={isNodeSelected}
          dataSource={NESTED_DATA_STRUCTURE}
        />
      );

      const test = wrapper.find(Node).get(0).props.selected;
      expect(test).toBe(false);
    });

    it('should take into account isNodeSelected state when selected changes', () => {
      const isNodeSelected = () => false;
      const onSelectionChange = jest.fn();

      const wrapper = mount(
        <TreeView
          enableSelection
          selected={{ 0: true }}
          isNodeSelected={isNodeSelected}
          dataSource={NESTED_DATA_STRUCTURE}
          onSelectionChange={onSelectionChange}
        />
      );

      wrapper
        .find(Node)
        .at(0)
        .instance()
        .onLabelClick({ stopPropagation: () => {} });
      expect(onSelectionChange.mock.calls[0][0].selectedMap).toEqual({
        0: true
      });
    });
  });
});
