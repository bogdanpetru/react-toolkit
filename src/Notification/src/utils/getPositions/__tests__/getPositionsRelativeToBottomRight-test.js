/**
 * Copyright 2015-present Zippy Technologies
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *   http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import getPositionsRelativeToBottomRight
  from '../getPositionsRelativeToBottomRight';

const extractPosition = ({ top, left }) => ({ top, left });

describe('getPositionsRelativeToBottomRight', () => {
  it('stacks boxes in correct position when vertical dominaint', () => {
    /**
    +------------------------>
    | +----+ +----+ +----+
    | | 1  | |    | |    |
    | +----+ |    | | 4  |
    | +----+ |    | |    |
    | |    | | 3  | +----+
    | | 2  | |    |
    | +----+ |    |
    |        |    |
    |        +----+
    |
    v 60
     */

    const expected = [
      { top: 0, left: 0 },
      { top: 20, left: 0 },
      { top: 0, left: 20 },
      { top: 0, left: 50 }
    ];

    const input = [
      { height: 20, width: 10 },
      { height: 30, width: 20 },
      { height: 40, width: 30 },
      { height: 25, width: 25 }
    ];

    const test = getPositionsRelativeToBottomRight({
      boxes: input,
      height: 60,
      width: 100, // doesn't count
      isVertical: true
    }).map(extractPosition);

    expect(expected).to.deep.equal(test);
  });
  it('stacks boxes in correct position when horizontal dominaint', () => {
    /**
    +------------------------>
    | +----+ +----+  +----+ 60
    | | 1  | |    |  |    |
    | +----+ | 2  |  |    |
    |        +----+  |    |
    |                | 3  |
    |                |    |
    |                |    |
    |                |    |
    | +----+         +----+
    | |    |
    v | 4  |
      |    |
      +----+


     */

    const expected = [
      { top: 0, left: 0 },
      { top: 0, left: 10 },
      { top: 0, left: 30 },
      { top: 40, left: 0 }
    ];

    const input = [
      { height: 20, width: 10 },
      { height: 30, width: 20 },
      { height: 40, width: 30 },
      { height: 25, width: 25 }
    ];

    const test = getPositionsRelativeToBottomRight({
      boxes: input,
      height: 60, // doesn't count
      width: 60,
      isVertical: false
    }).map(extractPosition);

    expect(expected).to.deep.equal(test);
  });

  it('stacks correct when stacking is only vertical', () => {
    const input = [
      { height: 20, width: 10 },
      { height: 30, width: 20 },
      { height: 40, width: 30 },
      { height: 25, width: 25 }
    ];

    const expected = [
      { top: 0, left: 0 },
      { top: 20, left: 0 },
      { top: 50, left: 0 },
      { top: 90, left: 0 }
    ];

    const test = getPositionsRelativeToBottomRight({
      boxes: input,
      height: 60, // doesn't count
      width: 60,
      isVertical: true,
      stackingWrap: false
    }).map(extractPosition);

    expect(expected).to.deep.equal(test);
  });

  it('stacks correct when stacking is only horizontal', () => {
    const input = [
      { height: 20, width: 10 },
      { height: 30, width: 20 },
      { height: 40, width: 30 },
      { height: 25, width: 25 }
    ];

    const expected = [
      { top: 0, left: 0 },
      { top: 0, left: 10 },
      { top: 0, left: 30 },
      { top: 0, left: 60 }
    ];

    const test = getPositionsRelativeToBottomRight({
      boxes: input,
      height: 60, // doesn't count
      width: 60,
      stacking: ['horizontal'],
      stackingWrap: false
    }).map(extractPosition);

    expect(expected).to.deep.equal(test);
  });
});
