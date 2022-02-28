"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _default = {
  /** @module PotreeCinParser */

  /** Parse .cin PotreeConverter format (see {@link https://github.com/peppsac/PotreeConverter/tree/custom_bin}) and convert to a THREE.BufferGeometry
   * @function parse
   * @param {ArrayBuffer} buffer - the cin buffer.
   * @return {Promise} - a promise that resolves with a THREE.BufferGeometry.
   *
   */
  parse: function (buffer) {
    if (!buffer) {
      throw new Error('No array buffer provided.');
    } // Format: MinX,MinY,MinZ,MaxX,MaxY,MaxZ,X1,Y1,Z1,[...],XN,YN,ZN,R1,G1,B1,A1,[...],RN,GN,BN,AN


    var view = new DataView(buffer, 0, 6 * 4);
    var min = new THREE.Vector3(view.getFloat32(0, true), view.getFloat32(4, true), view.getFloat32(8, true));
    var max = new THREE.Vector3(view.getFloat32(12, true), view.getFloat32(16, true), view.getFloat32(20, true));
    var box = new THREE.Box3(min, max);
    var numPoints = Math.floor((buffer.byteLength - 24) / 16);
    var positions = new Float32Array(buffer, 24, 3 * numPoints);
    var colors = new Uint8Array(buffer, 24 + 3 * 4 * numPoints, 4 * numPoints);
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4, true));
    geometry.boundingBox = box;
    return Promise.resolve(geometry);
  }
};
exports["default"] = _default;