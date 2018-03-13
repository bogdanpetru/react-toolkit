import React from 'react';
import { mount } from 'enzyme';
import Node from '../../Node';

describe('node.icon', () => {
  it('should render jsx', () => {
    const wrapper = mount(
      <Node node={{ label: 'test', icon: <div id="customIcon" /> }} />
    );
    expect(wrapper.find('#customIcon')).toHaveLength(1);
  });
  it('should render what it return when it is a function', () => {
    const wrapper = mount(
      <Node
        index={20}
        node={{
          label: 'test',
          icon: ({ index }) => <div id={`test-${index}`} />
        }}
      />
    );

    expect(wrapper.find('#test-20')).toHaveLength(1);
  });
});
