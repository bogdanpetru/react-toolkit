import React from 'react';
import TreeView from '../TreeView';
import Node from '../Node';
import { shallow, mount } from 'enzyme';

const CLASS_NAME = TreeView.defaultProps.rootClassName;

describe('async nodes', () => {
  it('calls loadNode when a node is expanded', () => {
    const loadNode = jest.fn();
    const wrapper = mount(
      <TreeView
        dataSource={[{ label: 'test', async: true, nodes: [] }]}
        collapsed={{ '0': true }}
        loadNode={loadNode}
      />
    );

    wrapper
      .find(Node)
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
      .at(0)
      .instance()
      .onExpanderClick({
        stopPropagation: () => {}
      });
    expect(loadNode).toHaveBeenCalled();
=======
      .get(0)
      .onExpanderClick({
        stopPropagation: () => {}
      });
    expect(loadNode.called).to.be.true;
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
  });

  it('loadNode should update dataSource', () => {
    const asyncNodes = [{ label: 'async loaded' }];
    const loadNode = () => asyncNodes;

    const dataSource = [
      {
        label: 'test loadNode',
        async: true,
        nodes: []
      }
    ];

    const wrapper = mount(
      <TreeView
        dataSource={dataSource}
        collapsed={{ '0': true }}
        loadNode={loadNode}
        isNodeAsync={() => true}
      />
    );

    wrapper
      .find(Node)
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
      .at(0)
      .instance()
=======
      .get(0)
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
      .onExpanderClick({
        stopPropagation: () => {}
      });

    expect(wrapper.state().data[0].nodes).toEqual(asyncNodes);
  });

  it('should work with a promise', done => {
    const asyncNodes = [{ label: 'async loaded' }];
    const loadNode = ({ path, node }) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(asyncNodes);
        }, 50);
      });
    };
    const dataSource = [
      {
        label: 'test loadNode',
        async: true,
        nodes: []
      }
    ];
    const wrapper = mount(
      <TreeView
        dataSource={dataSource}
        collapsed={{ '0': true }}
        loadNode={loadNode}
        isNodeAsync={() => true}
      />
    );

    wrapper
      .find(Node)
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
      .at(0)
      .instance()
=======
      .get(0)
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
      .onExpanderClick({
        stopPropagation: () => {}
      });

    setTimeout(() => {
      const test = wrapper.state().data[0].nodes;
      expect(test).toEqual(asyncNodes);

      done();
    }, 100);
  });

  it('should update nodeLoading with the corret node, if it returns a promise', done => {
    const dataSource = [
      {
        label: 'test loadNode',
        async: true,
        nodes: []
      }
    ];

    const loadNode = () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(null);
        }, 50);
      });
    };

    const wrapper = mount(
      <TreeView
        dataSource={dataSource}
        collapsed={{ '0': true }}
        loadNode={loadNode}
        isNodeAsync={() => true}
      />
    );

    wrapper
      .find(Node)
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
      .at(0)
      .instance()
=======
      .get(0)
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
      .onExpanderClick({
        stopPropagation: () => {}
      });

<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
    expect(wrapper.state().nodesLoading['0']).toBe(true);
    // expect(
    //   wrapper
    //     .find(Node)
    //     .first()
    //     .props().loading
    // ).toBe(true);
