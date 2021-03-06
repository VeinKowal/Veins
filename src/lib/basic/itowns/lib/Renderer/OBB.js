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

var _assertThisInitialized2 = _interopRequireDefault(
  require('@babel/runtime/helpers/assertThisInitialized'),
);

var _get2 = _interopRequireDefault(require('@babel/runtime/helpers/get'));

var _inherits2 = _interopRequireDefault(
  require('@babel/runtime/helpers/inherits'),
);

var _possibleConstructorReturn2 = _interopRequireDefault(
  require('@babel/runtime/helpers/possibleConstructorReturn'),
);

var _getPrototypeOf2 = _interopRequireDefault(
  require('@babel/runtime/helpers/getPrototypeOf'),
);

var THREE = _interopRequireWildcard(require('three'));

var _TileGeometry = _interopRequireDefault(require('../Core/TileGeometry'));

var _BuilderEllipsoidTile = _interopRequireDefault(
  require('../Core/Prefab/Globe/BuilderEllipsoidTile'),
);

var _Coordinates = _interopRequireDefault(
  require('../Core/Geographic/Coordinates'),
);

var _Crs = _interopRequireDefault(require('../Core/Geographic/Crs'));

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function () {
    var Super = (0, _getPrototypeOf2['default'])(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = (0, _getPrototypeOf2['default'])(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return (0, _possibleConstructorReturn2['default'])(this, result);
  };
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function () {}),
    );
    return true;
  } catch (e) {
    return false;
  }
}

// get oriented bounding box of tile
var builder = new _BuilderEllipsoidTile['default']({
  crs: 'EPSG:4978',
  uvCount: 1,
});
var size = new THREE.Vector3();
var dimension = new THREE.Vector2();
var center = new THREE.Vector3();
var coord = new _Coordinates['default']('EPSG:4326', 0, 0, 0);
var obb;

