'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var THREE = _interopRequireWildcard(require('three'));

var _TileMesh = _interopRequireDefault(require('../Core/TileMesh'));

var _LayeredMaterial = _interopRequireDefault(
  require('../Renderer/LayeredMaterial'),
);

var _TileBuilder = _interopRequireDefault(
  require('../Core/Prefab/TileBuilder'),
);

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var dimensions = new THREE.Vector2();

function setTileFromTiledLayer(tile, tileLayer) {
  tile.material.transparent = tileLayer.opacity < 1.0;
  tile.material.opacity = tileLayer.opacity;

  if (tileLayer.diffuse) {
    tile.material.diffuse = tileLayer.diffuse;
  }

  if (tileLayer.isGlobeLayer) {
    // Computes a point used for horizon culling.
    // If the point is below the horizon,
    // the tile is guaranteed to be below the horizon as well.
    tile.horizonCullingPoint = tile.extent.center().as('EPSG:4978').toVector3();
    tile.extent.dimensions(dimensions).multiplyScalar(THREE.MathUtils.DEG2RAD); // alpha is maximum angle between two points of tile

    var alpha = dimensions.length();
    var h = Math.abs(1.0 / Math.cos(alpha * 0.5));
    tile.horizonCullingPoint.setLength(h * tile.horizonCullingPoint.length());
    tile.horizonCullingPointElevationScaled = tile.horizonCullingPoint.clone();
  }
}

var _default = {
  convert: function convert(requester, extent, layer) {
    var builder = layer.builder;
    var parent = requester;
    var level = parent !== undefined ? parent.level + 1 : 0;
    var paramsGeometry = {
      extent: extent,
      level: level,
      segment: layer.segments || 16,
      disableSkirt: layer.disableSkirt,
    };
    return (0, _TileBuilder['default'])(builder, paramsGeometry).then(function (
      result,
    ) {
      // build tile mesh
      result.geometry._count++;
      var crsCount = layer.tileMatrixSets.length;
      var material = new _LayeredMaterial['default'](
        layer.materialOptions,
        crsCount,
      );
      var tile = new _TileMesh['default'](
        result.geometry,
        material,
        layer,
        extent,
        level,
      ); // Commented because layer.threejsLayer is undefined;
      // Fix me: conflict with object3d added in view.scene;
      // tile.layers.set(layer.threejsLayer);

      if (parent && parent.isTileMesh) {
        // get parent extent transformation
        var pTrans = builder.computeSharableExtent(parent.extent); // place relative to his parent

        result.position
          .sub(pTrans.position)
          .applyQuaternion(pTrans.quaternion.invert());
        result.quaternion.premultiply(pTrans.quaternion);
      }

      tile.position.copy(result.position);
      tile.quaternion.copy(result.quaternion);
      tile.visible = false;
      tile.updateMatrix();
      tile.add(tile.obb);
      setTileFromTiledLayer(tile, layer);

      if (parent) {
        tile.setBBoxZ(parent.obb.z.min, parent.obb.z.max);
      }

      return tile;
    });
  },
};
exports['default'] = _default;