=======
    expect(wrapper.state().nodesLoading['0']).to.be.true;
    expect(
      wrapper
        .find(Node)
        .first()
        .props().loading
    ).to.be.true;
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js

    setTimeout(() => {
      expect(wrapper.state().nodesLoading['0']).toBe(false);
      done();
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
    }, 150);
  });

  it('should be called every time a node is expanded', () => {
    const loadNode = jest.fn();
    const dataSource = [
      {
        label: 'test loadNode',
        async: true,
        nodes: []
      }
    ];
    const wrapper = mount(
      <TreeView
        dataSource={dataSource}
        collapsed={{ '0': true }}
        loadNode={loadNode}
      />
    );

    // it is called every time because
    // collapsed is controlled and it doesn't really change state
    wrapper
      .find(Node)
      .at(0)
      .instance()
      .onExpanderClick({ stopPropagation: () => {} });
    wrapper
      .find(Node)
      .at(0)
      .instance()
      .onExpanderClick({ stopPropagation: () => {} });
    wrapper
      .find(Node)
      .at(0)
      .instance()
      .onExpanderClick({ stopPropagation: () => {} });

    expect(loadNode).toHaveBeenCalledTimes(3);
=======
    }, 50);

    it('should be called every time a node is expanded', () => {
      const loadNode = sinon.spy();
      const dataSource = [
        {
          label: 'test loadNode',
          async: true,
          nodes: []
        }
      ];
      const wrapper = mount(
        <TreeView
          dataSource={dataSource}
          collapsed={{ '0': true }}
          loadNode={loadNode}
        />
      );

      // it is called every time because
      // collapsed is controlled and it doesn't really change state
      wrapper
        .find(Node)
        .get(0)
        .onExpanderClick({ stopPropagation: () => {} });
      wrapper
        .find(Node)
        .get(0)
        .onExpanderClick({ stopPropagation: () => {} });
      wrapper
        .find(Node)
        .get(0)
        .onExpanderClick({ stopPropagation: () => {} });

      expect(loadNode.calledThrice).to.be.true;
    });
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
  });

  it('should call loadNondeOnce', () => {
    const loadNodeOnce = jest.fn();
    const dataSource = [
      {
        label: 'test loadNodeOnce',
        nodes: null
      }
    ];
    const wrapper = mount(
      <TreeView
        dataSource={dataSource}
        collapsed={{ '0': true }}
        loadNodeOnce={loadNodeOnce}
      />
    );

    // it is called every time because
    // collapsed is controlled and it doesn't really change state
    wrapper
      .find(Node)
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
      .at(0)
      .instance()
      .onExpanderClick({ stopPropagation: () => {} });
    wrapper
      .find(Node)
      .at(0)
      .instance()
      .onExpanderClick({ stopPropagation: () => {} });
    wrapper
      .find(Node)
      .at(0)
      .instance()
      .onExpanderClick({ stopPropagation: () => {} });

    expect(loadNodeOnce).toHaveBeenCalledTimes(1);
=======
      .get(0)
      .onExpanderClick({ stopPropagation: () => {} });
    wrapper
      .find(Node)
      .get(0)
      .onExpanderClick({ stopPropagation: () => {} });
    wrapper
      .find(Node)
      .get(0)
      .onExpanderClick({ stopPropagation: () => {} });

    expect(loadNodeOnce.calledOnce).to.be.true;
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
  });

  it('should call loadNondeOnce first time and the folowing expand change loadNode', () => {
    const loadNode = jest.fn();
    const loadNodeOnce = jest.fn();

    const dataSource = [
      {
        label: 'test loadNode',
        nodes: null
      }
    ];
    const wrapper = mount(
      <TreeView
        dataSource={dataSource}
        collapsed={{ '0': true }}
        loadNode={loadNode}
        loadNodeOnce={loadNodeOnce}
      />
    );

    // it is called every time because
    // collapsed is controlled and it doesn't really change state
    wrapper
      .find(Node)
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
      .at(0)
      .instance()
      .onExpanderClick({ stopPropagation: () => {} });

    expect(loadNode).toHaveBeenCalledTimes(0);
    expect(loadNodeOnce).toHaveBeenCalledTimes(1);

    wrapper
      .find(Node)
      .at(0)
      .instance()
      .onExpanderClick({ stopPropagation: () => {} });
    wrapper
      .find(Node)
      .at(0)
      .instance()
      .onExpanderClick({ stopPropagation: () => {} });

    expect(loadNode).toHaveBeenCalledTimes(2);
    expect(loadNodeOnce).toHaveBeenCalledTimes(1);
=======
      .get(0)
      .onExpanderClick({ stopPropagation: () => {} });

    expect(loadNode.called).to.be.false;
    expect(loadNodeOnce.called).to.be.true;

    wrapper
      .find(Node)
      .get(0)
      .onExpanderClick({ stopPropagation: () => {} });
    wrapper
      .find(Node)
      .get(0)
      .onExpanderClick({ stopPropagation: () => {} });

    expect(loadNode.calledTwice).to.be.true;
    expect(loadNodeOnce.calledOnce).to.be.true;
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
  });

  it("removes loader and nodes don't change if promise is rejected", done => {
    const loadNode = () =>
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(null);
        }, 50);
      });
    const nodes = [];
    const dataSource = [
      {
        label: 'test loadNode',
        nodes: nodes
      }
    ];

    const wrapper = mount(
      <TreeView
        dataSource={dataSource}
        collapsed={{ '0': true }}
        loadNode={loadNode}
      />
    );

    wrapper
      .find(Node)
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
      .at(0)
      .instance()
      .onExpanderClick({ stopPropagation: () => {} });
    expect(wrapper.state().nodesLoading[0]).toBe(true);
=======
      .get(0)
      .onExpanderClick({ stopPropagation: () => {} });
    expect(wrapper.state().nodesLoading[0]).to.be.true;
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
    setTimeout(() => {
      expect(wrapper.state().nodesLoading[0]).toBe(false);
      expect(wrapper.state().data[0].nodes).toEqual(nodes);
      done();
    }, 100);
  });

  it('calls onNodeLoad when promise is resolved', done => {
    const loadNode = () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(null);
        }, 50);
      });
    const onNodeLoad = jest.fn();
    const nodes = [];
    const dataSource = [
      {
        label: 'test loadNode',
        async: true,
        nodes: nodes
      }
    ];

    const wrapper = mount(
      <TreeView
        dataSource={dataSource}
        collapsed={{ '0': true }}
        loadNode={loadNode}
        onNodeLoad={onNodeLoad}
        isNodeAsync={() => true}
      />
    );

    wrapper
      .find(Node)
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
      .at(0)
      .instance()
