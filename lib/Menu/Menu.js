'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('./util');

var _AnimationController = require('../Animation/AnimationController');

var _AnimationController2 = _interopRequireDefault(_AnimationController);

var _DocumentClickHandler = require('./DocumentClickHandler');

var _DocumentClickHandler2 = _interopRequireDefault(_DocumentClickHandler);

var _MenuList = require('./MenuList');

var _MenuList2 = _interopRequireDefault(_MenuList);

var _MenuSlider = require('./MenuSlider');

var _MenuSlider2 = _interopRequireDefault(_MenuSlider);

var _scaleCalculator = require('./scaleCalculator');

var _constants = require('./constants');

var _childChecker = require('./childChecker');

var _childChecker2 = _interopRequireDefault(_childChecker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* eslint-disable import/no-unresolved, import/extensions*/

/* eslint-enable import/no-unresolved, import/extensions*/


var getAccurateTime = function getAccurateTime() {
  return window.performance.now();
};

var Menu = function (_React$PureComponent) {
  _inherits(Menu, _React$PureComponent);

  function Menu(props) {
    _classCallCheck(this, Menu);

    var _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, props));

    _this.state = { openSlider: props.open };
    return _this;
  }

  _createClass(Menu, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(_ref) {
      var _this2 = this;

      var open = _ref.open,
          nextAnimation = _ref.animation;
      var animation = this.props.animation;


      if (nextAnimation && nextAnimation !== animation) {
        this.animationRequestId = requestAnimationFrame(function () {
          _this2.startTime = getAccurateTime();
          _this2.setState({ applyDelays: open });
          _this2.animationRequestId = requestAnimationFrame(function () {
            _this2.setState({ openSlider: open });
            _this2.handleTick();
          });
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      cancelAnimationFrame(this.animationRequestId);
    }
  }, {
    key: 'handleScale',
    value: function handleScale() {
      var _props = this.props,
          animation = _props.animation,
          open = _props.open,
          children = _props.children;

      if (!animation) {
        var scale = open ? 1 : 0;
        return { scaleX: scale, scaleY: scale };
      }
      var animationProgress = this.state.animationProgress;

      var numItems = _react.Children.count(children);
      var scales = (0, _scaleCalculator.calculateScale)(animationProgress, open, numItems);
      return scales;
    }
  }, {
    key: 'handleTick',
    value: function handleTick() {
      var _this3 = this;

      var time = getAccurateTime();
      var animationProgress = (0, _util.clamp)((time - this.startTime) / _constants.TRANSITION_DURATION_MS);
      if (animationProgress < 1) {
        this.setState({ animationProgress: animationProgress });
        this.animationRequestId = requestAnimationFrame(function () {
          return _this3.handleTick();
        });
      } else {
        this.animationRequestId = 0;
        this.setState({ animationProgress: 1 });
        this.props.onAnimationFinish();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          animation = _props2.animation,
          bottom = _props2.bottom,
          children = _props2.children,
          onAnimationFinish = _props2.onAnimationFinish,
          open = _props2.open,
          otherProps = _objectWithoutProperties(_props2, ['animation', 'bottom', 'children', 'onAnimationFinish', 'open']);

      var _state = this.state,
          openSlider = _state.openSlider,
          applyDelays = _state.applyDelays;

      var scales = this.handleScale();
      var innerScales = (0, _scaleCalculator.calculateInnerScales)(scales);
      return _react2.default.createElement(
        _MenuSlider2.default,
        _extends({
          animation: animation,
          open: openSlider,
          bottom: bottom
        }, scales, otherProps),
        _react2.default.createElement(
          _MenuList2.default,
          _extends({
            applyDelays: applyDelays,
            reverse: bottom
          }, innerScales),
          children
        )
      );
    }
  }]);

  return Menu;
}(_react2.default.PureComponent);

Menu.propTypes = {
  animation: _propTypes2.default.bool,
  bottom: _propTypes2.default.bool,
  children: _propTypes2.default.arrayOf(_childChecker2.default),
  onAnimationFinish: _propTypes2.default.func,
  open: _propTypes2.default.bool
};
exports.default = (0, _DocumentClickHandler2.default)((0, _AnimationController2.default)(Menu));