var OBB = /*#__PURE__*/ (function (_THREE$Object3D) {
  (0, _inherits2['default'])(OBB, _THREE$Object3D);

  var _super = _createSuper(OBB);

  /**
   * Oriented bounding box
   * @constructor
   * @extends THREE.Object3D
   * @param {THREE.Vector3}  min representing the lower (x, y, z) boundary of the box. Default is ( + Infinity, + Infinity, + Infinity ).
   * @param {THREE.Vector3}  max representing the lower upper (x, y, z) boundary of the box. Default is ( - Infinity, - Infinity, - Infinity ).
   */
  function OBB() {
    var _this;

    var min =
      arguments.length > 0 && arguments[0] !== undefined
        ? arguments[0]
        : new THREE.Vector3(+Infinity, +Infinity, +Infinity);
    var max =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    (0, _classCallCheck2['default'])(this, OBB);
    _this = _super.call(this);
    _this.box3D = new THREE.Box3(min.clone(), max.clone());
    _this.natBox = _this.box3D.clone();
    _this.z = {
      min: 0,
      max: 0,
      scale: 1.0,
    };
    return (0, _possibleConstructorReturn2['default'])(
      _this,
      (0, _assertThisInitialized2['default'])(_this),
    );
  }
  /**
   * Creates a new instance of the object with same properties than original.
   *
   * @return     {OBB}  Copy of this object.
   */

  (0, _createClass2['default'])(OBB, [
    {
      key: 'clone',
      value: function clone() {
        return new OBB().copy(this);
      },
      /**
       * Copy the property of OBB
       *
       * @param      {OBB}  cOBB OBB to copy
       * @return     {OBB}  the copy
       */
    },
    {
      key: 'copy',
      value: function copy(cOBB) {
        (0, _get2['default'])(
          (0, _getPrototypeOf2['default'])(OBB.prototype),
          'copy',
          this,
        ).call(this, cOBB);
        this.box3D.copy(cOBB.box3D);
        this.natBox.copy(cOBB.natBox);
        this.z.min = cOBB.z.min;
        this.z.max = cOBB.z.max;
        this.z.scale = cOBB.z.scale;
        return this;
      },
      /**
       * Update the top point world
       *
       */
    },
    {
      key: 'update',
      value: function update() {
        this.updateMatrixWorld(true);
      },
      /**
       * Update z min and z max of oriented bounding box
       *
       * @param {number}  min The minimum of oriented bounding box
       * @param {number}  max The maximum of oriented bounding box
       * @param {number} scale
       */
    },
    {
      key: 'updateZ',
      value: function updateZ(min, max) {
        var scale =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : this.z.scale;
        this.z = {
          min: min,
          max: max,
          scale: scale,
          delta: Math.abs(max - min) * scale,
        };
        this.box3D.min.z = this.natBox.min.z + min * scale;
        this.box3D.max.z = this.natBox.max.z + max * scale;
      },
    },
    {
      key: 'updateScaleZ',
      value: function updateScaleZ(scale) {
        if (scale > 0) {
          this.updateZ(this.z.min, this.z.max, scale);
        }
      },
      /**
       * Determines if the sphere is above the XY space of the box
       *
       * @param      {Sphere}   sphere  The sphere
       * @return     {boolean}  True if sphere is above the XY space of the box, False otherwise.
       */
    },
    {
      key: 'isSphereAboveXYBox',
      value: function isSphereAboveXYBox(sphere) {
        var localSpherePosition = this.worldToLocal(sphere.center); // get obb closest point to sphere center by clamping

        var x = Math.max(
          this.box3D.min.x,
          Math.min(localSpherePosition.x, this.box3D.max.x),
        );
        var y = Math.max(
          this.box3D.min.y,
          Math.min(localSpherePosition.y, this.box3D.max.y),
        ); // this is the same as isPointInsideSphere.position

        var distance = Math.sqrt(
          (x - localSpherePosition.x) * (x - localSpherePosition.x) +
            (y - localSpherePosition.y) * (y - localSpherePosition.y),
        );
        return distance < sphere.radius;
      },
      /**
       * Compute OBB from extent.
       * The OBB resulted can be only in the system 'EPSG:3946'.
       *
       * @param      {Extent}        extent     The extent (with crs 'EPSG:4326') to compute oriented bounding box
       * @param      {number}        minHeight  The minimum height of OBB
       * @param      {number}        maxHeight  The maximum height of OBB
       * @return     {OBB}           return this object
       */
    },
    {
      key: 'setFromExtent',
      value: function setFromExtent(extent) {
        var minHeight =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : extent.min || 0;
        var maxHeight =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : extent.max || 0;

        if (extent.crs == 'EPSG:4326') {
          var _builder$computeShara = builder.computeSharableExtent(extent),
            sharableExtent = _builder$computeShara.sharableExtent,
            quaternion = _builder$computeShara.quaternion,
            position = _builder$computeShara.position; // Compute the minimum count of segment to build tile

          var segment = Math.max(
            Math.floor(sharableExtent.dimensions(dimension).x / 90 + 1),
            2,
          );
          var geometry = new _TileGeometry['default']({
            extent: sharableExtent,
            level: 0,
            segment: segment,
            disableSkirt: true,
            builder: builder,
          });
          obb.box3D.copy(geometry.boundingBox);
          obb.natBox.copy(geometry.boundingBox);
          this.copy(obb);
          this.updateZ(minHeight, maxHeight);
          this.position.copy(position);
          this.quaternion.copy(quaternion);
          this.updateMatrixWorld(true);
        } else if (
          !_Crs['default'].isTms(extent.crs) &&
          _Crs['default'].isMetricUnit(extent.crs)
        ) {
          extent.center(coord).toVector3(this.position);
          extent.dimensions(dimension);
          size.set(dimension.x, dimension.y, Math.abs(maxHeight - minHeight));
          this.box3D.setFromCenterAndSize(center, size);
          this.updateMatrixWorld(true);
        } else {
          throw new Error('Unsupported extent crs');
        }

        return this;
      },
    },
  ]);
  return OBB;
})(THREE.Object3D);

obb = new OBB();
var _default = OBB;
exports['default'] = _default;
