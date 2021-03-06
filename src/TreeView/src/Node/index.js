/**
 * Copyright (c) 2015-present, Zippy Technologies
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, cloneElement } from 'react';

import PropTypes from 'prop-types';
import autoBind from '@zippytech/react-class/autoBind';
import assign from '../../../common/assign';
import ExpandTool from './ExpandTool';
import LoadTool from './LoadTool';
import cleanProps from '../../../common/cleanProps';
import join from '../../../common/join';
import pxToFloat from '../../../common/pxToFloat';
import shouldComponentUpdate from '../../../common/shouldComponentUpdate';
import Check from '../../../CheckBox';

class ZippyNode extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      showContent: !this.props.collapsed
    };

    this.componentIsMounted = true;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldComponentUpdate(this, nextProps, nextState);
  }

  componentWillUnmount() {
    this.componentIsMounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.transition) {
      this.startExpandTransitionIfNecessary(nextProps);
      this.startCollapseTransitionIfNecessary(nextProps);
    } else if (this.props.collapsed !== nextProps.collapsed) {
      this.setState({
        showContent: !nextProps.collapsed
      });
    }
  }

  componentDidUpdate(previousProps) {
    if (this.props.transition) {
      this.doExpandTransitionIfNecessary();
      this.doCollapseTransitionIfNecessary();
    }

    if (
      previousProps.active !== this.props.active &&
      this.props.active &&
      this.props.enableScrollNodeIntoView
    ) {
      this.scrollNodeIntoView();
    }
  }

  render() {
    const {
      children,
      hasChildren,
      node,
      domProps,
      collapsed,
      selected,
      active,
      disabled,
      loading,
      checked,
      hidden,
      path,
      rootClassName
    } = this.props;
    if (hidden) {
      return null;
    }

    const className = join(
      `${rootClassName}`,
      collapsed && `${rootClassName}--collapsed`,
      selected && `${rootClassName}--selected`,
      hasChildren && `${rootClassName}--has-children`,
      active && `${rootClassName}--active`,
      checked && `${rootClassName}--checked`,
      disabled && `${rootClassName}--disabled`,
      loading && `${rootClassName}--loading`,
      domProps.className,
      this.props.node.className
    );

    let treeLineStyleVertical =
      typeof this.props.treeLines === 'string'
        ? { borderLeft: this.props.treeLines }
        : {};

    if (this.props.nestingIndentation) {
      const direction = this.props.rtl ? 'right' : 'left';
      treeLineStyleVertical[direction] = -(
        this.props.nestingIndentation -
        this.props.expandToolSize * 0.5
      );
    }

    return (
      <div
        key={`node_${path}`}
        {...domProps}
        className={className}
        onContextMenu={this.onContextMenu}
        ref={el => (this.rootNode = el)}
      >
        {this.renderLabel()}
        {this.renderContent()}
        {!this.props.isLast &&
          this.props.parent &&
          this.props.treeLines && (
            <div
              key={`vertical_${path}`}
              className={`${this.props.rootClassName}__tree-line__vertical`}
              style={treeLineStyleVertical}
            />
          )}
      </div>
    );
  }

  onContextMenu(event) {
    const { onNodeContextMenu } = this.props;
    event.stopPropagation();
    if (onNodeContextMenu) {
      onNodeContextMenu(this.props, event);
    }
  }

  renderLabel() {
    const { path } = this.props;
    let result;
    const style = this.props.labelStyle;

    let domProps = {
      style,
      className: join(
        `${this.props.rootClassName}__label`,
        this.props.labelClassName
      ),
      children: this.renderLabelChildren(),
      onClick: this.onLabelClick,
      onDoubleClick: this.onLabelDoubleClick
    };

    const nodeProps = this.props;
    result = this.props.renderLabel(domProps, nodeProps);
    if (result === undefined) {
      result = (
        <div
          key={`label_${path}`}
          {...domProps}
          ref={node => (this.labelNode = node)}
        />
      );
    }

    return result;
  }

  renderIcon() {
    let icon = this.props.nodeIcon;

    if (
      this.props.hasChildren &&
      this.props.collapsed &&
      this.props.nodeCollapsedIcon
    ) {
      icon = this.props.nodeCollapsedIcon;
    }

    if (!this.props.hasChildren && this.props.leafNodeIcon) {
      icon = this.props.leafNodeIcon;
    }

    if (this.props.node.icon) {
      icon = this.props.node.icon;
      icon = typeof icon === 'function' ? icon(this.props) : icon;
    }

    icon =
      typeof icon === 'string' ? (
        <img
          key="icon"
          className={`${this.props.rootClassName}__icon-img`}
          src={icon}
        />
      ) : (
        icon
      );

    if (this.props.renderIcon) {
      icon = this.props.renderIcon(this.props);
    }

    return icon;
  }

  renderLabelChildren() {
    const { treeLine, treeLineTop } = this.renderLabelTreeLines();

    let iconCheckList = [this.renderCheck(), this.renderIcon()];
    if (!this.props.checkBeforeIcon) {
      iconCheckList.reverse();
    }

    let children = [
      this.props.loading ? this.renderLoadTool() : this.renderExpandTool(),
      iconCheckList,
      this.renderNodeText(),
      treeLine,
      treeLineTop
    ];

    return children;
  }

  renderLabelTreeLines() {
    const { path } = this.props;
    let treeLine = null;
    let treeLineTop = null;

    if (this.props.treeLines && this.props.parent) {
      const offset =
        this.props.nestingIndentation - this.props.expandToolSize * 0.5;
      let treeLineStyleHorizontal = {
        width: offset,
        [this.props.rtl ? 'right' : 'left']: -this.props.nestingIndentation
      };

      if (typeof this.props.treeLines === 'string') {
        treeLineStyleHorizontal.borderTop = this.props.treeLines;
      }

      treeLine = (
        <div
          key={`horizontal_${path}`}
          className={`${this.props.rootClassName}__tree-line__horizontal`}
          style={treeLineStyleHorizontal}
        />
      );

      if (this.props.isLast) {
        let treeLineTopStyle = {
          [this.props.rtl ? 'right' : 'left']: -offset
        };

        if (typeof this.props.treeLines === 'string') {
          treeLineTopStyle.borderLeft = this.props.treeLines;
        }

        treeLineTop = (
          <div
            key={`vertical_top_${path}`}
            className={`${this.props.rootClassName}__tree-line__vertical-top`}
            style={treeLineTopStyle}
          />
        );
      }
    }

    return {
      treeLine,
      treeLineTop
    };
  }

  renderNodeText() {
    const { path } = this.props;
    let result;
    let children;

    if (typeof this.props.node.label === 'function') {
      children = this.props.node.label(this.props);
    } else {
      children = this.props.node.label;
    }

    let labelTextProps = {
      children,
      className: `${this.props.rootClassName}__label__text`
    };

    if (this.props.renderNodeText) {
      const domProps = labelTextProps;
      const nodeProps = this.props;
      result = this.props.renderNodeText(domProps, nodeProps);
    }

    if (result === undefined) {
      const nodeProps = this.props;
      result = <div key={`text_${path}`} {...labelTextProps} />;
    }

    return result;
  }

  renderCheck() {
    let result;

    if (!this.props.enableChecked) {
      return null;
    }
    if (this.props.renderCheck === false) {
      return null;
    }

    let checkProps = {
      key: 'checkbox',
      // can be null only if it is a parent
      supportIndeterminate: !!(
        this.props.children && this.props.children.length
      ),
      className: join(
        `${this.props.rootClassName}__checkbox`,
        this.props.checked && `${this.props.rootClassName}__checkbox--checked`
      ),
      onChange: this.onCheckedChange,
      // need to stop propagation so it doen't toggle collapse
      onClick: event => {
        event.stopPropagation();
      },
      disabled: this.props.disabled,
      /**
       * checked cannot be undefined
       * because components cannot change
       * from uncontrolled to controlled
       */
      checked: this.props.checked
    };

    if (typeof this.props.renderCheck == 'function') {
      const domProps = checkProps;
      const nodeProps = this.props;
      result = this.props.renderCheck(domProps, nodeProps);
    }

    if (result === undefined) {
      result = (
        <Check
          {...checkProps}
          onChange={value => {
            checkProps.onChange(value);
          }}
        />
      );
    }

    return result;
  }

  renderContent() {
    const { path } = this.props;
    /**
     * showContent is used because
     * when content should collapse
     * it's unmount is delayed
     */
    if (!this.state.showContent) {
      return null;
    }

    let result;
    const style = this.props.contentStyle;
    const domProps = {
      style,
      className: join(
        `${this.props.rootClassName}__content`,
        this.props.contentClassName
      ),
      children: this.props.children,
      ref: c => (this.contentNode = c)
    };

    if (this.props.transition) {
      domProps.style = assign({}, domProps.style, this.getTransitionStyle());
    }

    const nodeProps = this.props;
    result = this.props.renderContent(domProps, nodeProps);
    if (result === undefined) {
      result = (
        <div key={`content_${path}`} {...domProps}>
          {domProps.children}
        </div>
      );
    }

    return result;
  }

  renderExpandTool() {
    const { path } = this.props;
    if (!this.props.hasChildren) {
      return null;
    }

    let expandToolProps = {
      key: `expand_tool_${path}`,
      size: this.props.expandToolSize,
      onClick: this.onExpanderClick,
      onDoubleClick: this.onExpanderDoubleClick,
      className: join(
        `${this.props.rootClassName}__expander`,
        this.props.collapsed &&
          `${this.props.rootClassName}__expander--collapsed`
      )
    };
    let expandTool = this.props.expandTool;

    // react element
    switch (typeof expandTool) {
      case 'undefined':
        expandTool = <ExpandTool {...expandToolProps} />;
        break;
      case 'object':
        expandTool = cloneElement(expandTool, expandToolProps);
        break;
      case 'function':
        expandTool = expandTool({
          domProps: expandToolProps,
          nodeProps: this.props
        });
        break;
      case 'string':
        expandTool = <ExpandTool {...expandToolProps} children={expandTool} />;
        break;
    }

    return expandTool;
  }

  renderLoadTool() {
    let expandTool;
    if (this.props.loadTool) {
      expandTool =
        typeof this.props.loadTool === 'function'
          ? this.props.loadTool(this.props)
          : this.props.loadTool;
    } else {
      expandTool = (
        <LoadTool
          key="loadtool"
          size={this.props.expandToolSize}
          className={`${this.props.rootClassName}__loader`}
        />
      );
    }

    return expandTool;
  }

  onExpanderClick(event) {
    event.stopPropagation();

    if (this.props.disabled) {
      return null;
    }

    if (!this.props.expandOnDoubleClick) {
      this.onCollapsedChange();
    }
  }

  onExpanderDoubleClick(event) {
    if (this.props.disabled) {
      return null;
    }

    event.stopPropagation();
    if (this.props.expandOnDoubleClick) {
      this.onCollapsedChange();
    }
  }

  onLabelClick(event) {
    event.stopPropagation();

    if (this.props.disabled) {
      return null;
    }

    if (!this.props.expandOnToolOnly && !this.props.expandOnDoubleClick) {
      this.onCollapsedChange();
    }

    if (this.props.enableSelection) {
      this.onSelectionChange();
    }

    if (this.props.enableKeyboardNavigation) {
      this.onActiveNodeChange();
    }

    if (this.props.checkOnClick) {
      this.onCheckedChange(!this.props.checked);
    }
  }

  onLabelDoubleClick(event) {
    event.stopPropagation();

    if (this.props.disabled) {
      return null;
    }

    if (!this.props.expandOnToolOnly && this.props.expandOnDoubleClick) {
      this.onCollapsedChange();
    }
  }

  onCheckedChange(checked) {
    let newChecked = checked;

    // a change cannot go into null, only when
    // not all children are selectedMap
    if (newChecked === null) {
      newChecked = true;
    }

    /**
     * Handle situation:
     * - all nondisabled are checked
     * - next state should be false
     */
    if (this.props.children && this.props.checkNodesRecursive) {
      const nonDisabledChildren = this.props.children.filter(
        child => !child.props.disabled
      );
      const nonDisabledCheckedChildren = nonDisabledChildren.filter(
        child => child.props.checked
      );

      if (nonDisabledChildren.length === nonDisabledCheckedChildren.length) {
        newChecked = false;
      }
    }

    this.props.onCheckedChange({
      checked: newChecked,
      props: this.props
    });
  }

  onSelectionChange() {
    const newSelected = !this.props.selected;

    this.props.onSelectionChange({
      path: this.props.path,
      selected: newSelected,
      props: this.props
    });
  }

  onCollapsedChange() {
    const newCollapsed = !this.props.collapsed;

    this.props.onCollapsedChange({
      path: this.props.path,
      collapsed: newCollapsed,
      props: this.props
    });
  }

  onActiveNodeChange() {
    if (this.props.disabled) {
      return null;
    }

    this.props.onActiveNodeChange(this.props);
  }

  getAvailableWidth() {
    const node = this.rootNode;
    if (!node) {
      return null;
    }

    const totalWidth = node.offsetWidth;
    const { paddingLeft, paddingRight } = global.getComputedStyle(node);
    const availableWidth =
      totalWidth - pxToFloat(paddingLeft) - pxToFloat(paddingRight);

    if (isNaN(availableWidth)) {
      return null;
    }

    return availableWidth;
  }

  /**
   *
   * Note - bug on safary
   * If transition is set and
   * - it doen't have height
   * - add height
   * - node will collapse and get up again because it tries to
   * transition from nothing to something, to fix this add transition
   * only when height is added
   *
   * transition:
   * 1 - position absolute, width fixed (from parent), mesure height - transitionPrepare = true
   * 2 - prepare animation render content with height 0 - transitionReady  = true
   * 3 - start transition render content with height calculated
   * 4 - remove height from content
   *
   * collapsing:
   * 1 - add height to content, prevent content from unmounting
   * 2 - add height 0
   * 3 - let content unmount
   */
  getTransitionStyle() {
    let style = {
      // transition: `height ${this.props.transitionDuration}ms ease`
    };
    /**
     * transition #1
     * prepare content to be mesured
     */
    if (this.state.transitionPrepare) {
      assign(style, {
        width: this.state.availableWidth,
        position: 'absolute',
        visibility: 'hidden',
        transition: `height ${this.props.transitionDuration}ms ease`
      });
    }

    /**
     * transition #2
     * content ready to animate
     */
    if (this.state.transitionReady) {
      assign(style, {
        height: 0,
        overflow: 'hidden',
        transition: `height ${this.props.transitionDuration}ms ease`
      });
    }

    /**
     * transition #3
     * animation start
     */
    if (this.state.transitionStart) {
      assign(style, {
        height: this.state.contentHeight,
        overflow: 'hidden',
        transition: `height ${this.props.transitionDuration}ms ease`
      });
    }

    /**
     * Collapseing
     * prepare colapse transition
     */
    if (this.state.transitionColllapsePrepare) {
      assign(style, {
        height: this.state.contentHeight,
        overflow: 'hidden'
        // transition: `height ${this.props.transitionDuration}ms ease`
      });
    }

    /**
     * Start collapse transition
     */
    if (this.state.transitionColllapseStart) {
      assign(style, {
        height: 0,
        overflow: 'hidden',
        transition: `height ${this.props.transitionDuration}ms ease`
      });
    }

    return style;
  }

  // actions
  startExpandTransitionIfNecessary(nextProps) {
    /**
     * transition #1
     * Start preparations for transition
     */

    if (
      nextProps.collapsed !== this.props.collapsed &&
      !nextProps.collapsed &&
      this.props.collapsed
    ) {
      const availableWidth = this.getAvailableWidth();
      if (availableWidth === null) {
        return null;
      }
      this.setState({
        availableWidth,
        transitionPrepare: true,
        showContent: true
      });
      return null;
    }
  }

  doExpandTransitionIfNecessary() {
    /**
     * transition #1
     * mesure content height and save it
     * to prepare transition
     */
    if (this.state.transitionPrepare) {
      const content = this.contentNode;
      if (!content) {
        return null;
      }
      const contentHeight = content.offsetHeight;

      this.setState({
        contentHeight,
        transitionPrepare: false,
        transitionReady: true
      });
    }

    /**
     * transition #3
     * at this point transition is ready to start (height is
     * known and height is also set to 0)
     * start transition
     * after `transitionDuration` the transition ends
     * and state is reseted, and height is removed
     */
    if (this.state.transitionReady) {
      setTimeout(() => {
        if (!this.componentIsMounted) {
          return null;
        }
        /**
         * Timeout is needed as transition is to fast without it
         */
        this.setState(
          {
            transitionReady: false,
            transitionStart: true
          },
          () => {
            // transition done after this.props.transitionDuration
            setTimeout(() => {
              if (!this.componentIsMounted) {
                return null;
              }
              this.setState({
                availableWidth: null,
                transitionPrepare: null,
                transitionStart: null,
                transitionReady: null,
                contentHeight: null
              });
            }, this.props.transitionDuration);
          }
        );
      }, 0);
    }
  }

  startCollapseTransitionIfNecessary(nextProps) {
    /**
     *  collapse 1
     *  Start preparations for collapse transition
     */
    if (nextProps.collapsed !== this.props.collapsed && nextProps.collapsed) {
      const content = this.contentNode;
      if (!content) {
        return;
      }
      const contentHeight = content.offsetHeight;

      this.setState({
        transitionColllapsePrepare: true,
        contentHeight
      });
      return null;
    }
  }

  doCollapseTransitionIfNecessary() {
    /**
     * Start collapse transition
     * after transition started, and transiton duration
     * has run out content can be unmounted
     */
    if (this.state.transitionColllapsePrepare) {
      setTimeout(() => {
        if (!this.componentIsMounted) {
          return null;
        }
        this.setState(
          {
            transitionColllapsePrepare: false,
            transitionColllapseStart: true
          },
          () => {
            // transition done after this.props.transitionDuration
            if (this.contentNode) {
              this.contentNode.style.transition = `height ${
                this.props.transitionDuration
              }ms ease`;
            }

            setTimeout(() => {
              if (!this.componentIsMounted) {
                return null;
              }
              if (this.contentNode) {
                this.contentNode.style.transition = null;
              }

              this.setState({
                transitionColllapsePrepare: null,
                transitionColllapseStart: null,
                contentHeight: null,
                showContent: !this.props.collapsed
              });
            }, this.props.transitionDuration);
          }
        );
      }, 16);
    }
  }

  scrollNodeIntoView() {
    this.props.scrollNodeIntoView(
      this.rootNode && this.labelNode.getBoundingClientRect()
    );
  }
}