=======
      .get(0)
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
      .onExpanderClick({ stopPropagation: () => {} });

    expect(onNodeLoad).toHaveBeenCalledTimes(0);
    setTimeout(() => {
      expect(onNodeLoad).toHaveBeenCalledTimes(1);
      done();
    }, 100);
  });

  it('should not call isNodeAsync if loadNode or loadNodeOnce is not defined', () => {
    const isNodeAsync = jest.fn();
    const wrapper = shallow(
      <TreeView
        dataSource={[{ label: 'test' }]}
        isNodeAsync={isNodeAsync}
        defaultCollapsed={{ '0': true }}
      />
    );

    wrapper.instance().expandNode('0');
    expect(isNodeAsync).toHaveBeenCalledTimes(0);
  });

  it('should call isNodeAsync if loadNode or loadNodeOnce is defined', () => {
    const isNodeAsync = jest.fn();
    const wrapper = shallow(
      <TreeView
        isNodeAsync={isNodeAsync}
        defaultCollapsed={{ '0': true }}
        dataSource={[{ label: 'test' }]}
        loadNode={({ node }) => node.nodes}
      />
    );

    wrapper.instance().expandNode('0');
    expect(isNodeAsync).toHaveBeenCalled();
  });

  it('should have on props async if node.async is true', () => {
    const wrapper = shallow(
      <TreeView
        dataSource={[{ label: 'test', async: true }]}
        loadNode={() => {}}
      />
    );

    expect(
      wrapper
        .find(Node)
        .first()
        .props().async
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
    ).toBe(true);
=======
    ).to.be.true;
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
  });

  it('should have on props what isNodeAsync returns and should overwrite node.async', () => {
    const wrapper = shallow(
      <TreeView
        dataSource={[{ label: 'test', async: false }]}
        isNodeAsync={() => true}
        loadNode={() => {}}
      />
    );

    expect(
      wrapper
        .find(Node)
        .first()
        .props().async
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
    ).toBe(true);
=======
    ).to.be.true;
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
  });

  it('should consider a node to have children if the node is async', () => {
    const wrapper = shallow(
      <TreeView
        dataSource={[{ label: 'test', async: true }]}
        defaultCollapsed={{ '0': true }}
        loadNode={({ node }) => node.nodes}
      />
    );

    expect(
      wrapper
        .find(Node)
        .first()
        .props().hasChildren
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
    ).toBe(true);
=======
    ).to.be.true;
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
  });

  it('should call loadNode/loadNodeOnce only on node that is async', () => {
    const loadNode = jest.fn();
    const loadNodeOnce = jest.fn();
    const wrapper = shallow(
      <TreeView
        loadNode={loadNode}
        loadNodeOnce={loadNodeOnce}
        isNodeAsync={() => false}
        dataSource={[{ label: 'test' }]}
      />
    );

    wrapper.instance().expandNode('0');
    wrapper.instance().expandNode('0');
    expect(loadNode).toHaveBeenCalledTimes(0);
    expect(loadNodeOnce).toHaveBeenCalledTimes(0);
  });

  it('if loadNode is defined, all nodes are async, and overwrites loadAsyncNode', () => {
    const loadNode = jest.fn();
    const loadNodeOnce = jest.fn();
    const wrapper = mount(
      <TreeView
        loadNode={loadNode}
        loadNodeOnce={loadNodeOnce}
        dataSource={[
          {
            label: 'test',
            nodes: [{ label: 'test' }]
          }
        ]}
      />
    );

    expect(
      wrapper
        .find(Node)
        .first()
        .props().async
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
    ).toBe(true);
=======
    ).to.be.true;
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
    expect(
      wrapper
        .find(Node)
        .at(1)
        .props().async
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
    ).toBe(true);
=======
    ).to.be.true;
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
  });

  xit('should consider node async only if node.nodes === null when loadNodeOnce is specified and loadNode is not', () => {
    const loadNode = jest.fn();
    const loadNodeOnce = jest.fn();
    const wrapper = mount(
      <TreeView
        loadNode={loadNode}
        loadNodeOnce={loadNodeOnce}
        dataSource={[
          {
            label: 'test',
            nodes: [
              {
                label: 'test',
                nodes: null
              }
            ]
          }
        ]}
      />
    );

<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
    const firstNode = wrapper.find(Node).at(0);

    console.log(firstNode.props());
    expect(firstNode.props().async).toBe(false);
=======
    expect(
      wrapper
        .find(Node)
        .first()
        .props().async
    ).to.be.falsey;
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
    expect(
      wrapper
        .find(Node)
        .at(1)
        .props().async
<<<<<<< HEAD:src/TreeView/src/__jests__/asyncNodes-test.js
    ).toBe(true);
=======
    ).to.be.true;
>>>>>>> dev:src/TreeView/src/__tests__/asyncNodes-test.js
  });
});
