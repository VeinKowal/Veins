"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  THREE: true,
  proj4: true
};
Object.defineProperty(exports, "proj4", {
  enumerable: true,
  get: function get() {
    return _proj["default"];
  }
});
exports.THREE = void 0;

var THREE = _interopRequireWildcard(require("three"));

exports.THREE = THREE;

var _proj = _interopRequireDefault(require("proj4"));

var _Main = require("./Main.js");

Object.keys(_Main).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _Main[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Main[key];
    }
  });
});