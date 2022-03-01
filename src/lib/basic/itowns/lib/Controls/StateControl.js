'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _classCallCheck2 = _interopRequireDefault(
  require('@babel/runtime/helpers/classCallCheck'),
);

var _createClass2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass'),
);

var THREE = _interopRequireWildcard(require('three'));

var CONTROL_KEYS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  BOTTOM: 40,
  SPACE: 32,
  SHIFT: 16,
  CTRL: 17,
  S: 83,
};
/**
 * @typedef {Object} state
 * @property {boolean} enable=true indicate whether the state is enable or not
 * @property {Number} [mouseButton] the mouse button to enter this state
 * @property {Number} [keyboard] the keyboard to enter this state
 * @property {Number} [finger] the number of fingers on the pad to enter this state
 */

/**
 * It represents the control's states.
 * Each {@link state} is a control mode of the camera and how to interact with
 * the interface to activate this mode.
 * @class StateControl
 *
 */

var StateControl = /*#__PURE__*/ (function () {
  function StateControl() {
    (0, _classCallCheck2['default'])(this, StateControl);
    this.NONE = {};
    /**
     * The camera loot at target and moves at a constant distance from it
     */

    this.ORBIT = {
      mouseButton: THREE.MOUSE.LEFT,
      keyboard: CONTROL_KEYS.CTRL,
      enable: true,
      finger: 2,
    };
    /**
     * The camera loot at target and moves forward and backward from this point
     */

    this.DOLLY = {
      mouseButton: THREE.MOUSE.MIDDLE,
      enable: true,
    };
    /**
     * the camera moves parallel to the current view plane
     */

    this.PAN = {
      mouseButton: THREE.MOUSE.RIGHT,
      up: CONTROL_KEYS.UP,
      bottom: CONTROL_KEYS.BOTTOM,
      left: CONTROL_KEYS.LEFT,
      right: CONTROL_KEYS.RIGHT,
      enable: true,
      finger: 3,
    };
    this.MOVE_GLOBE = {
      mouseButton: THREE.MOUSE.LEFT,
      enable: true,
      finger: 1,
    };
    /**
     * the camera and target camera rotate around the globe
     */

    this.PANORAMIC = {
      mouseButton: THREE.MOUSE.LEFT,
      keyboard: CONTROL_KEYS.SHIFT,
      enable: true,
    };
  }
  /**
   * get the state corresponding to the mouse button and the keyboard key
   * @param      {Number}  mouseButton  The mouse button
   * @param      {Number}  keyboard     The keyboard
   * @return     {state}  the state corresponding
   */

  (0, _createClass2['default'])(StateControl, [
    {
      key: 'inputToState',
      value: function inputToState(mouseButton, keyboard) {
        for (
          var _i = 0, _Object$keys = Object.keys(this);
          _i < _Object$keys.length;
          _i++
        ) {
          var key = _Object$keys[_i];
          var state = this[key];

          if (
            state.enable &&
            state.mouseButton === mouseButton &&
            state.keyboard === keyboard
          ) {
            return state;
          }
        }

        return this.NONE;
      },
      /**
       * get the state corresponding to the number of finger on the pad
       *
       * @param      {Number}  finger  The number of finger
       * @return     {state}  the state corresponding
       */
    },
    {
      key: 'touchToState',
      value: function touchToState(finger) {
        for (
          var _i2 = 0, _Object$keys2 = Object.keys(this);
          _i2 < _Object$keys2.length;
          _i2++
        ) {
          var key = _Object$keys2[_i2];
          var state = this[key];

          if (state.enable && finger == state.finger) {
            return state;
          }
        }

        return this.NONE;
      },
    },
  ]);
  return StateControl;
})();

var _default = StateControl;
exports['default'] = _default;