ZippyNode.defaultProps = {
  rootClassName: 'zippy-react-toolkit-tree-view__node',
  renderLabel: () => {},
  renderContent: () => {},
  renderNodeText: () => {},
  onActiveNodeChange: () => {},
  onCollapsedChange: () => {},
  onCheckedChange: () => {},
  scrollNodeIntoView: () => {},
  node: {},
  domProps: {},
  collapsed: null,
  checked: false,
  checkOnClick: true,
  treeLines: true,
  disabled: false,
  checkBeforeIcon: true,
  nodeIcon: null,
  nodeCollapsedIcon: null,
  leafNodeIcon: null
};

ZippyNode.propTypes = {
  node: PropTypes.object,
  hasChildren: PropTypes.bool,
  index: PropTypes.number,
  domProps: PropTypes.object,
  treeLines: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  nestingIndentation: PropTypes.number,
  checkBeforeIcon: PropTypes.bool,

  // icons
  nodeIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  nodeCollapsedIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  leafNodeIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

  //context menu
  onNodeContextMenu: PropTypes.func,
  // selection
  defaultSelected: PropTypes.bool,

  // checked
  checked: PropTypes.bool,
  onCheckedChange: PropTypes.func,
  enableChecked: PropTypes.bool,
  checkOnClick: PropTypes.bool,

  // active
  enableKeyboardNavigation: PropTypes.bool,

  // disabled
  disabled: PropTypes.bool,

  // custon render
  renderLabel: PropTypes.func,
  renderIcon: PropTypes.func,
  renderContent: PropTypes.func,
  renderNodeText: PropTypes.func,

  // path, logic
  path: PropTypes.string,

  // style
  contentStyle: PropTypes.object,
  labelStyle: PropTypes.object,

  // collapsed
  collapsed: PropTypes.bool,
  expandTool: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func
  ]),
  expandOnToolOnly: PropTypes.bool,
  checkNodesRecursive: PropTypes.bool,

  // async nodes
  loadTool: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

  scrollNodeIntoView: PropTypes.func,
  expandToolSize: PropTypes.number
};

export default ZippyNode;
