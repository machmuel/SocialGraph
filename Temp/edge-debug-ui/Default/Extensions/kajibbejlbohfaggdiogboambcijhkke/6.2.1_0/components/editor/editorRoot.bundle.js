/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2
/*!********************************************!*\
  !*** ./node_modules/lodash/_getAllKeys.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ 2199),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ 4664),
    keys = __webpack_require__(/*! ./keys */ 5950);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ },

/***/ 79
/*!*******************************************!*\
  !*** ./node_modules/lodash/_ListCache.js ***!
  \*******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var listCacheClear = __webpack_require__(/*! ./_listCacheClear */ 3702),
    listCacheDelete = __webpack_require__(/*! ./_listCacheDelete */ 80),
    listCacheGet = __webpack_require__(/*! ./_listCacheGet */ 4739),
    listCacheHas = __webpack_require__(/*! ./_listCacheHas */ 8655),
    listCacheSet = __webpack_require__(/*! ./_listCacheSet */ 1175);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ },

/***/ 80
/*!*************************************************!*\
  !*** ./node_modules/lodash/_listCacheDelete.js ***!
  \*************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ 6025);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ },

/***/ 104
/*!****************************************!*\
  !*** ./node_modules/lodash/memoize.js ***!
  \****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var MapCache = __webpack_require__(/*! ./_MapCache */ 3661);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ },

/***/ 181
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeKeysIn.js ***!
  \**********************************************/
(module) {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ },

/***/ 257
/*!**********************************************!*\
  !*** ./node_modules/lodash/_wrapperClone.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var LazyWrapper = __webpack_require__(/*! ./_LazyWrapper */ 980),
    LodashWrapper = __webpack_require__(/*! ./_LodashWrapper */ 6017),
    copyArray = __webpack_require__(/*! ./_copyArray */ 3007);

/**
 * Creates a clone of `wrapper`.
 *
 * @private
 * @param {Object} wrapper The wrapper to clone.
 * @returns {Object} Returns the cloned wrapper.
 */
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper) {
    return wrapper.clone();
  }
  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray(wrapper.__actions__);
  result.__index__  = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}

module.exports = wrapperClone;


/***/ },

/***/ 270
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseIsEqual.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(/*! ./_baseIsEqualDeep */ 7068),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 346);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ },

/***/ 289
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheGet.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ 2651);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ },

/***/ 294
/*!*****************************************!*\
  !*** ./node_modules/lodash/isLength.js ***!
  \*****************************************/
(module) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ },

/***/ 299
/*!**************************************!*\
  !*** ./node_modules/lodash/union.js ***!
  \**************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseFlatten = __webpack_require__(/*! ./_baseFlatten */ 3120),
    baseRest = __webpack_require__(/*! ./_baseRest */ 9302),
    baseUniq = __webpack_require__(/*! ./_baseUniq */ 5765),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ 3693);

/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */
var union = baseRest(function(arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});

module.exports = union;


/***/ },

/***/ 311
/*!*******************************************!*\
  !*** ./node_modules/invariant/browser.js ***!
  \*******************************************/
(module) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) // removed by dead control flow
{}

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;


/***/ },

/***/ 317
/*!********************************************!*\
  !*** ./node_modules/lodash/_mapToArray.js ***!
  \********************************************/
(module) {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ },

/***/ 346
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
(module) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ },

/***/ 361
/*!*****************************************!*\
  !*** ./node_modules/lodash/_isIndex.js ***!
  \*****************************************/
(module) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ },

/***/ 380
/*!******************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/util/FileUpload.scss ***!
  \******************************************************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ 1601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.fileUpload{position:relative}.fileUpload .area{background-color:rgba(247,247,247,.75);border:2px dashed #dbdbdb;padding:.75rem}.fileUpload .overlay{position:absolute;top:0;width:100%;height:100%;visibility:hidden;border:2px dashed #949494;background-color:rgba(247,247,247,.9);opacity:0;transition:visibility .3s 0s,opacity .3s ease-out}.fileUpload .overlay.active{visibility:visible;opacity:1}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 392
/*!******************************************!*\
  !*** ./node_modules/lodash/_getValue.js ***!
  \******************************************/
(module) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ },

/***/ 399
/*!**********************************************************!*\
  !*** ./node_modules/dnd-core/lib/DragDropManagerImpl.js ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var redux_1 = __webpack_require__(/*! redux */ 8238);
var reducers_1 = __webpack_require__(/*! ./reducers */ 9121);
var dragDrop_1 = __webpack_require__(/*! ./actions/dragDrop */ 580);
var DragDropMonitorImpl_1 = __webpack_require__(/*! ./DragDropMonitorImpl */ 3886);
var HandlerRegistryImpl_1 = __webpack_require__(/*! ./HandlerRegistryImpl */ 7258);
var DragDropManagerImpl = /** @class */ (function () {
    function DragDropManagerImpl(createBackend, context) {
        if (context === void 0) { context = {}; }
        this.context = context;
        this.isSetUp = false;
        var store = redux_1.createStore(reducers_1.default);
        this.store = store;
        this.monitor = new DragDropMonitorImpl_1.default(store, new HandlerRegistryImpl_1.default(store));
        this.backend = createBackend(this);
        store.subscribe(this.handleRefCountChange.bind(this));
    }
    DragDropManagerImpl.prototype.getContext = function () {
        return this.context;
    };
    DragDropManagerImpl.prototype.getMonitor = function () {
        return this.monitor;
    };
    DragDropManagerImpl.prototype.getBackend = function () {
        return this.backend;
    };
    DragDropManagerImpl.prototype.getRegistry = function () {
        return this.monitor.registry;
    };
    DragDropManagerImpl.prototype.getActions = function () {
        var manager = this;
        var dispatch = this.store.dispatch;
        function bindActionCreator(actionCreator) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var action = actionCreator.apply(manager, args);
                if (typeof action !== 'undefined') {
                    dispatch(action);
                }
            };
        }
        var actions = dragDrop_1.default(this);
        return Object.keys(actions).reduce(function (boundActions, key) {
            var action = actions[key];
            boundActions[key] = bindActionCreator(action);
            return boundActions;
        }, {});
    };
    DragDropManagerImpl.prototype.dispatch = function (action) {
        this.store.dispatch(action);
    };
    DragDropManagerImpl.prototype.handleRefCountChange = function () {
        var shouldSetUp = this.store.getState().refCount > 0;
        if (shouldSetUp && !this.isSetUp) {
            this.backend.setup();
            this.isSetUp = true;
        }
        else if (!shouldSetUp && this.isSetUp) {
            this.backend.teardown();
            this.isSetUp = false;
        }
    };
    return DragDropManagerImpl;
}());
exports["default"] = DragDropManagerImpl;


/***/ },

/***/ 404
/*!************************************************!*\
  !*** ./node_modules/dnd-core/lib/contracts.js ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var invariant = __webpack_require__(/*! invariant */ 311);
function validateSourceContract(source) {
    invariant(typeof source.canDrag === 'function', 'Expected canDrag to be a function.');
    invariant(typeof source.beginDrag === 'function', 'Expected beginDrag to be a function.');
    invariant(typeof source.endDrag === 'function', 'Expected endDrag to be a function.');
}
exports.validateSourceContract = validateSourceContract;
function validateTargetContract(target) {
    invariant(typeof target.canDrop === 'function', 'Expected canDrop to be a function.');
    invariant(typeof target.hover === 'function', 'Expected hover to be a function.');
    invariant(typeof target.drop === 'function', 'Expected beginDrag to be a function.');
}
exports.validateTargetContract = validateTargetContract;
function validateType(type, allowArray) {
    if (allowArray && Array.isArray(type)) {
        type.forEach(function (t) { return validateType(t, false); });
        return;
    }
    invariant(typeof type === 'string' || typeof type === 'symbol', allowArray
        ? 'Type can only be a string, a symbol, or an array of either.'
        : 'Type can only be a string or a symbol.');
}
exports.validateType = validateType;


/***/ },

/***/ 495
/*!***********************************************************!*\
  !*** ./node_modules/react-transition-group/Transition.js ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = exports.EXITING = exports.ENTERED = exports.ENTERING = exports.EXITED = exports.UNMOUNTED = void 0;

var PropTypes = _interopRequireWildcard(__webpack_require__(/*! prop-types */ 5556));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ 1594));

var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ 5206));

var _reactLifecyclesCompat = __webpack_require__(/*! react-lifecycles-compat */ 1345);

var _PropTypes = __webpack_require__(/*! ./utils/PropTypes */ 554);

var _TransitionGroupContext = _interopRequireDefault(__webpack_require__(/*! ./TransitionGroupContext */ 8605));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var UNMOUNTED = 'unmounted';
exports.UNMOUNTED = UNMOUNTED;
var EXITED = 'exited';
exports.EXITED = EXITED;
var ENTERING = 'entering';
exports.ENTERING = ENTERING;
var ENTERED = 'entered';
exports.ENTERED = ENTERED;
var EXITING = 'exiting';
/**
 * The Transition component lets you describe a transition from one component
 * state to another _over time_ with a simple declarative API. Most commonly
 * it's used to animate the mounting and unmounting of a component, but can also
 * be used to describe in-place transition states as well.
 *
 * ---
 *
 * **Note**: `Transition` is a platform-agnostic base component. If you're using
 * transitions in CSS, you'll probably want to use
 * [`CSSTransition`](https://reactcommunity.org/react-transition-group/css-transition)
 * instead. It inherits all the features of `Transition`, but contains
 * additional features necessary to play nice with CSS transitions (hence the
 * name of the component).
 *
 * ---
 *
 * By default the `Transition` component does not alter the behavior of the
 * component it renders, it only tracks "enter" and "exit" states for the
 * components. It's up to you to give meaning and effect to those states. For
 * example we can add styles to a component when it enters or exits:
 *
 * ```jsx
 * import { Transition } from 'react-transition-group';
 *
 * const duration = 300;
 *
 * const defaultStyle = {
 *   transition: `opacity ${duration}ms ease-in-out`,
 *   opacity: 0,
 * }
 *
 * const transitionStyles = {
 *   entering: { opacity: 1 },
 *   entered:  { opacity: 1 },
 *   exiting:  { opacity: 0 },
 *   exited:  { opacity: 0 },
 * };
 *
 * const Fade = ({ in: inProp }) => (
 *   <Transition in={inProp} timeout={duration}>
 *     {state => (
 *       <div style={{
 *         ...defaultStyle,
 *         ...transitionStyles[state]
 *       }}>
 *         I'm a fade Transition!
 *       </div>
 *     )}
 *   </Transition>
 * );
 * ```
 *
 * There are 4 main states a Transition can be in:
 *  - `'entering'`
 *  - `'entered'`
 *  - `'exiting'`
 *  - `'exited'`
 *
 * Transition state is toggled via the `in` prop. When `true` the component
 * begins the "Enter" stage. During this stage, the component will shift from
 * its current transition state, to `'entering'` for the duration of the
 * transition and then to the `'entered'` stage once it's complete. Let's take
 * the following example (we'll use the
 * [useState](https://reactjs.org/docs/hooks-reference.html#usestate) hook):
 *
 * ```jsx
 * function App() {
 *   const [inProp, setInProp] = useState(false);
 *   return (
 *     <div>
 *       <Transition in={inProp} timeout={500}>
 *         {state => (
 *           // ...
 *         )}
 *       </Transition>
 *       <button onClick={() => setInProp(true)}>
 *         Click to Enter
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * When the button is clicked the component will shift to the `'entering'` state
 * and stay there for 500ms (the value of `timeout`) before it finally switches
 * to `'entered'`.
 *
 * When `in` is `false` the same thing happens except the state moves from
 * `'exiting'` to `'exited'`.
 */

exports.EXITING = EXITING;

var Transition =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Transition, _React$Component);

  function Transition(props, context) {
    var _this;

    _this = _React$Component.call(this, props, context) || this;
    var parentGroup = context; // In the context of a TransitionGroup all enters are really appears

    var appear = parentGroup && !parentGroup.isMounting ? props.enter : props.appear;
    var initialStatus;
    _this.appearStatus = null;

    if (props.in) {
      if (appear) {
        initialStatus = EXITED;
        _this.appearStatus = ENTERING;
      } else {
        initialStatus = ENTERED;
      }
    } else {
      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = UNMOUNTED;
      } else {
        initialStatus = EXITED;
      }
    }

    _this.state = {
      status: initialStatus
    };
    _this.nextCallback = null;
    return _this;
  }

  Transition.getDerivedStateFromProps = function getDerivedStateFromProps(_ref, prevState) {
    var nextIn = _ref.in;

    if (nextIn && prevState.status === UNMOUNTED) {
      return {
        status: EXITED
      };
    }

    return null;
  }; // getSnapshotBeforeUpdate(prevProps) {
  //   let nextStatus = null
  //   if (prevProps !== this.props) {
  //     const { status } = this.state
  //     if (this.props.in) {
  //       if (status !== ENTERING && status !== ENTERED) {
  //         nextStatus = ENTERING
  //       }
  //     } else {
  //       if (status === ENTERING || status === ENTERED) {
  //         nextStatus = EXITING
  //       }
  //     }
  //   }
  //   return { nextStatus }
  // }


  var _proto = Transition.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.updateStatus(true, this.appearStatus);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var nextStatus = null;

    if (prevProps !== this.props) {
      var status = this.state.status;

      if (this.props.in) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING;
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING;
        }
      }
    }

    this.updateStatus(false, nextStatus);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.cancelNextCallback();
  };

  _proto.getTimeouts = function getTimeouts() {
    var timeout = this.props.timeout;
    var exit, enter, appear;
    exit = enter = appear = timeout;

    if (timeout != null && typeof timeout !== 'number') {
      exit = timeout.exit;
      enter = timeout.enter; // TODO: remove fallback for next major

      appear = timeout.appear !== undefined ? timeout.appear : enter;
    }

    return {
      exit: exit,
      enter: enter,
      appear: appear
    };
  };

  _proto.updateStatus = function updateStatus(mounting, nextStatus) {
    if (mounting === void 0) {
      mounting = false;
    }

    if (nextStatus !== null) {
      // nextStatus will always be ENTERING or EXITING.
      this.cancelNextCallback();

      var node = _reactDom.default.findDOMNode(this);

      if (nextStatus === ENTERING) {
        this.performEnter(node, mounting);
      } else {
        this.performExit(node);
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({
        status: UNMOUNTED
      });
    }
  };

  _proto.performEnter = function performEnter(node, mounting) {
    var _this2 = this;

    var enter = this.props.enter;
    var appearing = this.context ? this.context.isMounting : mounting;
    var timeouts = this.getTimeouts();
    var enterTimeout = appearing ? timeouts.appear : timeouts.enter; // no enter animation skip right to ENTERED
    // if we are mounting and running this it means appear _must_ be set

    if (!mounting && !enter) {
      this.safeSetState({
        status: ENTERED
      }, function () {
        _this2.props.onEntered(node);
      });
      return;
    }

    this.props.onEnter(node, appearing);
    this.safeSetState({
      status: ENTERING
    }, function () {
      _this2.props.onEntering(node, appearing);

      _this2.onTransitionEnd(node, enterTimeout, function () {
        _this2.safeSetState({
          status: ENTERED
        }, function () {
          _this2.props.onEntered(node, appearing);
        });
      });
    });
  };

  _proto.performExit = function performExit(node) {
    var _this3 = this;

    var exit = this.props.exit;
    var timeouts = this.getTimeouts(); // no exit animation skip right to EXITED

    if (!exit) {
      this.safeSetState({
        status: EXITED
      }, function () {
        _this3.props.onExited(node);
      });
      return;
    }

    this.props.onExit(node);
    this.safeSetState({
      status: EXITING
    }, function () {
      _this3.props.onExiting(node);

      _this3.onTransitionEnd(node, timeouts.exit, function () {
        _this3.safeSetState({
          status: EXITED
        }, function () {
          _this3.props.onExited(node);
        });
      });
    });
  };

  _proto.cancelNextCallback = function cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  };

  _proto.safeSetState = function safeSetState(nextState, callback) {
    // This shouldn't be necessary, but there are weird race conditions with
    // setState callbacks and unmounting in testing, so always make sure that
    // we can cancel any pending setState callbacks after we unmount.
    callback = this.setNextCallback(callback);
    this.setState(nextState, callback);
  };

  _proto.setNextCallback = function setNextCallback(callback) {
    var _this4 = this;

    var active = true;

    this.nextCallback = function (event) {
      if (active) {
        active = false;
        _this4.nextCallback = null;
        callback(event);
      }
    };

    this.nextCallback.cancel = function () {
      active = false;
    };

    return this.nextCallback;
  };

  _proto.onTransitionEnd = function onTransitionEnd(node, timeout, handler) {
    this.setNextCallback(handler);
    var doesNotHaveTimeoutOrListener = timeout == null && !this.props.addEndListener;

    if (!node || doesNotHaveTimeoutOrListener) {
      setTimeout(this.nextCallback, 0);
      return;
    }

    if (this.props.addEndListener) {
      this.props.addEndListener(node, this.nextCallback);
    }

    if (timeout != null) {
      setTimeout(this.nextCallback, timeout);
    }
  };

  _proto.render = function render() {
    var status = this.state.status;

    if (status === UNMOUNTED) {
      return null;
    }

    var _this$props = this.props,
        children = _this$props.children,
        childProps = _objectWithoutPropertiesLoose(_this$props, ["children"]); // filter props for Transtition


    delete childProps.in;
    delete childProps.mountOnEnter;
    delete childProps.unmountOnExit;
    delete childProps.appear;
    delete childProps.enter;
    delete childProps.exit;
    delete childProps.timeout;
    delete childProps.addEndListener;
    delete childProps.onEnter;
    delete childProps.onEntering;
    delete childProps.onEntered;
    delete childProps.onExit;
    delete childProps.onExiting;
    delete childProps.onExited;

    if (typeof children === 'function') {
      // allows for nested Transitions
      return _react.default.createElement(_TransitionGroupContext.default.Provider, {
        value: null
      }, children(status, childProps));
    }

    var child = _react.default.Children.only(children);

    return (// allows for nested Transitions
      _react.default.createElement(_TransitionGroupContext.default.Provider, {
        value: null
      }, _react.default.cloneElement(child, childProps))
    );
  };

  return Transition;
}(_react.default.Component);

Transition.contextType = _TransitionGroupContext.default;
Transition.propTypes =  false ? 0 : {};

function noop() {}

Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,
  onEnter: noop,
  onEntering: noop,
  onEntered: noop,
  onExit: noop,
  onExiting: noop,
  onExited: noop
};
Transition.UNMOUNTED = 0;
Transition.EXITED = 1;
Transition.ENTERING = 2;
Transition.ENTERED = 3;
Transition.EXITING = 4;

var _default = (0, _reactLifecyclesCompat.polyfill)(Transition);

exports["default"] = _default;

/***/ },

/***/ 540
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
(module) {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ },

/***/ 554
/*!****************************************************************!*\
  !*** ./node_modules/react-transition-group/utils/PropTypes.js ***!
  \****************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.classNamesShape = exports.timeoutsShape = void 0;

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ 5556));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var timeoutsShape =  false ? 0 : null;
exports.timeoutsShape = timeoutsShape;
var classNamesShape =  false ? 0 : null;
exports.classNamesShape = classNamesShape;

/***/ },

/***/ 561
/*!****************************************************!*\
  !*** ./node_modules/recompose/isClassComponent.js ***!
  \****************************************************/
(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
var isClassComponent = function isClassComponent(Component) {
  return Boolean(Component && Component.prototype && typeof Component.prototype.render === 'function');
};

exports.A = isClassComponent;

/***/ },

/***/ 580
/*!*******************************************************!*\
  !*** ./node_modules/dnd-core/lib/actions/dragDrop.js ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var matchesType_1 = __webpack_require__(/*! ../utils/matchesType */ 5352);
var invariant = __webpack_require__(/*! invariant */ 311);
var isObject = __webpack_require__(/*! lodash/isObject */ 3805);
exports.BEGIN_DRAG = 'dnd-core/BEGIN_DRAG';
exports.PUBLISH_DRAG_SOURCE = 'dnd-core/PUBLISH_DRAG_SOURCE';
exports.HOVER = 'dnd-core/HOVER';
exports.DROP = 'dnd-core/DROP';
exports.END_DRAG = 'dnd-core/END_DRAG';
function createDragDropActions(manager) {
    return {
        beginDrag: function (sourceIds, _a) {
            if (sourceIds === void 0) { sourceIds = []; }
            var _b = _a === void 0 ? {
                publishSource: true,
            } : _a, publishSource = _b.publishSource, clientOffset = _b.clientOffset, getSourceClientOffset = _b.getSourceClientOffset;
            var monitor = manager.getMonitor();
            var registry = manager.getRegistry();
            invariant(!monitor.isDragging(), 'Cannot call beginDrag while dragging.');
            for (var _i = 0, sourceIds_1 = sourceIds; _i < sourceIds_1.length; _i++) {
                var s = sourceIds_1[_i];
                invariant(registry.getSource(s), 'Expected sourceIds to be registered.');
            }
            var sourceId = null;
            for (var i = sourceIds.length - 1; i >= 0; i--) {
                if (monitor.canDragSource(sourceIds[i])) {
                    sourceId = sourceIds[i];
                    break;
                }
            }
            if (sourceId === null) {
                return;
            }
            var sourceClientOffset = null;
            if (clientOffset) {
                invariant(typeof getSourceClientOffset === 'function', 'When clientOffset is provided, getSourceClientOffset must be a function.');
                sourceClientOffset = getSourceClientOffset(sourceId);
            }
            var source = registry.getSource(sourceId);
            var item = source.beginDrag(monitor, sourceId);
            invariant(isObject(item), 'Item must be an object.');
            registry.pinSource(sourceId);
            var itemType = registry.getSourceType(sourceId);
            return {
                type: exports.BEGIN_DRAG,
                payload: {
                    itemType: itemType,
                    item: item,
                    sourceId: sourceId,
                    clientOffset: clientOffset || null,
                    sourceClientOffset: sourceClientOffset || null,
                    isSourcePublic: !!publishSource,
                },
            };
        },
        publishDragSource: function () {
            var monitor = manager.getMonitor();
            if (!monitor.isDragging()) {
                return;
            }
            return { type: exports.PUBLISH_DRAG_SOURCE };
        },
        hover: function (targetIdsArg, _a) {
            var clientOffset = (_a === void 0 ? {} : _a).clientOffset;
            invariant(Array.isArray(targetIdsArg), 'Expected targetIds to be an array.');
            var targetIds = targetIdsArg.slice(0);
            var monitor = manager.getMonitor();
            var registry = manager.getRegistry();
            invariant(monitor.isDragging(), 'Cannot call hover while not dragging.');
            invariant(!monitor.didDrop(), 'Cannot call hover after drop.');
            // First check invariants.
            for (var i = 0; i < targetIds.length; i++) {
                var targetId = targetIds[i];
                invariant(targetIds.lastIndexOf(targetId) === i, 'Expected targetIds to be unique in the passed array.');
                var target = registry.getTarget(targetId);
                invariant(target, 'Expected targetIds to be registered.');
            }
            var draggedItemType = monitor.getItemType();
            // Remove those targetIds that don't match the targetType.  This
            // fixes shallow isOver which would only be non-shallow because of
            // non-matching targets.
            for (var i = targetIds.length - 1; i >= 0; i--) {
                var targetId = targetIds[i];
                var targetType = registry.getTargetType(targetId);
                if (!matchesType_1.default(targetType, draggedItemType)) {
                    targetIds.splice(i, 1);
                }
            }
            // Finally call hover on all matching targets.
            for (var _i = 0, targetIds_1 = targetIds; _i < targetIds_1.length; _i++) {
                var targetId = targetIds_1[_i];
                var target = registry.getTarget(targetId);
                target.hover(monitor, targetId);
            }
            return {
                type: exports.HOVER,
                payload: {
                    targetIds: targetIds,
                    clientOffset: clientOffset || null,
                },
            };
        },
        drop: function (options) {
            if (options === void 0) { options = {}; }
            var monitor = manager.getMonitor();
            var registry = manager.getRegistry();
            invariant(monitor.isDragging(), 'Cannot call drop while not dragging.');
            invariant(!monitor.didDrop(), 'Cannot call drop twice during one drag operation.');
            var targetIds = monitor
                .getTargetIds()
                .filter(monitor.canDropOnTarget, monitor);
            targetIds.reverse();
            // Multiple actions are dispatched here, which is why this doesn't return an action
            targetIds.forEach(function (targetId, index) {
                var target = registry.getTarget(targetId);
                var dropResult = target.drop(monitor, targetId);
                invariant(typeof dropResult === 'undefined' || isObject(dropResult), 'Drop result must either be an object or undefined.');
                if (typeof dropResult === 'undefined') {
                    dropResult = index === 0 ? {} : monitor.getDropResult();
                }
                var action = {
                    type: exports.DROP,
                    payload: {
                        dropResult: __assign({}, options, dropResult),
                    },
                };
                manager.dispatch(action);
            });
        },
        endDrag: function () {
            var monitor = manager.getMonitor();
            var registry = manager.getRegistry();
            invariant(monitor.isDragging(), 'Cannot call endDrag while not dragging.');
            var sourceId = monitor.getSourceId();
            var source = registry.getSource(sourceId, true);
            source.endDrag(monitor, sourceId);
            registry.unpinSource();
            return { type: exports.END_DRAG };
        },
    };
}
exports["default"] = createDragDropActions;


/***/ },

/***/ 598
/*!****************************************************!*\
  !*** ./node_modules/dom-helpers/class/hasClass.js ***!
  \****************************************************/
(module, exports) {

"use strict";


exports.__esModule = true;
exports["default"] = hasClass;

function hasClass(element, className) {
  if (element.classList) return !!className && element.classList.contains(className);else return (" " + (element.className.baseVal || element.className) + " ").indexOf(" " + className + " ") !== -1;
}

module.exports = exports["default"];

/***/ },

/***/ 659
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ 1873);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ },

/***/ 680
/*!*********************************************!*\
  !*** ./node_modules/lodash/escapeRegExp.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var toString = __webpack_require__(/*! ./toString */ 3222);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);

/**
 * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
 * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https://lodash\.com/\)'
 */
function escapeRegExp(string) {
  string = toString(string);
  return (string && reHasRegExpChar.test(string))
    ? string.replace(reRegExpChar, '\\$&')
    : string;
}

module.exports = escapeRegExp;


/***/ },

/***/ 689
/*!**********************************************!*\
  !*** ./node_modules/lodash/_equalObjects.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getAllKeys = __webpack_require__(/*! ./_getAllKeys */ 2);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ },

/***/ 695
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayLikeKeys.js ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseTimes = __webpack_require__(/*! ./_baseTimes */ 8096),
    isArguments = __webpack_require__(/*! ./isArguments */ 2428),
    isArray = __webpack_require__(/*! ./isArray */ 6449),
    isBuffer = __webpack_require__(/*! ./isBuffer */ 3656),
    isIndex = __webpack_require__(/*! ./_isIndex */ 361),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ 7167);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ },

/***/ 741
/*!*****************************************************!*\
  !*** ./node_modules/lodash/_castArrayLikeObject.js ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ 3693);

/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

module.exports = castArrayLikeObject;


/***/ },

/***/ 788
/*!*******************************************************!*\
  !*** ./node_modules/dom-helpers/class/removeClass.js ***!
  \*******************************************************/
(module) {

"use strict";


function replaceClassName(origClass, classToRemove) {
  return origClass.replace(new RegExp('(^|\\s)' + classToRemove + '(?:\\s|$)', 'g'), '$1').replace(/\s+/g, ' ').replace(/^\s*|\s*$/g, '');
}

module.exports = function removeClass(element, className) {
  if (element.classList) element.classList.remove(className);else if (typeof element.className === 'string') element.className = replaceClassName(element.className, className);else element.setAttribute('class', replaceClassName(element.className && element.className.baseVal || '', className));
};

/***/ },

/***/ 938
/*!*********************************************!*\
  !*** ./node_modules/lodash/_stackDelete.js ***!
  \*********************************************/
(module) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ },

/***/ 945
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackSet.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var ListCache = __webpack_require__(/*! ./_ListCache */ 79),
    Map = __webpack_require__(/*! ./_Map */ 8223),
    MapCache = __webpack_require__(/*! ./_MapCache */ 3661);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ },

/***/ 949
/*!*******************************************************!*\
  !*** ./node_modules/dnd-core/lib/reducers/stateId.js ***!
  \*******************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function stateId(state) {
    if (state === void 0) { state = 0; }
    return state + 1;
}
exports["default"] = stateId;


/***/ },

/***/ 980
/*!*********************************************!*\
  !*** ./node_modules/lodash/_LazyWrapper.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseCreate = __webpack_require__(/*! ./_baseCreate */ 9344),
    baseLodash = __webpack_require__(/*! ./_baseLodash */ 4033);

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
 *
 * @private
 * @constructor
 * @param {*} value The value to wrap.
 */
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}

// Ensure `LazyWrapper` is an instance of `baseLodash`.
LazyWrapper.prototype = baseCreate(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;

module.exports = LazyWrapper;


/***/ },

/***/ 1033
/*!***************************************!*\
  !*** ./node_modules/lodash/_apply.js ***!
  \***************************************/
(module) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ },

/***/ 1042
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeCreate.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ 6110);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ },

/***/ 1105
/*!*********************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/BrowserDetector.js ***!
  \*********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var memoize = __webpack_require__(/*! lodash/memoize */ 104);
exports.isFirefox = memoize(function () { return /firefox/i.test(navigator.userAgent); });
exports.isSafari = memoize(function () { return Boolean(window.safari); });
//# sourceMappingURL=BrowserDetector.js.map

/***/ },

/***/ 1113
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
(module) {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ },

/***/ 1175
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheSet.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ 6025);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ },

/***/ 1215
/*!********************************************!*\
  !*** ./node_modules/dnd-core/lib/index.js ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", ({ value: true }));
__export(__webpack_require__(/*! ./interfaces */ 3067));
__export(__webpack_require__(/*! ./factories */ 1581));


/***/ },

/***/ 1258
/*!*******************************************************!*\
  !*** ./node_modules/react-dnd/lib/decorateHandler.js ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var React = __webpack_require__(/*! react */ 1594);
var DragDropContext_1 = __webpack_require__(/*! ./DragDropContext */ 1289);
var disposables_1 = __webpack_require__(/*! ./utils/disposables */ 8929);
var isClassComponent = (__webpack_require__(/*! recompose/isClassComponent */ 561)/* ["default"] */ .A);
var isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ 1331);
var invariant = __webpack_require__(/*! invariant */ 311);
var hoistStatics = __webpack_require__(/*! hoist-non-react-statics */ 4146);
var shallowEqual = __webpack_require__(/*! shallowequal */ 2833);
function decorateHandler(_a) {
    var DecoratedComponent = _a.DecoratedComponent, createHandler = _a.createHandler, createMonitor = _a.createMonitor, createConnector = _a.createConnector, registerHandler = _a.registerHandler, containerDisplayName = _a.containerDisplayName, getType = _a.getType, collect = _a.collect, options = _a.options;
    var _b = options.arePropsEqual, arePropsEqual = _b === void 0 ? shallowEqual : _b;
    var Decorated = DecoratedComponent;
    var displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';
    var DragDropContainer = /** @class */ (function (_super) {
        __extends(DragDropContainer, _super);
        function DragDropContainer(props) {
            var _this = _super.call(this, props) || this;
            _this.isCurrentlyMounted = false;
            _this.handleChange = _this.handleChange.bind(_this);
            _this.disposable = new disposables_1.SerialDisposable();
            _this.receiveProps(props);
            _this.dispose();
            return _this;
        }
        DragDropContainer.prototype.getHandlerId = function () {
            return this.handlerId;
        };
        DragDropContainer.prototype.getDecoratedComponentInstance = function () {
            if (!this.handler) {
                return null;
            }
            return this.handler.ref.current;
        };
        DragDropContainer.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            return (!arePropsEqual(nextProps, this.props) ||
                !shallowEqual(nextState, this.state));
        };
        DragDropContainer.prototype.componentDidMount = function () {
            this.isCurrentlyMounted = true;
            this.disposable = new disposables_1.SerialDisposable();
            this.currentType = undefined;
            this.receiveProps(this.props);
            this.handleChange();
        };
        DragDropContainer.prototype.componentDidUpdate = function (prevProps) {
            if (!arePropsEqual(this.props, prevProps)) {
                this.receiveProps(this.props);
                this.handleChange();
            }
        };
        DragDropContainer.prototype.componentWillUnmount = function () {
            this.dispose();
            this.isCurrentlyMounted = false;
        };
        DragDropContainer.prototype.receiveProps = function (props) {
            if (!this.handler) {
                return;
            }
            this.handler.receiveProps(props);
            this.receiveType(getType(props));
        };
        DragDropContainer.prototype.receiveType = function (type) {
            if (!this.handlerMonitor || !this.manager || !this.handlerConnector) {
                return;
            }
            if (type === this.currentType) {
                return;
            }
            this.currentType = type;
            var _a = registerHandler(type, this.handler, this.manager), handlerId = _a.handlerId, unregister = _a.unregister;
            this.handlerId = handlerId;
            this.handlerMonitor.receiveHandlerId(handlerId);
            this.handlerConnector.receiveHandlerId(handlerId);
            var globalMonitor = this.manager.getMonitor();
            var unsubscribe = globalMonitor.subscribeToStateChange(this.handleChange, { handlerIds: [handlerId] });
            this.disposable.setDisposable(new disposables_1.CompositeDisposable(new disposables_1.Disposable(unsubscribe), new disposables_1.Disposable(unregister)));
        };
        DragDropContainer.prototype.handleChange = function () {
            if (!this.isCurrentlyMounted) {
                return;
            }
            var nextState = this.getCurrentState();
            if (!shallowEqual(nextState, this.state)) {
                this.setState(nextState);
            }
        };
        DragDropContainer.prototype.dispose = function () {
            this.disposable.dispose();
            if (this.handlerConnector) {
                this.handlerConnector.receiveHandlerId(null);
            }
        };
        DragDropContainer.prototype.getCurrentState = function () {
            if (!this.handlerConnector) {
                return {};
            }
            var nextState = collect(this.handlerConnector.hooks, this.handlerMonitor);
            if (false) // removed by dead control flow
{}
            return nextState;
        };
        DragDropContainer.prototype.render = function () {
            var _this = this;
            return (React.createElement(DragDropContext_1.Consumer, null, function (_a) {
                var dragDropManager = _a.dragDropManager;
                if (dragDropManager === undefined) {
                    return null;
                }
                _this.receiveDragDropManager(dragDropManager);
                // Let componentDidMount fire to initialize the collected state
                if (!_this.isCurrentlyMounted) {
                    return null;
                }
                return (React.createElement(Decorated, __assign({}, _this.props, _this.state, { ref: _this.handler && isClassComponent(Decorated)
                        ? _this.handler.ref
                        : undefined })));
            }));
        };
        DragDropContainer.prototype.receiveDragDropManager = function (dragDropManager) {
            if (this.manager !== undefined) {
                return;
            }
            this.manager = dragDropManager;
            invariant(typeof dragDropManager === 'object', 'Could not find the drag and drop manager in the context of %s. ' +
                'Make sure to wrap the top-level component of your app with DragDropContext. ' +
                'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context', displayName, displayName);
            this.handlerMonitor = createMonitor(dragDropManager);
            this.handlerConnector = createConnector(dragDropManager.getBackend());
            this.handler = createHandler(this.handlerMonitor);
        };
        DragDropContainer.DecoratedComponent = DecoratedComponent;
        DragDropContainer.displayName = containerDisplayName + "(" + displayName + ")";
        return DragDropContainer;
    }(React.Component));
    return hoistStatics(DragDropContainer, DecoratedComponent);
}
exports["default"] = decorateHandler;


/***/ },

/***/ 1289
/*!*******************************************************!*\
  !*** ./node_modules/react-dnd/lib/DragDropContext.js ***!
  \*******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var _a;
var React = __webpack_require__(/*! react */ 1594);
var dnd_core_1 = __webpack_require__(/*! dnd-core */ 1215);
var checkDecoratorArguments_1 = __webpack_require__(/*! ./utils/checkDecoratorArguments */ 4306);
var invariant = __webpack_require__(/*! invariant */ 311);
var hoistStatics = __webpack_require__(/*! hoist-non-react-statics */ 4146);
var isClassComponent = (__webpack_require__(/*! recompose/isClassComponent */ 561)/* ["default"] */ .A);
/**
 * Create the React Context
 */
exports.Consumer = (_a = React.createContext({ dragDropManager: undefined }), _a.Consumer), exports.Provider = _a.Provider;
/**
 * Creates the context object we're providing
 * @param backend
 * @param context
 */
function createChildContext(backend, context) {
    return {
        dragDropManager: dnd_core_1.createDragDropManager(backend, context),
    };
}
exports.createChildContext = createChildContext;
/**
 * A React component that provides the React-DnD context
 */
exports.DragDropContextProvider = function (_a) {
    var backend = _a.backend, context = _a.context, children = _a.children;
    var contextValue = createChildContext(backend, context);
    return React.createElement(exports.Provider, { value: contextValue }, children);
};
/**
 * Wrap the root component of your application with DragDropContext decorator to set up React DnD.
 * This lets you specify the backend, and sets up the shared DnD state behind the scenes.
 * @param backendFactory The DnD backend factory
 * @param backendContext The backend context
 */
function DragDropContext(backendFactory, backendContext) {
    checkDecoratorArguments_1.default('DragDropContext', 'backend', backendFactory);
    var childContext = createChildContext(backendFactory, backendContext);
    return function decorateContext(DecoratedComponent) {
        var Decorated = DecoratedComponent;
        var displayName = Decorated.displayName || Decorated.name || 'Component';
        var DragDropContextContainer = /** @class */ (function (_super) {
            __extends(DragDropContextContainer, _super);
            function DragDropContextContainer() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.ref = React.createRef();
                return _this;
            }
            DragDropContextContainer.prototype.getDecoratedComponentInstance = function () {
                invariant(this.ref.current, 'In order to access an instance of the decorated component it can not be a stateless component.');
                return this.ref.current;
            };
            DragDropContextContainer.prototype.getManager = function () {
                return childContext.dragDropManager;
            };
            DragDropContextContainer.prototype.render = function () {
                return (React.createElement(exports.Provider, { value: childContext },
                    React.createElement(Decorated, __assign({}, this.props, { ref: isClassComponent(Decorated) ? this.ref : undefined }))));
            };
            DragDropContextContainer.DecoratedComponent = DecoratedComponent;
            DragDropContextContainer.displayName = "DragDropContext(" + displayName + ")";
            return DragDropContextContainer;
        }(React.Component));
        return hoistStatics(DragDropContextContainer, DecoratedComponent);
    };
}
exports.DragDropContext = DragDropContext;


/***/ },

/***/ 1331
/*!**********************************************!*\
  !*** ./node_modules/lodash/isPlainObject.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 2552),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ 8879),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 346);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ },

/***/ 1345
/*!****************************************************************************!*\
  !*** ./node_modules/react-lifecycles-compat/react-lifecycles-compat.es.js ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   polyfill: () => (/* binding */ polyfill)
/* harmony export */ });
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function componentWillMount() {
  // Call this.constructor.gDSFP to support sub-classes.
  var state = this.constructor.getDerivedStateFromProps(this.props, this.state);
  if (state !== null && state !== undefined) {
    this.setState(state);
  }
}

function componentWillReceiveProps(nextProps) {
  // Call this.constructor.gDSFP to support sub-classes.
  // Use the setState() updater to ensure state isn't stale in certain edge cases.
  function updater(prevState) {
    var state = this.constructor.getDerivedStateFromProps(nextProps, prevState);
    return state !== null && state !== undefined ? state : null;
  }
  // Binding "this" is important for shallow renderer support.
  this.setState(updater.bind(this));
}

function componentWillUpdate(nextProps, nextState) {
  try {
    var prevProps = this.props;
    var prevState = this.state;
    this.props = nextProps;
    this.state = nextState;
    this.__reactInternalSnapshotFlag = true;
    this.__reactInternalSnapshot = this.getSnapshotBeforeUpdate(
      prevProps,
      prevState
    );
  } finally {
    this.props = prevProps;
    this.state = prevState;
  }
}

// React may warn about cWM/cWRP/cWU methods being deprecated.
// Add a flag to suppress these warnings for this special case.
componentWillMount.__suppressDeprecationWarning = true;
componentWillReceiveProps.__suppressDeprecationWarning = true;
componentWillUpdate.__suppressDeprecationWarning = true;

function polyfill(Component) {
  var prototype = Component.prototype;

  if (!prototype || !prototype.isReactComponent) {
    throw new Error('Can only polyfill class components');
  }

  if (
    typeof Component.getDerivedStateFromProps !== 'function' &&
    typeof prototype.getSnapshotBeforeUpdate !== 'function'
  ) {
    return Component;
  }

  // If new component APIs are defined, "unsafe" lifecycles won't be called.
  // Error if any of these lifecycles are present,
  // Because they would work differently between older and newer (16.3+) versions of React.
  var foundWillMountName = null;
  var foundWillReceivePropsName = null;
  var foundWillUpdateName = null;
  if (typeof prototype.componentWillMount === 'function') {
    foundWillMountName = 'componentWillMount';
  } else if (typeof prototype.UNSAFE_componentWillMount === 'function') {
    foundWillMountName = 'UNSAFE_componentWillMount';
  }
  if (typeof prototype.componentWillReceiveProps === 'function') {
    foundWillReceivePropsName = 'componentWillReceiveProps';
  } else if (typeof prototype.UNSAFE_componentWillReceiveProps === 'function') {
    foundWillReceivePropsName = 'UNSAFE_componentWillReceiveProps';
  }
  if (typeof prototype.componentWillUpdate === 'function') {
    foundWillUpdateName = 'componentWillUpdate';
  } else if (typeof prototype.UNSAFE_componentWillUpdate === 'function') {
    foundWillUpdateName = 'UNSAFE_componentWillUpdate';
  }
  if (
    foundWillMountName !== null ||
    foundWillReceivePropsName !== null ||
    foundWillUpdateName !== null
  ) {
    var componentName = Component.displayName || Component.name;
    var newApiName =
      typeof Component.getDerivedStateFromProps === 'function'
        ? 'getDerivedStateFromProps()'
        : 'getSnapshotBeforeUpdate()';

    throw Error(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        componentName +
        ' uses ' +
        newApiName +
        ' but also contains the following legacy lifecycles:' +
        (foundWillMountName !== null ? '\n  ' + foundWillMountName : '') +
        (foundWillReceivePropsName !== null
          ? '\n  ' + foundWillReceivePropsName
          : '') +
        (foundWillUpdateName !== null ? '\n  ' + foundWillUpdateName : '') +
        '\n\nThe above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks'
    );
  }

  // React <= 16.2 does not support static getDerivedStateFromProps.
  // As a workaround, use cWM and cWRP to invoke the new static lifecycle.
  // Newer versions of React will ignore these lifecycles if gDSFP exists.
  if (typeof Component.getDerivedStateFromProps === 'function') {
    prototype.componentWillMount = componentWillMount;
    prototype.componentWillReceiveProps = componentWillReceiveProps;
  }

  // React <= 16.2 does not support getSnapshotBeforeUpdate.
  // As a workaround, use cWU to invoke the new lifecycle.
  // Newer versions of React will ignore that lifecycle if gSBU exists.
  if (typeof prototype.getSnapshotBeforeUpdate === 'function') {
    if (typeof prototype.componentDidUpdate !== 'function') {
      throw new Error(
        'Cannot polyfill getSnapshotBeforeUpdate() for components that do not define componentDidUpdate() on the prototype'
      );
    }

    prototype.componentWillUpdate = componentWillUpdate;

    var componentDidUpdate = prototype.componentDidUpdate;

    prototype.componentDidUpdate = function componentDidUpdatePolyfill(
      prevProps,
      prevState,
      maybeSnapshot
    ) {
      // 16.3+ will not execute our will-update method;
      // It will pass a snapshot value to did-update though.
      // Older versions will require our polyfilled will-update value.
      // We need to handle both cases, but can't just check for the presence of "maybeSnapshot",
      // Because for <= 15.x versions this might be a "prevContext" object.
      // We also can't just check "__reactInternalSnapshot",
      // Because get-snapshot might return a falsy value.
      // So check for the explicit __reactInternalSnapshotFlag flag to determine behavior.
      var snapshot = this.__reactInternalSnapshotFlag
        ? this.__reactInternalSnapshot
        : maybeSnapshot;

      componentDidUpdate.call(this, prevProps, prevState, snapshot);
    };
  }

  return Component;
}




/***/ },

/***/ 1369
/*!******************************************************************!*\
  !*** ./node_modules/react-transition-group/ReplaceTransition.js ***!
  \******************************************************************/
(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ 5556));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ 1594));

var _reactDom = __webpack_require__(/*! react-dom */ 5206);

var _TransitionGroup = _interopRequireDefault(__webpack_require__(/*! ./TransitionGroup */ 2312));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * The `<ReplaceTransition>` component is a specialized `Transition` component
 * that animates between two children.
 *
 * ```jsx
 * <ReplaceTransition in>
 *   <Fade><div>I appear first</div></Fade>
 *   <Fade><div>I replace the above</div></Fade>
 * </ReplaceTransition>
 * ```
 */
var ReplaceTransition =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(ReplaceTransition, _React$Component);

  function ReplaceTransition() {
    var _this;

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(_args)) || this;

    _this.handleEnter = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _this.handleLifecycle('onEnter', 0, args);
    };

    _this.handleEntering = function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return _this.handleLifecycle('onEntering', 0, args);
    };

    _this.handleEntered = function () {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return _this.handleLifecycle('onEntered', 0, args);
    };

    _this.handleExit = function () {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return _this.handleLifecycle('onExit', 1, args);
    };

    _this.handleExiting = function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      return _this.handleLifecycle('onExiting', 1, args);
    };

    _this.handleExited = function () {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      return _this.handleLifecycle('onExited', 1, args);
    };

    return _this;
  }

  var _proto = ReplaceTransition.prototype;

  _proto.handleLifecycle = function handleLifecycle(handler, idx, originalArgs) {
    var _child$props;

    var children = this.props.children;

    var child = _react.default.Children.toArray(children)[idx];

    if (child.props[handler]) (_child$props = child.props)[handler].apply(_child$props, originalArgs);
    if (this.props[handler]) this.props[handler]((0, _reactDom.findDOMNode)(this));
  };

  _proto.render = function render() {
    var _this$props = this.props,
        children = _this$props.children,
        inProp = _this$props.in,
        props = _objectWithoutPropertiesLoose(_this$props, ["children", "in"]);

    var _React$Children$toArr = _react.default.Children.toArray(children),
        first = _React$Children$toArr[0],
        second = _React$Children$toArr[1];

    delete props.onEnter;
    delete props.onEntering;
    delete props.onEntered;
    delete props.onExit;
    delete props.onExiting;
    delete props.onExited;
    return _react.default.createElement(_TransitionGroup.default, props, inProp ? _react.default.cloneElement(first, {
      key: 'first',
      onEnter: this.handleEnter,
      onEntering: this.handleEntering,
      onEntered: this.handleEntered
    }) : _react.default.cloneElement(second, {
      key: 'second',
      onEnter: this.handleExit,
      onEntering: this.handleExiting,
      onEntered: this.handleExited
    }));
  };

  return ReplaceTransition;
}(_react.default.Component);

ReplaceTransition.propTypes =  false ? 0 : {};
var _default = ReplaceTransition;
exports["default"] = _default;
module.exports = exports["default"];

/***/ },

/***/ 1380
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setCacheAdd.js ***!
  \*********************************************/
(module) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ },

/***/ 1420
/*!********************************************!*\
  !*** ./node_modules/lodash/_stackClear.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var ListCache = __webpack_require__(/*! ./_ListCache */ 79);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ },

/***/ 1459
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setCacheHas.js ***!
  \*********************************************/
(module) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ },

/***/ 1468
/*!***********************************************************************************!*\
  !*** ./node_modules/react-tag-input/dist-modules/components/DragAndDropHelper.js ***!
  \***********************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.dropCollect = exports.dragSource = exports.tagTarget = exports.tagSource = undefined;

var _reactDom = __webpack_require__(/*! react-dom */ 5206);

var _utils = __webpack_require__(/*! ./utils */ 2460);

var tagSource = {
  beginDrag: function beginDrag(props) {
    return { id: props.tag.index, index: props.index };
  },
  canDrag: function canDrag(props) {
    return (0, _utils.canDrag)(props);
  }
};

var tagTarget = {
  hover: function hover(props, monitor, component) {
    var dragIndex = monitor.getItem().index;
    var hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    var hoverBoundingRect = (0, _reactDom.findDOMNode)(component).getBoundingClientRect();
    var hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    var clientOffset = monitor.getClientOffset();
    var hoverClientX = clientOffset.x - hoverBoundingRect.left;

    // Only perform the move when the mouse has crossed half of the items width
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return;
    }

    props.moveTag(dragIndex, hoverIndex);

    monitor.getItem().index = hoverIndex;
  },
  canDrop: function canDrop(props) {
    return (0, _utils.canDrop)(props);
  }
};

var dragSource = function dragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

var dropCollect = function dropCollect(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

exports.tagSource = tagSource;
exports.tagTarget = tagTarget;
exports.dragSource = dragSource;
exports.dropCollect = dropCollect;

/***/ },

/***/ 1549
/*!**************************************!*\
  !*** ./node_modules/lodash/_Hash.js ***!
  \**************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var hashClear = __webpack_require__(/*! ./_hashClear */ 2032),
    hashDelete = __webpack_require__(/*! ./_hashDelete */ 3862),
    hashGet = __webpack_require__(/*! ./_hashGet */ 6721),
    hashHas = __webpack_require__(/*! ./_hashHas */ 2749),
    hashSet = __webpack_require__(/*! ./_hashSet */ 5749);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ },

/***/ 1581
/*!************************************************!*\
  !*** ./node_modules/dnd-core/lib/factories.js ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var DragDropManagerImpl_1 = __webpack_require__(/*! ./DragDropManagerImpl */ 399);
function createDragDropManager(backend, context) {
    return new DragDropManagerImpl_1.default(backend, context);
}
exports.createDragDropManager = createDragDropManager;


/***/ },

/***/ 1594
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

"use strict";
module.exports = React;

/***/ },

/***/ 1599
/*!************************************************!*\
  !*** ./node_modules/lodash/_escapeHtmlChar.js ***!
  \************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var basePropertyOf = __webpack_require__(/*! ./_basePropertyOf */ 4552);

/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
var escapeHtmlChar = basePropertyOf(htmlEscapes);

module.exports = escapeHtmlChar;


/***/ },

/***/ 1601
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \**************************************************************/
(module) {

"use strict";


module.exports = function (i) {
  return i[1];
};

/***/ },

/***/ 1636
/*!*****************************************************************************!*\
  !*** ./node_modules/react-dnd/lib/utils/disposables/CompositeDisposable.js ***!
  \*****************************************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Represents a group of disposable resources that are disposed together.
 * @constructor
 */
var CompositeDisposable = /** @class */ (function () {
    function CompositeDisposable() {
        var disposables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            disposables[_i] = arguments[_i];
        }
        this.isDisposed = false;
        this.disposables = disposables;
    }
    /**
     * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
     * @param {Any} item Disposable to add.
     */
    CompositeDisposable.prototype.add = function (item) {
        if (this.isDisposed) {
            item.dispose();
        }
        else {
            this.disposables.push(item);
        }
    };
    /**
     * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
     * @param {Any} item Disposable to remove.
     * @returns {Boolean} true if found; false otherwise.
     */
    CompositeDisposable.prototype.remove = function (item) {
        var shouldDispose = false;
        if (!this.isDisposed) {
            var idx = this.disposables.indexOf(item);
            if (idx !== -1) {
                shouldDispose = true;
                this.disposables.splice(idx, 1);
                item.dispose();
            }
        }
        return shouldDispose;
    };
    /**
     *  Disposes all disposables in the group and removes them from the group but
     *  does not dispose the CompositeDisposable.
     */
    CompositeDisposable.prototype.clear = function () {
        if (!this.isDisposed) {
            var len = this.disposables.length;
            var currentDisposables = new Array(len);
            for (var i = 0; i < len; i++) {
                currentDisposables[i] = this.disposables[i];
            }
            this.disposables = [];
            for (var i = 0; i < len; i++) {
                currentDisposables[i].dispose();
            }
        }
    };
    /**
     *  Disposes all disposables in the group and removes them from the group.
     */
    CompositeDisposable.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.isDisposed = true;
            var len = this.disposables.length;
            var currentDisposables = new Array(len);
            for (var i = 0; i < len; i++) {
                currentDisposables[i] = this.disposables[i];
            }
            this.disposables = [];
            for (var i = 0; i < len; i++) {
                currentDisposables[i].dispose();
            }
        }
    };
    return CompositeDisposable;
}());
exports.CompositeDisposable = CompositeDisposable;


/***/ },

/***/ 1648
/*!****************************************!*\
  !*** ./node_modules/lodash/without.js ***!
  \****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseDifference = __webpack_require__(/*! ./_baseDifference */ 3915),
    baseRest = __webpack_require__(/*! ./_baseRest */ 9302),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ 3693);

/**
 * Creates an array excluding all given values using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.pull`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...*} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.xor
 * @example
 *
 * _.without([2, 1, 2, 3], 1, 2);
 * // => [3]
 */
var without = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, values)
    : [];
});

module.exports = without;


/***/ },

/***/ 1732
/*!**************************************************!*\
  !*** ./node_modules/react-dnd/lib/DragSource.js ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var checkDecoratorArguments_1 = __webpack_require__(/*! ./utils/checkDecoratorArguments */ 4306);
var decorateHandler_1 = __webpack_require__(/*! ./decorateHandler */ 1258);
var registerSource_1 = __webpack_require__(/*! ./registerSource */ 2147);
var createSourceFactory_1 = __webpack_require__(/*! ./createSourceFactory */ 3906);
var createSourceMonitor_1 = __webpack_require__(/*! ./createSourceMonitor */ 9206);
var createSourceConnector_1 = __webpack_require__(/*! ./createSourceConnector */ 7283);
var isValidType_1 = __webpack_require__(/*! ./utils/isValidType */ 8379);
var invariant = __webpack_require__(/*! invariant */ 311);
var isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ 1331);
/**
 * Decorates a component as a dragsource
 * @param type The dragsource type
 * @param spec The drag source specification
 * @param collect The props collector function
 * @param options DnD optinos
 */
function DragSource(type, spec, collect, options) {
    if (options === void 0) { options = {}; }
    checkDecoratorArguments_1.default('DragSource', 'type, spec, collect[, options]', type, spec, collect, options);
    var getType = type;
    if (typeof type !== 'function') {
        invariant(isValidType_1.default(type), 'Expected "type" provided as the first argument to DragSource to be ' +
            'a string, or a function that returns a string given the current props. ' +
            'Instead, received %s. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', type);
        getType = function () { return type; };
    }
    invariant(isPlainObject(spec), 'Expected "spec" provided as the second argument to DragSource to be ' +
        'a plain object. Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', spec);
    var createSource = createSourceFactory_1.default(spec);
    invariant(typeof collect === 'function', 'Expected "collect" provided as the third argument to DragSource to be ' +
        'a function that returns a plain object of props to inject. ' +
        'Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', collect);
    invariant(isPlainObject(options), 'Expected "options" provided as the fourth argument to DragSource to be ' +
        'a plain object when specified. ' +
        'Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', collect);
    return function decorateSource(DecoratedComponent) {
        return decorateHandler_1.default({
            containerDisplayName: 'DragSource',
            createHandler: createSource,
            registerHandler: registerSource_1.default,
            createMonitor: createSourceMonitor_1.default,
            createConnector: createSourceConnector_1.default,
            DecoratedComponent: DecoratedComponent,
            getType: getType,
            collect: collect,
            options: options,
        });
    };
}
exports["default"] = DragSource;


/***/ },

/***/ 1769
/*!******************************************!*\
  !*** ./node_modules/lodash/_castPath.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isArray = __webpack_require__(/*! ./isArray */ 6449),
    isKey = __webpack_require__(/*! ./_isKey */ 8586),
    stringToPath = __webpack_require__(/*! ./_stringToPath */ 1802),
    toString = __webpack_require__(/*! ./toString */ 3222);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ },

/***/ 1802
/*!**********************************************!*\
  !*** ./node_modules/lodash/_stringToPath.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(/*! ./_memoizeCapped */ 2224);

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ },

/***/ 1811
/*!******************************************!*\
  !*** ./node_modules/lodash/_shortOut.js ***!
  \******************************************/
(module) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ },

/***/ 1846
/*!************************************************************!*\
  !*** ./node_modules/dnd-core/lib/utils/getNextUniqueId.js ***!
  \************************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var nextUniqueId = 0;
function getNextUniqueId() {
    return nextUniqueId++;
}
exports["default"] = getNextUniqueId;


/***/ },

/***/ 1873
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ 9325);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ },

/***/ 1882
/*!*******************************************!*\
  !*** ./node_modules/lodash/isFunction.js ***!
  \*******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 2552),
    isObject = __webpack_require__(/*! ./isObject */ 3805);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ },

/***/ 1975
/*!*************************************************************!*\
  !*** ./node_modules/react-dnd/lib/createTargetConnector.js ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var wrapConnectorHooks_1 = __webpack_require__(/*! ./wrapConnectorHooks */ 9674);
var shallowEqual = __webpack_require__(/*! shallowequal */ 2833);
function createTargetConnector(backend) {
    var currentHandlerId;
    var currentDropTargetNode;
    var currentDropTargetOptions;
    var disconnectCurrentDropTarget;
    function reconnectDropTarget() {
        if (disconnectCurrentDropTarget) {
            disconnectCurrentDropTarget();
            disconnectCurrentDropTarget = undefined;
        }
        if (currentHandlerId && currentDropTargetNode) {
            disconnectCurrentDropTarget = backend.connectDropTarget(currentHandlerId, currentDropTargetNode, currentDropTargetOptions);
        }
    }
    function receiveHandlerId(handlerId) {
        if (handlerId === currentHandlerId) {
            return;
        }
        currentHandlerId = handlerId;
        reconnectDropTarget();
    }
    var hooks = wrapConnectorHooks_1.default({
        dropTarget: function connectDropTarget(node, options) {
            if (node === currentDropTargetNode &&
                shallowEqual(options, currentDropTargetOptions)) {
                return;
            }
            currentDropTargetNode = node;
            currentDropTargetOptions = options;
            reconnectDropTarget();
        },
    });
    return {
        receiveHandlerId: receiveHandlerId,
        hooks: hooks,
    };
}
exports["default"] = createTargetConnector;


/***/ },

/***/ 1986
/*!********************************************!*\
  !*** ./node_modules/lodash/_equalByTag.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ 1873),
    Uint8Array = __webpack_require__(/*! ./_Uint8Array */ 7828),
    eq = __webpack_require__(/*! ./eq */ 5288),
    equalArrays = __webpack_require__(/*! ./_equalArrays */ 5911),
    mapToArray = __webpack_require__(/*! ./_mapToArray */ 317),
    setToArray = __webpack_require__(/*! ./_setToArray */ 4247);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ },

/***/ 2004
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/editor/components/RecipientInput.scss ***!
  \***********************************************************************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ 1601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ 6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.recipients-input{padding:0 .25rem .25rem 0;position:relative;height:initial}.recipients-input:focus-within{color:#404040;background-color:#fff;border-color:rgb(180,201.5,202.5);outline:0;box-shadow:inset 0 2px 0 rgba(219,219,219,.3),0 0 0 .2rem rgba(105,148,150,.25)}.recipients-input .tag-selected-list .tag-wrapper{margin:.25rem 0 0 .25rem}.recipients-input .tag-selected-list .tag-wrapper .tag-remove{padding:0;border:none;background:none;font-weight:700;font-size:16px;margin-left:8px}.recipients-input .tag-selected-list .tag-wrapper::before{font:normal normal normal 14px/1 "MailvelopeIcons";line-height:1}.recipients-input .tag-selected-list .badge-primary{color:#e30048;background-color:rgb(251.64,224.4,233.04);border-color:rgb(249.4,204,218.4)}.recipients-input .tag-selected-list .badge-primary hr{border-top-color:rgb(246.8770318021,181.0229681979,201.9106007067)}.recipients-input .tag-selected-list .badge-primary .alert-link{color:rgb(176,0,55.8237885463)}.recipients-input .tag-selected-list .badge-primary .tag-remove{color:#e30048}.recipients-input .tag-selected-list .badge-secondary{color:#f7f7f7;background-color:hsl(0,0%,99.6235294118%);border-color:rgb(253.4,253.4,253.4)}.recipients-input .tag-selected-list .badge-secondary hr{border-top-color:hsl(0,0%,94.3725490196%)}.recipients-input .tag-selected-list .badge-secondary .alert-link{color:rgb(221.5,221.5,221.5)}.recipients-input .tag-selected-list .badge-secondary .tag-remove{color:#f7f7f7}.recipients-input .tag-selected-list .badge-success{color:#2db37a;background-color:rgb(229.8,245.88,239.04);border-color:rgb(213,239.8,228.4)}.recipients-input .tag-selected-list .badge-success hr{border-top-color:rgb(194.2762237762,233.0237762238,216.5416083916)}.recipients-input .tag-selected-list .badge-success .alert-link{color:rgb(34.7544642857,138.2455357143,94.2232142857)}.recipients-input .tag-selected-list .badge-success .tag-remove{color:#2db37a}.recipients-input .tag-selected-list .badge-info{color:#699496;background-color:rgb(237,242.16,242.4);border-color:rgb(225,233.6,234)}.recipients-input .tag-selected-list .badge-info hr{border-top-color:rgb(210,222.9,223.5)}.recipients-input .tag-selected-list .badge-info .alert-link{color:rgb(84,118.4,120)}.recipients-input .tag-selected-list .badge-info .tag-remove{color:#699496}.recipients-input .tag-selected-list .badge-warning{color:#e38200;background-color:rgb(251.64,240,224.4);border-color:rgb(249.4,230,204)}.recipients-input .tag-selected-list .badge-warning hr{border-top-color:hsl(34.3612334802,80.2120141343%,83.9019607843%)}.recipients-input .tag-selected-list .badge-warning .alert-link{color:rgb(176,100.7929515419,0)}.recipients-input .tag-selected-list .badge-warning .tag-remove{color:#e38200}.recipients-input .tag-selected-list .badge-danger{color:#e30048;background-color:rgb(251.64,224.4,233.04);border-color:rgb(249.4,204,218.4)}.recipients-input .tag-selected-list .badge-danger hr{border-top-color:rgb(246.8770318021,181.0229681979,201.9106007067)}.recipients-input .tag-selected-list .badge-danger .alert-link{color:rgb(176,0,55.8237885463)}.recipients-input .tag-selected-list .badge-danger .tag-remove{color:#e30048}.recipients-input .tag-selected-list .badge-light{color:#fafafa;background-color:rgb(254.4,254.4,254.4);border-color:#fefefe}.recipients-input .tag-selected-list .badge-light hr{border-top-color:hsl(0,0%,94.6078431373%)}.recipients-input .tag-selected-list .badge-light .alert-link{color:rgb(224.5,224.5,224.5)}.recipients-input .tag-selected-list .badge-light .tag-remove{color:#fafafa}.recipients-input .tag-selected-list .badge-dark{color:#949494;background-color:hsl(0,0%,94.9647058824%);border-color:rgb(233.6,233.6,233.6)}.recipients-input .tag-selected-list .badge-dark hr{border-top-color:hsl(0,0%,86.6078431373%)}.recipients-input .tag-selected-list .badge-dark .alert-link{color:rgb(122.5,122.5,122.5)}.recipients-input .tag-selected-list .badge-dark .tag-remove{color:#949494}.recipients-input .tag-selected-list .badge-success::before{content:" "}.recipients-input .tag-selected-list .badge-danger::before{content:" "}.recipients-input .tag-input-wrapper{padding:.3175rem 0;margin:.25rem 0 0 .25rem}.recipients-input .tag-input-wrapper .tag-input-field{width:100%;min-width:12rem;border:0;outline:none;font-size:inherit;line-height:inherit}.recipients-input .tag-input-wrapper .tag-input-field ::-ms-clear{display:none}.recipients-input .suggestions{width:100%;overflow-x:auto}.recipients-input .suggestions ul{margin:0px;padding:0px}.recipients-input .suggestions li{font:16px "Helvetica Neue",Helvetica,Arial,sans-serif;color:#000;padding:5px 10px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.recipients-input .suggestions li.active-suggestion{color:#262626;background-color:#f5f5f5}.recipients-input .suggestions li mark{padding:0px;text-decoration:none;background:none;font-weight:600}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 2032
/*!*******************************************!*\
  !*** ./node_modules/lodash/_hashClear.js ***!
  \*******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ 1042);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ },

/***/ 2147
/*!******************************************************!*\
  !*** ./node_modules/react-dnd/lib/registerSource.js ***!
  \******************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function registerSource(type, source, manager) {
    var registry = manager.getRegistry();
    var sourceId = registry.addSource(type, source);
    function unregisterSource() {
        registry.removeSource(sourceId);
    }
    return {
        handlerId: sourceId,
        unregister: unregisterSource,
    };
}
exports["default"] = registerSource;


/***/ },

/***/ 2199
/*!************************************************!*\
  !*** ./node_modules/lodash/_baseGetAllKeys.js ***!
  \************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ 4528),
    isArray = __webpack_require__(/*! ./isArray */ 6449);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ },

/***/ 2224
/*!***********************************************!*\
  !*** ./node_modules/lodash/_memoizeCapped.js ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var memoize = __webpack_require__(/*! ./memoize */ 104);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ },

/***/ 2246
/*!*************************************************************!*\
  !*** ./node_modules/dnd-core/lib/reducers/dragOperation.js ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var dragDrop_1 = __webpack_require__(/*! ../actions/dragDrop */ 580);
var registry_1 = __webpack_require__(/*! ../actions/registry */ 4092);
var without = __webpack_require__(/*! lodash/without */ 1648);
var initialState = {
    itemType: null,
    item: null,
    sourceId: null,
    targetIds: [],
    dropResult: null,
    didDrop: false,
    isSourcePublic: null,
};
function dragOperation(state, action) {
    if (state === void 0) { state = initialState; }
    var payload = action.payload;
    switch (action.type) {
        case dragDrop_1.BEGIN_DRAG:
            return __assign({}, state, { itemType: payload.itemType, item: payload.item, sourceId: payload.sourceId, isSourcePublic: payload.isSourcePublic, dropResult: null, didDrop: false });
        case dragDrop_1.PUBLISH_DRAG_SOURCE:
            return __assign({}, state, { isSourcePublic: true });
        case dragDrop_1.HOVER:
            return __assign({}, state, { targetIds: payload.targetIds });
        case registry_1.REMOVE_TARGET:
            if (state.targetIds.indexOf(payload.targetId) === -1) {
                return state;
            }
            return __assign({}, state, { targetIds: without(state.targetIds, payload.targetId) });
        case dragDrop_1.DROP:
            return __assign({}, state, { dropResult: payload.dropResult, didDrop: true, targetIds: [] });
        case dragDrop_1.END_DRAG:
            return __assign({}, state, { itemType: null, item: null, sourceId: null, dropResult: null, didDrop: false, isSourcePublic: null, targetIds: [] });
        default:
            return state;
    }
}
exports["default"] = dragOperation;


/***/ },

/***/ 2284
/*!*********************************************!*\
  !*** ./node_modules/lodash/_getFuncName.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var realNames = __webpack_require__(/*! ./_realNames */ 4629);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the name of `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {string} Returns the function name.
 */
function getFuncName(func) {
  var result = (func.name + ''),
      array = realNames[result],
      length = hasOwnProperty.call(realNames, result) ? array.length : 0;

  while (length--) {
    var data = array[length],
        otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}

module.exports = getFuncName;


/***/ },

/***/ 2312
/*!****************************************************************!*\
  !*** ./node_modules/react-transition-group/TransitionGroup.js ***!
  \****************************************************************/
(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ 5556));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ 1594));

var _reactLifecyclesCompat = __webpack_require__(/*! react-lifecycles-compat */ 1345);

var _TransitionGroupContext = _interopRequireDefault(__webpack_require__(/*! ./TransitionGroupContext */ 8605));

var _ChildMapping = __webpack_require__(/*! ./utils/ChildMapping */ 2958);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var values = Object.values || function (obj) {
  return Object.keys(obj).map(function (k) {
    return obj[k];
  });
};

var defaultProps = {
  component: 'div',
  childFactory: function childFactory(child) {
    return child;
  }
  /**
   * The `<TransitionGroup>` component manages a set of transition components
   * (`<Transition>` and `<CSSTransition>`) in a list. Like with the transition
   * components, `<TransitionGroup>` is a state machine for managing the mounting
   * and unmounting of components over time.
   *
   * Consider the example below. As items are removed or added to the TodoList the
   * `in` prop is toggled automatically by the `<TransitionGroup>`.
   *
   * Note that `<TransitionGroup>`  does not define any animation behavior!
   * Exactly _how_ a list item animates is up to the individual transition
   * component. This means you can mix and match animations across different list
   * items.
   */

};

var TransitionGroup =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(TransitionGroup, _React$Component);

  function TransitionGroup(props, context) {
    var _this;

    _this = _React$Component.call(this, props, context) || this;

    var handleExited = _this.handleExited.bind(_assertThisInitialized(_assertThisInitialized(_this))); // Initial children should all be entering, dependent on appear


    _this.state = {
      contextValue: {
        isMounting: true
      },
      handleExited: handleExited,
      firstRender: true
    };
    return _this;
  }

  var _proto = TransitionGroup.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.mounted = true;
    this.setState({
      contextValue: {
        isMounting: false
      }
    });
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.mounted = false;
  };

  TransitionGroup.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, _ref) {
    var prevChildMapping = _ref.children,
        handleExited = _ref.handleExited,
        firstRender = _ref.firstRender;
    return {
      children: firstRender ? (0, _ChildMapping.getInitialChildMapping)(nextProps, handleExited) : (0, _ChildMapping.getNextChildMapping)(nextProps, prevChildMapping, handleExited),
      firstRender: false
    };
  };

  _proto.handleExited = function handleExited(child, node) {
    var currentChildMapping = (0, _ChildMapping.getChildMapping)(this.props.children);
    if (child.key in currentChildMapping) return;

    if (child.props.onExited) {
      child.props.onExited(node);
    }

    if (this.mounted) {
      this.setState(function (state) {
        var children = _extends({}, state.children);

        delete children[child.key];
        return {
          children: children
        };
      });
    }
  };

  _proto.render = function render() {
    var _this$props = this.props,
        Component = _this$props.component,
        childFactory = _this$props.childFactory,
        props = _objectWithoutPropertiesLoose(_this$props, ["component", "childFactory"]);

    var contextValue = this.state.contextValue;
    var children = values(this.state.children).map(childFactory);
    delete props.appear;
    delete props.enter;
    delete props.exit;

    if (Component === null) {
      return _react.default.createElement(_TransitionGroupContext.default.Provider, {
        value: contextValue
      }, children);
    }

    return _react.default.createElement(_TransitionGroupContext.default.Provider, {
      value: contextValue
    }, _react.default.createElement(Component, props, children));
  };

  return TransitionGroup;
}(_react.default.Component);

TransitionGroup.propTypes =  false ? 0 : {};
TransitionGroup.defaultProps = defaultProps;

var _default = (0, _reactLifecyclesCompat.polyfill)(TransitionGroup);

exports["default"] = _default;
module.exports = exports["default"];

/***/ },

/***/ 2404
/*!****************************************!*\
  !*** ./node_modules/lodash/isEqual.js ***!
  \****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(/*! ./_baseIsEqual */ 270);

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

module.exports = isEqual;


/***/ },

/***/ 2428
/*!********************************************!*\
  !*** ./node_modules/lodash/isArguments.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ 7534),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 346);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ },

/***/ 2460
/*!***********************************************************************!*\
  !*** ./node_modules/react-tag-input/dist-modules/components/utils.js ***!
  \***********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.buildRegExpFromDelimiters = buildRegExpFromDelimiters;
exports.canDrag = canDrag;
exports.canDrop = canDrop;

var _escapeRegExp = __webpack_require__(/*! lodash/escapeRegExp */ 680);

var _escapeRegExp2 = _interopRequireDefault(_escapeRegExp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert an array of delimiter characters into a regular expression
 * that can be used to split content by those delimiters.
 * @param {Array<char>} delimiters Array of characters to turn into a regex
 * @returns {RegExp} Regular expression
 */
function buildRegExpFromDelimiters(delimiters) {
  var delimiterChars = delimiters.map(function (delimiter) {
    // See: http://stackoverflow.com/a/34711175/1463681
    var chrCode = delimiter - 48 * Math.floor(delimiter / 48);
    return String.fromCharCode(96 <= delimiter ? chrCode : delimiter);
  }).join('');
  var escapedDelimiterChars = (0, _escapeRegExp2.default)(delimiterChars);
  return new RegExp('[' + escapedDelimiterChars + ']+');
}

/**
 * Returns true when the tag is drag enabled
 * @param {object} params props of the tag element
 * @returns {boolean} true/false
 * The three different properties which controls this function are moveTag, readOnly and allowDragDrop.
 */
function canDrag(params) {
  var moveTag = params.moveTag,
      readOnly = params.readOnly,
      allowDragDrop = params.allowDragDrop;

  return moveTag !== undefined && !readOnly && allowDragDrop;
}

/**
 * Returns true when the tag is drop enabled
 * @param {object} params props of the tag element
 * @returns {boolean} true/false
 * The two different properties which controls this function are readOnly and allowDragDrop.
 */
function canDrop(params) {
  var readOnly = params.readOnly,
      allowDragDrop = params.allowDragDrop;

  return !readOnly && allowDragDrop;
}

/***/ },

/***/ 2485
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else // removed by dead control flow
{}
}());


/***/ },

/***/ 2523
/*!***********************************************!*\
  !*** ./node_modules/lodash/_baseFindIndex.js ***!
  \***********************************************/
(module) {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ },

/***/ 2552
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ 1873),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ 659),
    objectToString = __webpack_require__(/*! ./_objectToString */ 9350);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ },

/***/ 2651
/*!********************************************!*\
  !*** ./node_modules/lodash/_getMapData.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isKeyable = __webpack_require__(/*! ./_isKeyable */ 4218);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ },

/***/ 2694
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithThrowingShims.js ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ 6925);

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ },

/***/ 2749
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashHas.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ 1042);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ },

/***/ 2768
/*!***************************************************************************!*\
  !*** ./node_modules/react-tag-input/dist-modules/components/ReactTags.js ***!
  \***************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ 1594);

var _react2 = _interopRequireDefault(_react);

var _reactDnd = __webpack_require__(/*! react-dnd */ 7987);

var _reactDndHtml5Backend = __webpack_require__(/*! react-dnd-html5-backend */ 5259);

var _reactDndHtml5Backend2 = _interopRequireDefault(_reactDndHtml5Backend);

var _isEqual = __webpack_require__(/*! lodash/isEqual */ 2404);

var _isEqual2 = _interopRequireDefault(_isEqual);

var _noop = __webpack_require__(/*! lodash/noop */ 3950);

var _noop2 = _interopRequireDefault(_noop);

var _uniq = __webpack_require__(/*! lodash/uniq */ 3375);

var _uniq2 = _interopRequireDefault(_uniq);

var _Suggestions = __webpack_require__(/*! ./Suggestions */ 7315);

var _Suggestions2 = _interopRequireDefault(_Suggestions);

var _propTypes = __webpack_require__(/*! prop-types */ 5556);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = __webpack_require__(/*! classnames */ 2485);

var _classnames2 = _interopRequireDefault(_classnames);

var _Tag = __webpack_require__(/*! ./Tag */ 4214);

var _Tag2 = _interopRequireDefault(_Tag);

var _utils = __webpack_require__(/*! ./utils */ 2460);

var _constants = __webpack_require__(/*! ./constants */ 4319);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Constants


var ReactTags = function (_Component) {
  _inherits(ReactTags, _Component);

  function ReactTags(props) {
    _classCallCheck(this, ReactTags);

    var _this = _possibleConstructorReturn(this, (ReactTags.__proto__ || Object.getPrototypeOf(ReactTags)).call(this, props));

    _initialiseProps.call(_this);

    if (!props.inline) {
      /* eslint-disable no-console */
      console.warn('[Deprecation] The inline attribute is deprecated and will be removed in v7.x.x, please use inputFieldPosition instead.');
      /* eslint-enable no-console */
    }

    var suggestions = props.suggestions;

    _this.state = {
      suggestions: suggestions,
      query: '',
      isFocused: false,
      selectedIndex: -1,
      selectionMode: false,
      ariaLiveStatus: ''
    };
    _this.reactTagsRef = (0, _react.createRef)();
    _this.handleFocus = _this.handleFocus.bind(_this);
    _this.handleBlur = _this.handleBlur.bind(_this);
    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.moveTag = _this.moveTag.bind(_this);
    _this.handlePaste = _this.handlePaste.bind(_this);
    _this.handleSuggestionHover = _this.handleSuggestionHover.bind(_this);
    _this.handleSuggestionClick = _this.handleSuggestionClick.bind(_this);
    return _this;
  }

  _createClass(ReactTags, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          autofocus = _props.autofocus,
          readOnly = _props.readOnly;


      if (autofocus && !readOnly) {
        this.resetAndFocusInput();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (!(0, _isEqual2.default)(prevProps.suggestions, this.props.suggestions)) {
        this.updateSuggestions();
      }
    }
  }, {
    key: 'filteredSuggestions',
    value: function filteredSuggestions(query, suggestions) {
      var _this2 = this;

      if (this.props.handleFilterSuggestions) {
        return this.props.handleFilterSuggestions(query, suggestions);
      }

      var exactSuggestions = suggestions.filter(function (item) {
        return _this2.getQueryIndex(query, item) === 0;
      });
      var partialSuggestions = suggestions.filter(function (item) {
        return _this2.getQueryIndex(query, item) > 0;
      });
      return exactSuggestions.concat(partialSuggestions);
    }
  }, {
    key: 'handleDelete',
    value: function handleDelete(index, event) {
      event.preventDefault();
      event.stopPropagation();
      var currentTags = this.props.tags.slice();
      // Early exit from the function if the array
      // is already empty
      if (currentTags.length === 0) {
        return;
      }
      var ariaLiveStatus = 'Tag at index ' + index + ' with value ' + currentTags[index].id + ' deleted.';
      this.props.handleDelete(index, event);
      var allTags = this.reactTagsRef.current.querySelectorAll('.ReactTags__remove');
      var nextElementToFocus = void 0,
          nextIndex = void 0,
          nextTag = void 0;
      if (index === 0 && currentTags.length > 1) {
        nextElementToFocus = allTags[0];
        nextIndex = 0;
        nextTag = currentTags[1];
      } else {
        nextElementToFocus = allTags[index - 1];
        nextIndex = index - 1;
        nextTag = currentTags[nextIndex];
      }
      if (!nextElementToFocus) {
        nextIndex = -1;
        nextElementToFocus = this.textInput;
      }
      if (nextIndex >= 0) {
        ariaLiveStatus += ' Tag at index ' + nextIndex + ' with value ' + nextTag.id + ' focussed. Press backspace to remove';
      } else {
        ariaLiveStatus += 'Input focussed. Press enter to add a new tag';
      }
      nextElementToFocus.focus();
      this.setState({
        ariaLiveStatus: ariaLiveStatus
      });
    }
  }, {
    key: 'handleTagClick',
    value: function handleTagClick(i, e) {
      if (this.props.handleTagClick) {
        this.props.handleTagClick(i, e);
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(e) {
      if (this.props.handleInputChange) {
        this.props.handleInputChange(e.target.value);
      }

      var query = e.target.value.trim();

      this.setState({ query: query }, this.updateSuggestions);
    }
  }, {
    key: 'handleFocus',
    value: function handleFocus(event) {
      var value = event.target.value;
      if (this.props.handleInputFocus) {
        this.props.handleInputFocus(value);
      }
      this.setState({ isFocused: true });
    }
  }, {
    key: 'handleBlur',
    value: function handleBlur(event) {
      var value = event.target.value;
      if (this.props.handleInputBlur) {
        this.props.handleInputBlur(value);
        if (this.textInput) {
          this.textInput.value = '';
        }
      }
      this.setState({ isFocused: false });
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(e) {
      var _state = this.state,
          query = _state.query,
          selectedIndex = _state.selectedIndex,
          suggestions = _state.suggestions,
          selectionMode = _state.selectionMode;

      // hide suggestions menu on escape

      if (e.keyCode === _constants.KEYS.ESCAPE) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
          selectedIndex: -1,
          selectionMode: false,
          suggestions: []
        });
      }

      // When one of the terminating keys is pressed, add current query to the tags.
      // If no text is typed in so far, ignore the action - so we don't end up with a terminating
      // character typed in.
      if (this.props.delimiters.indexOf(e.keyCode) !== -1 && !e.shiftKey) {
        if (e.keyCode !== _constants.KEYS.TAB || query !== '') {
          e.preventDefault();
        }

        var selectedQuery = selectionMode && selectedIndex !== -1 ? suggestions[selectedIndex] : _defineProperty({ id: query }, this.props.labelField, query);

        if (selectedQuery !== '') {
          this.addTag(selectedQuery);
        }
      }

      // when backspace key is pressed and query is blank, delete tag
      if (e.keyCode === _constants.KEYS.BACKSPACE && query === '' && this.props.allowDeleteFromEmptyInput) {
        this.handleDelete(this.props.tags.length - 1, e);
      }

      // up arrow
      if (e.keyCode === _constants.KEYS.UP_ARROW) {
        e.preventDefault();
        this.setState({
          selectedIndex: selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1,
          selectionMode: true
        });
      }

      // down arrow
      if (e.keyCode === _constants.KEYS.DOWN_ARROW) {
        e.preventDefault();
        this.setState({
          selectedIndex: suggestions.length === 0 ? -1 : (selectedIndex + 1) % suggestions.length,
          selectionMode: true
        });
      }
    }
  }, {
    key: 'handlePaste',
    value: function handlePaste(e) {
      var _this3 = this;

      if (!this.props.allowAdditionFromPaste) {
        return;
      }

      e.preventDefault();

      var clipboardData = e.clipboardData || window.clipboardData;
      var clipboardText = clipboardData.getData('text');

      var _props$maxLength = this.props.maxLength,
          maxLength = _props$maxLength === undefined ? clipboardText.length : _props$maxLength;


      var maxTextLength = Math.min(maxLength, clipboardText.length);
      var pastedText = clipboardData.getData('text').substr(0, maxTextLength);

      // Used to determine how the pasted content is split.
      var delimiterRegExp = (0, _utils.buildRegExpFromDelimiters)(this.props.delimiters);
      var tags = pastedText.split(delimiterRegExp);

      // Only add unique tags
      (0, _uniq2.default)(tags).forEach(function (tag) {
        return _this3.addTag(_defineProperty({ id: tag }, _this3.props.labelField, tag));
      });
    }
  }, {
    key: 'handleSuggestionClick',
    value: function handleSuggestionClick(i) {
      this.addTag(this.state.suggestions[i]);
    }
  }, {
    key: 'handleSuggestionHover',
    value: function handleSuggestionHover(i) {
      this.setState({
        selectedIndex: i,
        selectionMode: true
      });
    }
  }, {
    key: 'moveTag',
    value: function moveTag(dragIndex, hoverIndex) {
      var tags = this.props.tags;

      // locate tags
      var dragTag = tags[dragIndex];

      // call handler with the index of the dragged tag
      // and the tag that is hovered
      this.props.handleDrag(dragTag, dragIndex, hoverIndex);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var tagItems = this.getTagItems();
      var classNames = _extends({}, _constants.DEFAULT_CLASSNAMES, this.props.classNames);

      // get the suggestions for the given query
      var query = this.state.query.trim(),
          selectedIndex = this.state.selectedIndex,
          suggestions = this.state.suggestions;

      var _props2 = this.props,
          placeholder = _props2.placeholder,
          inputName = _props2.name,
          inputId = _props2.id,
          maxLength = _props2.maxLength,
          inline = _props2.inline,
          inputFieldPosition = _props2.inputFieldPosition;


      var position = !inline ? _constants.INPUT_FIELD_POSITIONS.BOTTOM : inputFieldPosition;

      var tagInput = !this.props.readOnly ? _react2.default.createElement(
        'div',
        { className: classNames.tagInput },
        _react2.default.createElement('input', {
          ref: function ref(input) {
            _this4.textInput = input;
          },
          className: classNames.tagInputField,
          type: 'text',
          placeholder: placeholder,
          'aria-label': placeholder,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
          onChange: this.handleChange,
          onKeyDown: this.handleKeyDown,
          onPaste: this.handlePaste,
          name: inputName,
          id: inputId,
          maxLength: maxLength,
          value: this.props.inputValue
        }),
        _react2.default.createElement(_Suggestions2.default, {
          query: query,
          suggestions: suggestions,
          labelField: this.props.labelField,
          selectedIndex: selectedIndex,
          handleClick: this.handleSuggestionClick,
          handleHover: this.handleSuggestionHover,
          minQueryLength: this.props.minQueryLength,
          shouldRenderSuggestions: this.props.shouldRenderSuggestions,
          isFocused: this.state.isFocused,
          classNames: classNames,
          renderSuggestion: this.props.renderSuggestion
        })
      ) : null;

      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)(classNames.tags, 'react-tags-wrapper'),
          ref: this.reactTagsRef },
        _react2.default.createElement(
          'p',
          {
            role: 'alert',
            className: 'sr-only',
            style: {
              position: 'absolute',
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
              margin: '-1px',
              padding: 0,
              width: '1px',
              height: '1px',
              border: 0
            } },
          this.state.ariaLiveStatus
        ),
        position === _constants.INPUT_FIELD_POSITIONS.TOP && tagInput,
        _react2.default.createElement(
          'div',
          { className: classNames.selected },
          tagItems,
          position === _constants.INPUT_FIELD_POSITIONS.INLINE && tagInput
        ),
        position === _constants.INPUT_FIELD_POSITIONS.BOTTOM && tagInput
      );
    }
  }]);

  return ReactTags;
}(_react.Component);

ReactTags.propTypes = {
  placeholder: _propTypes2.default.string,
  labelField: _propTypes2.default.string,
  suggestions: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired
  })),
  delimiters: _propTypes2.default.arrayOf(_propTypes2.default.number),
  autofocus: _propTypes2.default.bool,
  inline: _propTypes2.default.bool, // TODO: Remove in v7.x.x
  inputFieldPosition: _propTypes2.default.oneOf([_constants.INPUT_FIELD_POSITIONS.INLINE, _constants.INPUT_FIELD_POSITIONS.TOP, _constants.INPUT_FIELD_POSITIONS.BOTTOM]),
  handleDelete: _propTypes2.default.func,
  handleAddition: _propTypes2.default.func,
  handleDrag: _propTypes2.default.func,
  handleFilterSuggestions: _propTypes2.default.func,
  handleTagClick: _propTypes2.default.func,
  allowDeleteFromEmptyInput: _propTypes2.default.bool,
  allowAdditionFromPaste: _propTypes2.default.bool,
  allowDragDrop: _propTypes2.default.bool,
  handleInputChange: _propTypes2.default.func,
  handleInputFocus: _propTypes2.default.func,
  handleInputBlur: _propTypes2.default.func,
  minQueryLength: _propTypes2.default.number,
  shouldRenderSuggestions: _propTypes2.default.func,
  removeComponent: _propTypes2.default.func,
  autocomplete: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]),
  readOnly: _propTypes2.default.bool,
  classNames: _propTypes2.default.object,
  name: _propTypes2.default.string,
  id: _propTypes2.default.string,
  maxLength: _propTypes2.default.number,
  inputValue: _propTypes2.default.string,
  tags: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired,
    className: _propTypes2.default.string
  })),
  allowUnique: _propTypes2.default.bool,
  renderSuggestion: _propTypes2.default.func
};
ReactTags.defaultProps = {
  placeholder: _constants.DEFAULT_PLACEHOLDER,
  labelField: _constants.DEFAULT_LABEL_FIELD,
  suggestions: [],
  delimiters: [_constants.KEYS.ENTER, _constants.KEYS.TAB],
  autofocus: true,
  inline: true, // TODO: Remove in v7.x.x
  inputFieldPosition: _constants.INPUT_FIELD_POSITIONS.INLINE,
  handleDelete: _noop2.default,
  handleAddition: _noop2.default,
  allowDeleteFromEmptyInput: true,
  allowAdditionFromPaste: true,
  autocomplete: false,
  readOnly: false,
  allowUnique: true,
  allowDragDrop: true,
  tags: []
};

var _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this.getQueryIndex = function (query, item) {
    return item[_this5.props.labelField].toLowerCase().indexOf(query.toLowerCase());
  };

  this.resetAndFocusInput = function () {
    _this5.setState({ query: '' });
    if (_this5.textInput) {
      _this5.textInput.value = '';
      _this5.textInput.focus();
    }
  };

  this.updateSuggestions = function () {
    var _state2 = _this5.state,
        query = _state2.query,
        selectedIndex = _state2.selectedIndex;

    var suggestions = _this5.filteredSuggestions(query, _this5.props.suggestions);

    _this5.setState({
      suggestions: suggestions,
      selectedIndex: selectedIndex >= suggestions.length ? suggestions.length - 1 : selectedIndex
    });
  };

  this.addTag = function (tag) {
    var _props3 = _this5.props,
        tags = _props3.tags,
        labelField = _props3.labelField,
        allowUnique = _props3.allowUnique;

    if (!tag.id || !tag[labelField]) {
      return;
    }
    var existingKeys = tags.map(function (tag) {
      return tag.id.toLowerCase();
    });

    // Return if tag has been already added
    if (allowUnique && existingKeys.indexOf(tag.id.toLowerCase()) >= 0) {
      return;
    }
    if (_this5.props.autocomplete) {
      var possibleMatches = _this5.filteredSuggestions(tag[labelField], _this5.props.suggestions);

      if (_this5.props.autocomplete === 1 && possibleMatches.length === 1 || _this5.props.autocomplete === true && possibleMatches.length) {
        tag = possibleMatches[0];
      }
    }

    // call method to add
    _this5.props.handleAddition(tag);

    // reset the state
    _this5.setState({
      query: '',
      selectionMode: false,
      selectedIndex: -1
    });

    _this5.resetAndFocusInput();
  };

  this.getTagItems = function () {
    var _props4 = _this5.props,
        classNames = _props4.classNames,
        tags = _props4.tags,
        labelField = _props4.labelField,
        removeComponent = _props4.removeComponent,
        readOnly = _props4.readOnly,
        allowDragDrop = _props4.allowDragDrop;


    var moveTag = allowDragDrop ? _this5.moveTag : null;
    return tags.map(function (tag, index) {
      return _react2.default.createElement(_Tag2.default, {
        key: index,
        index: index,
        tag: tag,
        labelField: labelField,
        onDelete: _this5.handleDelete.bind(_this5, index),
        moveTag: moveTag,
        removeComponent: removeComponent,
        onTagClicked: _this5.handleTagClick.bind(_this5, index),
        readOnly: readOnly,
        classNames: _extends({}, _constants.DEFAULT_CLASSNAMES, classNames),
        allowDragDrop: allowDragDrop
      });
    });
  };
};

module.exports = {
  WithContext: (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend2.default)(ReactTags),
  WithOutContext: ReactTags,
  KEYS: _constants.KEYS
};

/***/ },

/***/ 2795
/*!********************************************************************!*\
  !*** ./node_modules/react-dnd/lib/utils/disposables/Disposable.js ***!
  \********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var isFunction = __webpack_require__(/*! lodash/isFunction */ 1882);
var noop = __webpack_require__(/*! lodash/noop */ 3950);
/**
 * Provides a set of static methods for creating Disposables.
 * @param {Function} action Action to run during the first call to dispose.
 * The action is guaranteed to be run at most once.
 */
var Disposable = /** @class */ (function () {
    function Disposable(action) {
        this.isDisposed = false;
        this.action = isFunction(action) ? action : noop;
    }
    /**
     * Validates whether the given object is a disposable
     * @param {Object} Object to test whether it has a dispose method
     * @returns {Boolean} true if a disposable object, else false.
     */
    Disposable.isDisposable = function (d) {
        return d && isFunction(d.dispose);
    };
    Disposable._fixup = function (result) {
        return Disposable.isDisposable(result) ? result : Disposable.empty;
    };
    /**
     * Creates a disposable object that invokes the specified action when disposed.
     * @param {Function} dispose Action to run during the first call to dispose.
     * The action is guaranteed to be run at most once.
     * @return {Disposable} The disposable object that runs the given action upon disposal.
     */
    Disposable.create = function (action) {
        return new Disposable(action);
    };
    /** Performs the task of cleaning up resources. */
    Disposable.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.action();
            this.isDisposed = true;
        }
    };
    /**
     * Gets the disposable that does nothing when disposed.
     */
    Disposable.empty = { dispose: noop };
    return Disposable;
}());
exports.Disposable = Disposable;


/***/ },

/***/ 2804
/*!*****************************************!*\
  !*** ./node_modules/lodash/_Promise.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ 6110),
    root = __webpack_require__(/*! ./_root */ 9325);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ },

/***/ 2833
/*!********************************************!*\
  !*** ./node_modules/shallowequal/index.js ***!
  \********************************************/
(module) {

//

module.exports = function shallowEqual(objA, objB, compare, compareContext) {
  var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

  if (ret !== void 0) {
    return !!ret;
  }

  if (objA === objB) {
    return true;
  }

  if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  // Test for A's keys different from B.
  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    var valueA = objA[key];
    var valueB = objB[key];

    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

    if (ret === false || (ret === void 0 && valueA !== valueB)) {
      return false;
    }
  }

  return true;
};


/***/ },

/***/ 2865
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setToString.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseSetToString = __webpack_require__(/*! ./_baseSetToString */ 9570),
    shortOut = __webpack_require__(/*! ./_shortOut */ 1811);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ },

/***/ 2903
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseKeysIn.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./isObject */ 3805),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ 5527),
    nativeKeysIn = __webpack_require__(/*! ./_nativeKeysIn */ 181);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ },

/***/ 2949
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheSet.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ 2651);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ },

/***/ 2958
/*!*******************************************************************!*\
  !*** ./node_modules/react-transition-group/utils/ChildMapping.js ***!
  \*******************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getChildMapping = getChildMapping;
exports.mergeChildMappings = mergeChildMappings;
exports.getInitialChildMapping = getInitialChildMapping;
exports.getNextChildMapping = getNextChildMapping;

var _react = __webpack_require__(/*! react */ 1594);

/**
 * Given `this.props.children`, return an object mapping key to child.
 *
 * @param {*} children `this.props.children`
 * @return {object} Mapping of key to child
 */
function getChildMapping(children, mapFn) {
  var mapper = function mapper(child) {
    return mapFn && (0, _react.isValidElement)(child) ? mapFn(child) : child;
  };

  var result = Object.create(null);
  if (children) _react.Children.map(children, function (c) {
    return c;
  }).forEach(function (child) {
    // run the map function here instead so that the key is the computed one
    result[child.key] = mapper(child);
  });
  return result;
}
/**
 * When you're adding or removing children some may be added or removed in the
 * same render pass. We want to show *both* since we want to simultaneously
 * animate elements in and out. This function takes a previous set of keys
 * and a new set of keys and merges them with its best guess of the correct
 * ordering. In the future we may expose some of the utilities in
 * ReactMultiChild to make this easy, but for now React itself does not
 * directly have this concept of the union of prevChildren and nextChildren
 * so we implement it here.
 *
 * @param {object} prev prev children as returned from
 * `ReactTransitionChildMapping.getChildMapping()`.
 * @param {object} next next children as returned from
 * `ReactTransitionChildMapping.getChildMapping()`.
 * @return {object} a key set that contains all keys in `prev` and all keys
 * in `next` in a reasonable order.
 */


function mergeChildMappings(prev, next) {
  prev = prev || {};
  next = next || {};

  function getValueForKey(key) {
    return key in next ? next[key] : prev[key];
  } // For each key of `next`, the list of keys to insert before that key in
  // the combined list


  var nextKeysPending = Object.create(null);
  var pendingKeys = [];

  for (var prevKey in prev) {
    if (prevKey in next) {
      if (pendingKeys.length) {
        nextKeysPending[prevKey] = pendingKeys;
        pendingKeys = [];
      }
    } else {
      pendingKeys.push(prevKey);
    }
  }

  var i;
  var childMapping = {};

  for (var nextKey in next) {
    if (nextKeysPending[nextKey]) {
      for (i = 0; i < nextKeysPending[nextKey].length; i++) {
        var pendingNextKey = nextKeysPending[nextKey][i];
        childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
      }
    }

    childMapping[nextKey] = getValueForKey(nextKey);
  } // Finally, add the keys which didn't appear before any key in `next`


  for (i = 0; i < pendingKeys.length; i++) {
    childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
  }

  return childMapping;
}

function getProp(child, prop, props) {
  return props[prop] != null ? props[prop] : child.props[prop];
}

function getInitialChildMapping(props, onExited) {
  return getChildMapping(props.children, function (child) {
    return (0, _react.cloneElement)(child, {
      onExited: onExited.bind(null, child),
      in: true,
      appear: getProp(child, 'appear', props),
      enter: getProp(child, 'enter', props),
      exit: getProp(child, 'exit', props)
    });
  });
}

function getNextChildMapping(nextProps, prevChildMapping, onExited) {
  var nextChildMapping = getChildMapping(nextProps.children);
  var children = mergeChildMappings(prevChildMapping, nextChildMapping);
  Object.keys(children).forEach(function (key) {
    var child = children[key];
    if (!(0, _react.isValidElement)(child)) return;
    var hasPrev = key in prevChildMapping;
    var hasNext = key in nextChildMapping;
    var prevChild = prevChildMapping[key];
    var isLeaving = (0, _react.isValidElement)(prevChild) && !prevChild.props.in; // item is new (entering)

    if (hasNext && (!hasPrev || isLeaving)) {
      // console.log('entering', key)
      children[key] = (0, _react.cloneElement)(child, {
        onExited: onExited.bind(null, child),
        in: true,
        exit: getProp(child, 'exit', nextProps),
        enter: getProp(child, 'enter', nextProps)
      });
    } else if (!hasNext && hasPrev && !isLeaving) {
      // item is old (exiting)
      // console.log('leaving', key)
      children[key] = (0, _react.cloneElement)(child, {
        in: false
      });
    } else if (hasNext && hasPrev && (0, _react.isValidElement)(prevChild)) {
      // item hasn't changed transition states
      // copy over the last transition props;
      // console.log('unchanged', key)
      children[key] = (0, _react.cloneElement)(child, {
        onExited: onExited.bind(null, child),
        in: prevChild.props.in,
        exit: getProp(child, 'exit', nextProps),
        enter: getProp(child, 'enter', nextProps)
      });
    }
  });
  return children;
}

/***/ },

/***/ 2963
/*!****************************************************!*\
  !*** ./node_modules/dom-helpers/class/addClass.js ***!
  \****************************************************/
(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4994);

exports.__esModule = true;
exports["default"] = addClass;

var _hasClass = _interopRequireDefault(__webpack_require__(/*! ./hasClass */ 598));

function addClass(element, className) {
  if (element.classList) element.classList.add(className);else if (!(0, _hasClass.default)(element, className)) if (typeof element.className === 'string') element.className = element.className + ' ' + className;else element.setAttribute('class', (element.className && element.className.baseVal || '') + ' ' + className);
}

module.exports = exports["default"];

/***/ },

/***/ 3007
/*!*******************************************!*\
  !*** ./node_modules/lodash/_copyArray.js ***!
  \*******************************************/
(module) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ },

/***/ 3040
/*!***********************************************!*\
  !*** ./node_modules/lodash/_mapCacheClear.js ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var Hash = __webpack_require__(/*! ./_Hash */ 1549),
    ListCache = __webpack_require__(/*! ./_ListCache */ 79),
    Map = __webpack_require__(/*! ./_Map */ 8223);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ },

/***/ 3067
/*!*************************************************!*\
  !*** ./node_modules/dnd-core/lib/interfaces.js ***!
  \*************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var HandlerRole;
(function (HandlerRole) {
    HandlerRole["SOURCE"] = "SOURCE";
    HandlerRole["TARGET"] = "TARGET";
})(HandlerRole = exports.HandlerRole || (exports.HandlerRole = {}));


/***/ },

/***/ 3120
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseFlatten.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ 4528),
    isFlattenable = __webpack_require__(/*! ./_isFlattenable */ 5891);

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ },

/***/ 3123
/*!***************************************************!*\
  !*** ./node_modules/dnd-core/lib/utils/coords.js ***!
  \***************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Coordinate addition
 * @param a The first coordinate
 * @param b The second coordinate
 */
function add(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}
exports.add = add;
/**
 * Coordinate subtraction
 * @param a The first coordinate
 * @param b The second coordinate
 */
function subtract(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    };
}
exports.subtract = subtract;
/**
 * Returns the cartesian distance of the drag source component's position, based on its position
 * at the time when the current drag operation has started, and the movement difference.
 *
 * Returns null if no item is being dragged.
 *
 * @param state The offset state to compute from
 */
function getSourceClientOffset(state) {
    var clientOffset = state.clientOffset, initialClientOffset = state.initialClientOffset, initialSourceClientOffset = state.initialSourceClientOffset;
    if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
        return null;
    }
    return subtract(add(clientOffset, initialSourceClientOffset), initialClientOffset);
}
exports.getSourceClientOffset = getSourceClientOffset;
/**
 * Determines the x,y offset between the client offset and the initial client offset
 *
 * @param state The offset state to compute from
 */
function getDifferenceFromInitialOffset(state) {
    var clientOffset = state.clientOffset, initialClientOffset = state.initialClientOffset;
    if (!clientOffset || !initialClientOffset) {
        return null;
    }
    return subtract(clientOffset, initialClientOffset);
}
exports.getDifferenceFromInitialOffset = getDifferenceFromInitialOffset;


/***/ },

/***/ 3222
/*!*****************************************!*\
  !*** ./node_modules/lodash/toString.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseToString = __webpack_require__(/*! ./_baseToString */ 7556);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ },

/***/ 3243
/*!************************************************!*\
  !*** ./node_modules/lodash/_defineProperty.js ***!
  \************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ 6110);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ },

/***/ 3344
/*!***********************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/EnterLeaveCounter.js ***!
  \***********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var union_1 = __importDefault(__webpack_require__(/*! lodash/union */ 299));
var without_1 = __importDefault(__webpack_require__(/*! lodash/without */ 1648));
var EnterLeaveCounter = /** @class */ (function () {
    function EnterLeaveCounter() {
        this.entered = [];
    }
    EnterLeaveCounter.prototype.enter = function (enteringNode) {
        var previousLength = this.entered.length;
        var isNodeEntered = function (node) {
            return document.documentElement.contains(node) &&
                (!node.contains || node.contains(enteringNode));
        };
        this.entered = union_1.default(this.entered.filter(isNodeEntered), [enteringNode]);
        return previousLength === 0 && this.entered.length > 0;
    };
    EnterLeaveCounter.prototype.leave = function (leavingNode) {
        var previousLength = this.entered.length;
        this.entered = without_1.default(this.entered.filter(function (node) { return document.documentElement.contains(node); }), leavingNode);
        return previousLength > 0 && this.entered.length === 0;
    };
    EnterLeaveCounter.prototype.reset = function () {
        this.entered = [];
    };
    return EnterLeaveCounter;
}());
exports["default"] = EnterLeaveCounter;
//# sourceMappingURL=EnterLeaveCounter.js.map

/***/ },

/***/ 3345
/*!******************************************!*\
  !*** ./node_modules/lodash/stubArray.js ***!
  \******************************************/
(module) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ },

/***/ 3375
/*!*************************************!*\
  !*** ./node_modules/lodash/uniq.js ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseUniq = __webpack_require__(/*! ./_baseUniq */ 5765);

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length) ? baseUniq(array) : [];
}

module.exports = uniq;


/***/ },

/***/ 3488
/*!*****************************************!*\
  !*** ./node_modules/lodash/identity.js ***!
  \*****************************************/
(module) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ },

/***/ 3499
/*!***************************************************************!*\
  !*** ./node_modules/dnd-core/lib/reducers/dirtyHandlerIds.js ***!
  \***************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var dragDrop_1 = __webpack_require__(/*! ../actions/dragDrop */ 580);
var registry_1 = __webpack_require__(/*! ../actions/registry */ 4092);
var equality_1 = __webpack_require__(/*! ../utils/equality */ 5977);
var dirtiness_1 = __webpack_require__(/*! ../utils/dirtiness */ 7386);
var xor = __webpack_require__(/*! lodash/xor */ 6625);
function dirtyHandlerIds(state, action) {
    if (state === void 0) { state = dirtiness_1.NONE; }
    switch (action.type) {
        case dragDrop_1.HOVER:
            break;
        case registry_1.ADD_SOURCE:
        case registry_1.ADD_TARGET:
        case registry_1.REMOVE_TARGET:
        case registry_1.REMOVE_SOURCE:
            return dirtiness_1.NONE;
        case dragDrop_1.BEGIN_DRAG:
        case dragDrop_1.PUBLISH_DRAG_SOURCE:
        case dragDrop_1.END_DRAG:
        case dragDrop_1.DROP:
        default:
            return dirtiness_1.ALL;
    }
    var _a = action.payload, _b = _a.targetIds, targetIds = _b === void 0 ? [] : _b, _c = _a.prevTargetIds, prevTargetIds = _c === void 0 ? [] : _c;
    var result = xor(targetIds, prevTargetIds);
    var didChange = result.length > 0 || !equality_1.areArraysEqual(targetIds, prevTargetIds);
    if (!didChange) {
        return dirtiness_1.NONE;
    }
    // Check the target ids at the innermost position. If they are valid, add them
    // to the result
    var prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
    var innermostTargetId = targetIds[targetIds.length - 1];
    if (prevInnermostTargetId !== innermostTargetId) {
        if (prevInnermostTargetId) {
            result.push(prevInnermostTargetId);
        }
        if (innermostTargetId) {
            result.push(innermostTargetId);
        }
    }
    return result;
}
exports["default"] = dirtyHandlerIds;


/***/ },

/***/ 3605
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackGet.js ***!
  \******************************************/
(module) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ },

/***/ 3650
/*!********************************************!*\
  !*** ./node_modules/lodash/_nativeKeys.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var overArg = __webpack_require__(/*! ./_overArg */ 4335);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ },

/***/ 3656
/*!*****************************************!*\
  !*** ./node_modules/lodash/isBuffer.js ***!
  \*****************************************/
(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(/*! ./_root */ 9325),
    stubFalse = __webpack_require__(/*! ./stubFalse */ 9935);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;


/***/ },

/***/ 3661
/*!******************************************!*\
  !*** ./node_modules/lodash/_MapCache.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(/*! ./_mapCacheClear */ 3040),
    mapCacheDelete = __webpack_require__(/*! ./_mapCacheDelete */ 7670),
    mapCacheGet = __webpack_require__(/*! ./_mapCacheGet */ 289),
    mapCacheHas = __webpack_require__(/*! ./_mapCacheHas */ 4509),
    mapCacheSet = __webpack_require__(/*! ./_mapCacheSet */ 2949);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ },

/***/ 3673
/*!**************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./src/components/util/SecurityBG.css ***!
  \**************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ 1601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.securityBG {
  position: absolute;
  width: 100%;
  min-height: 100%;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 3693
/*!**************************************************!*\
  !*** ./node_modules/lodash/isArrayLikeObject.js ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isArrayLike = __webpack_require__(/*! ./isArrayLike */ 4894),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 346);

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;


/***/ },

/***/ 3702
/*!************************************************!*\
  !*** ./node_modules/lodash/_listCacheClear.js ***!
  \************************************************/
(module) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ },

/***/ 3758
/*!**********************************************!*\
  !*** ./node_modules/lodash/wrapperLodash.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var LazyWrapper = __webpack_require__(/*! ./_LazyWrapper */ 980),
    LodashWrapper = __webpack_require__(/*! ./_LodashWrapper */ 6017),
    baseLodash = __webpack_require__(/*! ./_baseLodash */ 4033),
    isArray = __webpack_require__(/*! ./isArray */ 6449),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 346),
    wrapperClone = __webpack_require__(/*! ./_wrapperClone */ 257);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps `value` to enable implicit method
 * chain sequences. Methods that operate on and return arrays, collections,
 * and functions can be chained together. Methods that retrieve a single value
 * or may return a primitive value will automatically end the chain sequence
 * and return the unwrapped value. Otherwise, the value must be unwrapped
 * with `_#value`.
 *
 * Explicit chain sequences, which must be unwrapped with `_#value`, may be
 * enabled using `_.chain`.
 *
 * The execution of chained methods is lazy, that is, it's deferred until
 * `_#value` is implicitly or explicitly called.
 *
 * Lazy evaluation allows several methods to support shortcut fusion.
 * Shortcut fusion is an optimization to merge iteratee calls; this avoids
 * the creation of intermediate arrays and can greatly reduce the number of
 * iteratee executions. Sections of a chain sequence qualify for shortcut
 * fusion if the section is applied to an array and iteratees accept only
 * one argument. The heuristic for whether a section qualifies for shortcut
 * fusion is subject to change.
 *
 * Chaining is supported in custom builds as long as the `_#value` method is
 * directly or indirectly included in the build.
 *
 * In addition to lodash methods, wrappers have `Array` and `String` methods.
 *
 * The wrapper `Array` methods are:
 * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
 *
 * The wrapper `String` methods are:
 * `replace` and `split`
 *
 * The wrapper methods that support shortcut fusion are:
 * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
 * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
 * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
 *
 * The chainable wrapper methods are:
 * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
 * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
 * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
 * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
 * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
 * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
 * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
 * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
 * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
 * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
 * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
 * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
 * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
 * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
 * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
 * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
 * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
 * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
 * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
 * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
 * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
 * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
 * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
 * `zipObject`, `zipObjectDeep`, and `zipWith`
 *
 * The wrapper methods that are **not** chainable by default are:
 * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
 * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
 * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
 * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
 * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
 * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
 * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
 * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
 * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
 * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
 * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
 * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
 * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
 * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
 * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
 * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
 * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
 * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
 * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
 * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
 * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
 * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
 * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
 * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
 * `upperFirst`, `value`, and `words`
 *
 * @name _
 * @constructor
 * @category Seq
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // Returns an unwrapped value.
 * wrapped.reduce(_.add);
 * // => 6
 *
 * // Returns a wrapped value.
 * var squares = wrapped.map(square);
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}

// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;

module.exports = lodash;


/***/ },

/***/ 3805
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
(module) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ },

/***/ 3862
/*!********************************************!*\
  !*** ./node_modules/lodash/_hashDelete.js ***!
  \********************************************/
(module) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ },

/***/ 3886
/*!**********************************************************!*\
  !*** ./node_modules/dnd-core/lib/DragDropMonitorImpl.js ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var matchesType_1 = __webpack_require__(/*! ./utils/matchesType */ 5352);
var coords_1 = __webpack_require__(/*! ./utils/coords */ 3123);
var dirtiness_1 = __webpack_require__(/*! ./utils/dirtiness */ 7386);
var invariant = __webpack_require__(/*! invariant */ 311);
var DragDropMonitorImpl = /** @class */ (function () {
    function DragDropMonitorImpl(store, registry) {
        this.store = store;
        this.registry = registry;
    }
    DragDropMonitorImpl.prototype.subscribeToStateChange = function (listener, options) {
        var _this = this;
        if (options === void 0) { options = { handlerIds: undefined }; }
        var handlerIds = options.handlerIds;
        invariant(typeof listener === 'function', 'listener must be a function.');
        invariant(typeof handlerIds === 'undefined' || Array.isArray(handlerIds), 'handlerIds, when specified, must be an array of strings.');
        var prevStateId = this.store.getState().stateId;
        var handleChange = function () {
            var state = _this.store.getState();
            var currentStateId = state.stateId;
            try {
                var canSkipListener = currentStateId === prevStateId ||
                    (currentStateId === prevStateId + 1 &&
                        !dirtiness_1.areDirty(state.dirtyHandlerIds, handlerIds));
                if (!canSkipListener) {
                    listener();
                }
            }
            finally {
                prevStateId = currentStateId;
            }
        };
        return this.store.subscribe(handleChange);
    };
    DragDropMonitorImpl.prototype.subscribeToOffsetChange = function (listener) {
        var _this = this;
        invariant(typeof listener === 'function', 'listener must be a function.');
        var previousState = this.store.getState().dragOffset;
        var handleChange = function () {
            var nextState = _this.store.getState().dragOffset;
            if (nextState === previousState) {
                return;
            }
            previousState = nextState;
            listener();
        };
        return this.store.subscribe(handleChange);
    };
    DragDropMonitorImpl.prototype.canDragSource = function (sourceId) {
        var source = this.registry.getSource(sourceId);
        invariant(source, 'Expected to find a valid source.');
        if (this.isDragging()) {
            return false;
        }
        return source.canDrag(this, sourceId);
    };
    DragDropMonitorImpl.prototype.canDropOnTarget = function (targetId) {
        var target = this.registry.getTarget(targetId);
        invariant(target, 'Expected to find a valid target.');
        if (!this.isDragging() || this.didDrop()) {
            return false;
        }
        var targetType = this.registry.getTargetType(targetId);
        var draggedItemType = this.getItemType();
        return (matchesType_1.default(targetType, draggedItemType) && target.canDrop(this, targetId));
    };
    DragDropMonitorImpl.prototype.isDragging = function () {
        return Boolean(this.getItemType());
    };
    DragDropMonitorImpl.prototype.isDraggingSource = function (sourceId) {
        var source = this.registry.getSource(sourceId, true);
        invariant(source, 'Expected to find a valid source.');
        if (!this.isDragging() || !this.isSourcePublic()) {
            return false;
        }
        var sourceType = this.registry.getSourceType(sourceId);
        var draggedItemType = this.getItemType();
        if (sourceType !== draggedItemType) {
            return false;
        }
        return source.isDragging(this, sourceId);
    };
    DragDropMonitorImpl.prototype.isOverTarget = function (targetId, options) {
        if (options === void 0) { options = { shallow: false }; }
        var shallow = options.shallow;
        if (!this.isDragging()) {
            return false;
        }
        var targetType = this.registry.getTargetType(targetId);
        var draggedItemType = this.getItemType();
        if (draggedItemType && !matchesType_1.default(targetType, draggedItemType)) {
            return false;
        }
        var targetIds = this.getTargetIds();
        if (!targetIds.length) {
            return false;
        }
        var index = targetIds.indexOf(targetId);
        if (shallow) {
            return index === targetIds.length - 1;
        }
        else {
            return index > -1;
        }
    };
    DragDropMonitorImpl.prototype.getItemType = function () {
        return this.store.getState().dragOperation.itemType;
    };
    DragDropMonitorImpl.prototype.getItem = function () {
        return this.store.getState().dragOperation.item;
    };
    DragDropMonitorImpl.prototype.getSourceId = function () {
        return this.store.getState().dragOperation.sourceId;
    };
    DragDropMonitorImpl.prototype.getTargetIds = function () {
        return this.store.getState().dragOperation.targetIds;
    };
    DragDropMonitorImpl.prototype.getDropResult = function () {
        return this.store.getState().dragOperation.dropResult;
    };
    DragDropMonitorImpl.prototype.didDrop = function () {
        return this.store.getState().dragOperation.didDrop;
    };
    DragDropMonitorImpl.prototype.isSourcePublic = function () {
        return this.store.getState().dragOperation.isSourcePublic;
    };
    DragDropMonitorImpl.prototype.getInitialClientOffset = function () {
        return this.store.getState().dragOffset.initialClientOffset;
    };
    DragDropMonitorImpl.prototype.getInitialSourceClientOffset = function () {
        return this.store.getState().dragOffset.initialSourceClientOffset;
    };
    DragDropMonitorImpl.prototype.getClientOffset = function () {
        return this.store.getState().dragOffset.clientOffset;
    };
    DragDropMonitorImpl.prototype.getSourceClientOffset = function () {
        return coords_1.getSourceClientOffset(this.store.getState().dragOffset);
    };
    DragDropMonitorImpl.prototype.getDifferenceFromInitialOffset = function () {
        return coords_1.getDifferenceFromInitialOffset(this.store.getState().dragOffset);
    };
    return DragDropMonitorImpl;
}());
exports["default"] = DragDropMonitorImpl;


/***/ },

/***/ 3906
/*!***********************************************************!*\
  !*** ./node_modules/react-dnd/lib/createSourceFactory.js ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var react_1 = __webpack_require__(/*! react */ 1594);
var invariant = __webpack_require__(/*! invariant */ 311);
var isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ 1331);
var ALLOWED_SPEC_METHODS = ['canDrag', 'beginDrag', 'isDragging', 'endDrag'];
var REQUIRED_SPEC_METHODS = ['beginDrag'];
function createSourceFactory(spec) {
    Object.keys(spec).forEach(function (key) {
        invariant(ALLOWED_SPEC_METHODS.indexOf(key) > -1, 'Expected the drag source specification to only have ' +
            'some of the following keys: %s. ' +
            'Instead received a specification with an unexpected "%s" key. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', ALLOWED_SPEC_METHODS.join(', '), key);
        invariant(typeof spec[key] === 'function', 'Expected %s in the drag source specification to be a function. ' +
            'Instead received a specification with %s: %s. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', key, key, spec[key]);
    });
    REQUIRED_SPEC_METHODS.forEach(function (key) {
        invariant(typeof spec[key] === 'function', 'Expected %s in the drag source specification to be a function. ' +
            'Instead received a specification with %s: %s. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', key, key, spec[key]);
    });
    var SourceImpl = /** @class */ (function () {
        function SourceImpl(monitor) {
            this.monitor = monitor;
            this.props = null;
            this.ref = react_1.createRef();
            this.beginDrag = this.beginDrag.bind(this);
        }
        SourceImpl.prototype.receiveProps = function (props) {
            this.props = props;
        };
        SourceImpl.prototype.canDrag = function () {
            if (!this.props) {
                return false;
            }
            if (!spec.canDrag) {
                return true;
            }
            return spec.canDrag(this.props, this.monitor);
        };
        SourceImpl.prototype.isDragging = function (globalMonitor, sourceId) {
            if (!this.props) {
                return false;
            }
            if (!spec.isDragging) {
                return sourceId === globalMonitor.getSourceId();
            }
            return spec.isDragging(this.props, this.monitor);
        };
        SourceImpl.prototype.beginDrag = function () {
            if (!this.props) {
                return;
            }
            var item = spec.beginDrag(this.props, this.monitor, this.ref.current);
            if (false) // removed by dead control flow
{}
            return item;
        };
        SourceImpl.prototype.endDrag = function () {
            if (!this.props) {
                return;
            }
            if (!spec.endDrag) {
                return;
            }
            spec.endDrag(this.props, this.monitor, this.ref.current);
        };
        return SourceImpl;
    }());
    return function createSource(monitor) {
        return new SourceImpl(monitor);
    };
}
exports["default"] = createSourceFactory;


/***/ },

/***/ 3915
/*!************************************************!*\
  !*** ./node_modules/lodash/_baseDifference.js ***!
  \************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var SetCache = __webpack_require__(/*! ./_SetCache */ 8859),
    arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ 5325),
    arrayIncludesWith = __webpack_require__(/*! ./_arrayIncludesWith */ 9905),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ 4932),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ 7301),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ 9219);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;


/***/ },

/***/ 3950
/*!*************************************!*\
  !*** ./node_modules/lodash/noop.js ***!
  \*************************************/
(module) {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;


/***/ },

/***/ 4033
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseLodash.js ***!
  \********************************************/
(module) {

/**
 * The function whose prototype chain sequence wrappers inherit from.
 *
 * @private
 */
function baseLodash() {
  // No operation performed.
}

module.exports = baseLodash;


/***/ },

/***/ 4092
/*!*******************************************************!*\
  !*** ./node_modules/dnd-core/lib/actions/registry.js ***!
  \*******************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ADD_SOURCE = 'dnd-core/ADD_SOURCE';
exports.ADD_TARGET = 'dnd-core/ADD_TARGET';
exports.REMOVE_SOURCE = 'dnd-core/REMOVE_SOURCE';
exports.REMOVE_TARGET = 'dnd-core/REMOVE_TARGET';
function addSource(sourceId) {
    return {
        type: exports.ADD_SOURCE,
        payload: {
            sourceId: sourceId,
        },
    };
}
exports.addSource = addSource;
function addTarget(targetId) {
    return {
        type: exports.ADD_TARGET,
        payload: {
            targetId: targetId,
        },
    };
}
exports.addTarget = addTarget;
function removeSource(sourceId) {
    return {
        type: exports.REMOVE_SOURCE,
        payload: {
            sourceId: sourceId,
        },
    };
}
exports.removeSource = removeSource;
function removeTarget(targetId) {
    return {
        type: exports.REMOVE_TARGET,
        payload: {
            targetId: targetId,
        },
    };
}
exports.removeTarget = removeTarget;


/***/ },

/***/ 4146
/*!**********************************************************************************!*\
  !*** ./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js ***!
  \**********************************************************************************/
(module) {

"use strict";


/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    getDerivedStateFromProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
};

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

        if (objectPrototype) {
            var inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
        }

        var keys = getOwnPropertyNames(sourceComponent);

        if (getOwnPropertySymbols) {
            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                try { // Avoid failures from read-only properties
                    defineProperty(targetComponent, key, descriptor);
                } catch (e) {}
            }
        }

        return targetComponent;
    }

    return targetComponent;
}

module.exports = hoistNonReactStatics;


/***/ },

/***/ 4171
/*!**********************************************************!*\
  !*** ./node_modules/react-dnd/lib/utils/cloneWithRef.js ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var react_1 = __webpack_require__(/*! react */ 1594);
var invariant = __webpack_require__(/*! invariant */ 311);
function cloneWithRef(element, newRef) {
    var previousRef = element.ref;
    invariant(typeof previousRef !== 'string', 'Cannot connect React DnD to an element with an existing string ref. ' +
        'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' +
        'Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute');
    if (!previousRef) {
        // When there is no ref on the element, use the new ref directly
        return react_1.cloneElement(element, {
            ref: newRef,
        });
    }
    return react_1.cloneElement(element, {
        ref: function (node) {
            newRef(node);
            if (previousRef) {
                previousRef(node);
            }
        },
    });
}
exports["default"] = cloneWithRef;


/***/ },

/***/ 4214
/*!*********************************************************************!*\
  !*** ./node_modules/react-tag-input/dist-modules/components/Tag.js ***!
  \*********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ 1594);

var _react2 = _interopRequireDefault(_react);

var _reactDnd = __webpack_require__(/*! react-dnd */ 7987);

var _propTypes = __webpack_require__(/*! prop-types */ 5556);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _flow = __webpack_require__(/*! lodash/flow */ 9870);

var _flow2 = _interopRequireDefault(_flow);

var _classnames = __webpack_require__(/*! classnames */ 2485);

var _classnames2 = _interopRequireDefault(_classnames);

var _DragAndDropHelper = __webpack_require__(/*! ./DragAndDropHelper */ 1468);

var _utils = __webpack_require__(/*! ./utils */ 2460);

var _RemoveComponent = __webpack_require__(/*! ./RemoveComponent */ 8217);

var _RemoveComponent2 = _interopRequireDefault(_RemoveComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItemTypes = { TAG: 'tag' };

var Tag = function (_Component) {
  _inherits(Tag, _Component);

  function Tag() {
    _classCallCheck(this, Tag);

    return _possibleConstructorReturn(this, (Tag.__proto__ || Object.getPrototypeOf(Tag)).apply(this, arguments));
  }

  _createClass(Tag, [{
    key: 'render',
    value: function render() {
      var props = this.props;

      var label = props.tag[props.labelField];
      var connectDragSource = props.connectDragSource,
          isDragging = props.isDragging,
          connectDropTarget = props.connectDropTarget,
          readOnly = props.readOnly,
          tag = props.tag,
          classNames = props.classNames,
          index = props.index;
      var _tag$className = tag.className,
          className = _tag$className === undefined ? '' : _tag$className;
      // eslint-disable-next-line

      var tagComponent = _react2.default.createElement(
        'span',
        {
          className: (0, _classnames2.default)('tag-wrapper', classNames.tag, className),
          style: { opacity: isDragging ? 0 : 1, 'cursor': (0, _utils.canDrag)(props) ? 'move' : 'auto' },
          onClick: props.onTagClicked,
          onTouchStart: props.onTagClicked },
        label,
        _react2.default.createElement(_RemoveComponent2.default, {
          tag: props.tag,
          className: classNames.remove,
          removeComponent: props.removeComponent,
          onRemove: props.onDelete,
          readOnly: readOnly,
          index: index,
          onKeyDown: onkeydown
        })
      );
      return connectDragSource(connectDropTarget(tagComponent));
    }
  }]);

  return Tag;
}(_react.Component);

Tag.propTypes = {
  labelField: _propTypes2.default.string,
  onDelete: _propTypes2.default.func.isRequired,
  tag: _propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired,
    className: _propTypes2.default.string,
    key: _propTypes2.default.string
  }),
  moveTag: _propTypes2.default.func,
  removeComponent: _propTypes2.default.func,
  onTagClicked: _propTypes2.default.func,
  classNames: _propTypes2.default.object,
  readOnly: _propTypes2.default.bool,
  connectDragSource: _propTypes2.default.func.isRequired,
  isDragging: _propTypes2.default.bool.isRequired,
  connectDropTarget: _propTypes2.default.func.isRequired,
  index: _propTypes2.default.number.isRequired
};

Tag.defaultProps = {
  labelField: 'text',
  readOnly: false
};

exports["default"] = (0, _flow2.default)((0, _reactDnd.DragSource)(ItemTypes.TAG, _DragAndDropHelper.tagSource, _DragAndDropHelper.dragSource), (0, _reactDnd.DropTarget)(ItemTypes.TAG, _DragAndDropHelper.tagTarget, _DragAndDropHelper.dropCollect))(Tag);

/***/ },

/***/ 4218
/*!*******************************************!*\
  !*** ./node_modules/lodash/_isKeyable.js ***!
  \*******************************************/
(module) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ },

/***/ 4247
/*!********************************************!*\
  !*** ./node_modules/lodash/_setToArray.js ***!
  \********************************************/
(module) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ },

/***/ 4248
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arraySome.js ***!
  \*******************************************/
(module) {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ },

/***/ 4306
/*!*********************************************************************!*\
  !*** ./node_modules/react-dnd/lib/utils/checkDecoratorArguments.js ***!
  \*********************************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function checkDecoratorArguments(functionName, signature) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (false) // removed by dead control flow
{ var arg, _a, args_1; }
}
exports["default"] = checkDecoratorArguments;


/***/ },

/***/ 4319
/*!***************************************************************************!*\
  !*** ./node_modules/react-tag-input/dist-modules/components/constants.js ***!
  \***************************************************************************/
(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var KEYS = exports.KEYS = {
  ENTER: 13,
  TAB: 9,
  BACKSPACE: 8,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  ESCAPE: 27,
  SPACE: 32
};

var DEFAULT_PLACEHOLDER = exports.DEFAULT_PLACEHOLDER = 'Press enter to add new tag';

var DEFAULT_LABEL_FIELD = exports.DEFAULT_LABEL_FIELD = 'text';

var DEFAULT_CLASSNAMES = exports.DEFAULT_CLASSNAMES = {
  tags: 'ReactTags__tags',
  tagInput: 'ReactTags__tagInput',
  tagInputField: 'ReactTags__tagInputField',
  selected: 'ReactTags__selected',
  tag: 'ReactTags__tag',
  remove: 'ReactTags__remove',
  suggestions: 'ReactTags__suggestions',
  activeSuggestion: 'ReactTags__activeSuggestion'
};

var INPUT_FIELD_POSITIONS = exports.INPUT_FIELD_POSITIONS = {
  INLINE: 'inline',
  TOP: 'top',
  BOTTOM: 'bottom'
};

/***/ },

/***/ 4335
/*!*****************************************!*\
  !*** ./node_modules/lodash/_overArg.js ***!
  \*****************************************/
(module) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ },

/***/ 4348
/*!***************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/util/Spinner.scss ***!
  \***************************************************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ 1601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.m-spinner-fullscreen{position:absolute;z-index:1049;height:2em;width:2em;overflow:visible;margin:auto;top:0;left:0;bottom:0;right:0}.m-spinner-fullscreen:before{content:"";display:block;position:fixed;top:0;left:0;width:100%;height:100%;background-color:hsla(0,0%,100%,.5)}.m-spinner-inline{display:flex;justify-content:center;margin:60px auto 60px}.m-spinner-fullscreen .symbol,.m-spinner-inline .symbol{position:relative;display:flex;justify-content:space-between;width:40px;height:40px}.m-spinner-fullscreen .symbol>div,.m-spinner-inline .symbol>div{width:100%;height:100%;border-radius:50%;background-color:#e30048;opacity:.6;position:absolute;top:0;left:0;animation:bouncedelay 2s infinite ease-in-out;animation-fill-mode:both}.m-spinner-fullscreen .symbol .bounce2,.m-spinner-inline .symbol .bounce2{animation-delay:-1s}@keyframes bouncedelay{0%,100%{transform:scale(0)}50%{transform:scale(1)}}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 4394
/*!*****************************************!*\
  !*** ./node_modules/lodash/isSymbol.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 2552),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 346);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ },

/***/ 4425
/*!***************************************!*\
  !*** ./node_modules/lodash/escape.js ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var escapeHtmlChar = __webpack_require__(/*! ./_escapeHtmlChar */ 1599),
    toString = __webpack_require__(/*! ./toString */ 3222);

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"']/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/**
 * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
 * corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */
function escape(string) {
  string = toString(string);
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, escapeHtmlChar)
    : string;
}

module.exports = escape;


/***/ },

/***/ 4509
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheHas.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ 2651);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ },

/***/ 4517
/*!*******************************************!*\
  !*** ./node_modules/lodash/_createSet.js ***!
  \*******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var Set = __webpack_require__(/*! ./_Set */ 6545),
    noop = __webpack_require__(/*! ./noop */ 3950),
    setToArray = __webpack_require__(/*! ./_setToArray */ 4247);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;


/***/ },

/***/ 4528
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayPush.js ***!
  \*******************************************/
(module) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ },

/***/ 4552
/*!************************************************!*\
  !*** ./node_modules/lodash/_basePropertyOf.js ***!
  \************************************************/
(module) {

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

module.exports = basePropertyOf;


/***/ },

/***/ 4629
/*!*******************************************!*\
  !*** ./node_modules/lodash/_realNames.js ***!
  \*******************************************/
(module) {

/** Used to lookup unminified function names. */
var realNames = {};

module.exports = realNames;


/***/ },

/***/ 4664
/*!********************************************!*\
  !*** ./node_modules/lodash/_getSymbols.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ 9770),
    stubArray = __webpack_require__(/*! ./stubArray */ 3345);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ },

/***/ 4684
/*!*****************************************!*\
  !*** ./node_modules/lodash/defaults.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseRest = __webpack_require__(/*! ./_baseRest */ 9302),
    eq = __webpack_require__(/*! ./eq */ 5288),
    isIterateeCall = __webpack_require__(/*! ./_isIterateeCall */ 6800),
    keysIn = __webpack_require__(/*! ./keysIn */ 7241);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function(object, sources) {
  object = Object(object);

  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : undefined;

  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
    length = 1;
  }

  while (++index < length) {
    var source = sources[index];
    var props = keysIn(source);
    var propsIndex = -1;
    var propsLength = props.length;

    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];

      if (value === undefined ||
          (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        object[key] = source[key];
      }
    }
  }

  return object;
});

module.exports = defaults;


/***/ },

/***/ 4705
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js + 3 modules ***!
  \*******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ _defineProperty)
});

;// ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

;// ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

;// ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}

;// ./node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}


/***/ },

/***/ 4739
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheGet.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ 6025);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ },

/***/ 4820
/*!*************************************************!*\
  !*** ./node_modules/react-dnd/lib/DragLayer.js ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var React = __webpack_require__(/*! react */ 1594);
var checkDecoratorArguments_1 = __webpack_require__(/*! ./utils/checkDecoratorArguments */ 4306);
var DragDropContext_1 = __webpack_require__(/*! ./DragDropContext */ 1289);
var hoistStatics = __webpack_require__(/*! hoist-non-react-statics */ 4146);
var isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ 1331);
var invariant = __webpack_require__(/*! invariant */ 311);
var shallowEqual = __webpack_require__(/*! shallowequal */ 2833);
var isClassComponent = (__webpack_require__(/*! recompose/isClassComponent */ 561)/* ["default"] */ .A);
function DragLayer(collect, options) {
    if (options === void 0) { options = {}; }
    checkDecoratorArguments_1.default('DragLayer', 'collect[, options]', collect, options);
    invariant(typeof collect === 'function', 'Expected "collect" provided as the first argument to DragLayer to be a function that collects props to inject into the component. ', 'Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs-drag-layer.html', collect);
    invariant(isPlainObject(options), 'Expected "options" provided as the second argument to DragLayer to be a plain object when specified. ' +
        'Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs-drag-layer.html', options);
    return function decorateLayer(DecoratedComponent) {
        var Decorated = DecoratedComponent;
        var _a = options.arePropsEqual, arePropsEqual = _a === void 0 ? shallowEqual : _a;
        var displayName = Decorated.displayName || Decorated.name || 'Component';
        var DragLayerContainer = /** @class */ (function (_super) {
            __extends(DragLayerContainer, _super);
            function DragLayerContainer(props) {
                var _this = _super.call(this, props) || this;
                _this.isCurrentlyMounted = false;
                _this.ref = React.createRef();
                _this.handleChange = _this.handleChange.bind(_this);
                return _this;
            }
            Object.defineProperty(DragLayerContainer.prototype, "DecoratedComponent", {
                get: function () {
                    return DecoratedComponent;
                },
                enumerable: true,
                configurable: true
            });
            DragLayerContainer.prototype.getDecoratedComponentInstance = function () {
                invariant(this.ref.current, 'In order to access an instance of the decorated component it can not be a stateless component.');
                return this.ref.current;
            };
            DragLayerContainer.prototype.shouldComponentUpdate = function (nextProps, nextState) {
                return (!arePropsEqual(nextProps, this.props) ||
                    !shallowEqual(nextState, this.state));
            };
            DragLayerContainer.prototype.componentDidMount = function () {
                this.isCurrentlyMounted = true;
                this.handleChange();
            };
            DragLayerContainer.prototype.componentWillUnmount = function () {
                this.isCurrentlyMounted = false;
                if (this.unsubscribeFromOffsetChange) {
                    this.unsubscribeFromOffsetChange();
                    this.unsubscribeFromOffsetChange = undefined;
                }
                if (this.unsubscribeFromStateChange) {
                    this.unsubscribeFromStateChange();
                    this.unsubscribeFromStateChange = undefined;
                }
            };
            DragLayerContainer.prototype.render = function () {
                var _this = this;
                return (React.createElement(DragDropContext_1.Consumer, null, function (_a) {
                    var dragDropManager = _a.dragDropManager;
                    if (dragDropManager === undefined) {
                        return null;
                    }
                    _this.receiveDragDropManager(dragDropManager);
                    // Let componentDidMount fire to initialize the collected state
                    if (!_this.isCurrentlyMounted) {
                        return null;
                    }
                    return (React.createElement(Decorated, __assign({}, _this.props, _this.state, { ref: isClassComponent(Decorated) ? _this.ref : undefined })));
                }));
            };
            DragLayerContainer.prototype.receiveDragDropManager = function (dragDropManager) {
                if (this.manager !== undefined) {
                    return;
                }
                this.manager = dragDropManager;
                invariant(typeof dragDropManager === 'object', 'Could not find the drag and drop manager in the context of %s. ' +
                    'Make sure to wrap the top-level component of your app with DragDropContext. ' +
                    'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context', displayName, displayName);
                var monitor = this.manager.getMonitor();
                this.unsubscribeFromOffsetChange = monitor.subscribeToOffsetChange(this.handleChange);
                this.unsubscribeFromStateChange = monitor.subscribeToStateChange(this.handleChange);
            };
            DragLayerContainer.prototype.handleChange = function () {
                if (!this.isCurrentlyMounted) {
                    return;
                }
                var nextState = this.getCurrentState();
                if (!shallowEqual(nextState, this.state)) {
                    this.setState(nextState);
                }
            };
            DragLayerContainer.prototype.getCurrentState = function () {
                if (!this.manager) {
                    return {};
                }
                var monitor = this.manager.getMonitor();
                return collect(monitor, this.props);
            };
            DragLayerContainer.displayName = "DragLayer(" + displayName + ")";
            return DragLayerContainer;
        }(React.Component));
        return hoistStatics(DragLayerContainer, DecoratedComponent);
    };
}
exports["default"] = DragLayer;


/***/ },

/***/ 4840
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ },

/***/ 4894
/*!********************************************!*\
  !*** ./node_modules/lodash/isArrayLike.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isFunction = __webpack_require__(/*! ./isFunction */ 1882),
    isLength = __webpack_require__(/*! ./isLength */ 294);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ },

/***/ 4901
/*!**************************************************!*\
  !*** ./node_modules/lodash/_baseIsTypedArray.js ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 2552),
    isLength = __webpack_require__(/*! ./isLength */ 294),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 346);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ },

/***/ 4932
/*!******************************************!*\
  !*** ./node_modules/lodash/_arrayMap.js ***!
  \******************************************/
(module) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ },

/***/ 4994
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
(module) {

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    "default": e
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ },

/***/ 5056
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ },

/***/ 5072
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
(module) {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ },

/***/ 5083
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseIsNative.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isFunction = __webpack_require__(/*! ./isFunction */ 1882),
    isMasked = __webpack_require__(/*! ./_isMasked */ 7296),
    isObject = __webpack_require__(/*! ./isObject */ 3805),
    toSource = __webpack_require__(/*! ./_toSource */ 7473);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ },

/***/ 5087
/*!********************************************!*\
  !*** ./node_modules/lodash/_isLaziable.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var LazyWrapper = __webpack_require__(/*! ./_LazyWrapper */ 980),
    getData = __webpack_require__(/*! ./_getData */ 7381),
    getFuncName = __webpack_require__(/*! ./_getFuncName */ 2284),
    lodash = __webpack_require__(/*! ./wrapperLodash */ 3758);

/**
 * Checks if `func` has a lazy counterpart.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
 *  else `false`.
 */
function isLaziable(func) {
  var funcName = getFuncName(func),
      other = lodash[funcName];

  if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData(other);
  return !!data && func === data[0];
}

module.exports = isLaziable;


/***/ },

/***/ 5206
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
(module) {

"use strict";
module.exports = ReactDOM;

/***/ },

/***/ 5236
/*!*******************************************!*\
  !*** ./node_modules/asap/browser-asap.js ***!
  \*******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


// rawAsap provides everything we need except exception management.
var rawAsap = __webpack_require__(/*! ./raw */ 9795);
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};


/***/ },

/***/ 5259
/*!***********************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/index.js ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var HTML5Backend_1 = __importDefault(__webpack_require__(/*! ./HTML5Backend */ 9767));
var getEmptyImage_1 = __importDefault(__webpack_require__(/*! ./getEmptyImage */ 7549));
exports.getEmptyImage = getEmptyImage_1.default;
var NativeTypes = __importStar(__webpack_require__(/*! ./NativeTypes */ 8015));
exports.NativeTypes = NativeTypes;
function createHTML5Backend(manager) {
    return new HTML5Backend_1.default(manager);
}
exports["default"] = createHTML5Backend;
//# sourceMappingURL=index.js.map

/***/ },

/***/ 5287
/*!*********************************************!*\
  !*** ./node_modules/lodash/intersection.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var arrayMap = __webpack_require__(/*! ./_arrayMap */ 4932),
    baseIntersection = __webpack_require__(/*! ./_baseIntersection */ 7185),
    baseRest = __webpack_require__(/*! ./_baseRest */ 9302),
    castArrayLikeObject = __webpack_require__(/*! ./_castArrayLikeObject */ 741);

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
    : [];
});

module.exports = intersection;


/***/ },

/***/ 5288
/*!***********************************!*\
  !*** ./node_modules/lodash/eq.js ***!
  \***********************************/
(module) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ },

/***/ 5325
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayIncludes.js ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(/*! ./_baseIndexOf */ 6131);

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;


/***/ },

/***/ 5331
/*!******************************************************!*\
  !*** ./node_modules/react-dnd/lib/registerTarget.js ***!
  \******************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function registerTarget(type, target, manager) {
    var registry = manager.getRegistry();
    var targetId = registry.addTarget(type, target);
    function unregisterTarget() {
        registry.removeTarget(targetId);
    }
    return {
        handlerId: targetId,
        unregister: unregisterTarget,
    };
}
exports["default"] = registerTarget;


/***/ },

/***/ 5352
/*!********************************************************!*\
  !*** ./node_modules/dnd-core/lib/utils/matchesType.js ***!
  \********************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function matchesType(targetType, draggedItemType) {
    if (draggedItemType === null) {
        return targetType === null;
    }
    return Array.isArray(targetType)
        ? targetType.some(function (t) { return t === draggedItemType; })
        : targetType === draggedItemType;
}
exports["default"] = matchesType;


/***/ },

/***/ 5463
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsNaN.js ***!
  \*******************************************/
(module) {

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;


/***/ },

/***/ 5465
/*!*****************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/util/FilePanel.scss ***!
  \*****************************************************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ 1601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.file-panel .file-element{display:inline-flex;flex-direction:column;padding:.45rem .5rem;margin-bottom:.5rem;background-color:#fff;box-shadow:0 0 4px 0 rgba(64,64,64,.15),0 0 1px 0 rgba(64,64,64,.15);border-radius:.25rem;margin-right:.375rem;font-size:.765625rem}.file-panel .file-element .file-header{display:inline-flex;align-items:center;cursor:default;line-height:1}.file-panel .file-element .file-header>img{margin-right:-0.875rem;z-index:1}.file-panel .file-element .file-header>img+.file-extension{padding-left:1.375rem}.file-panel .file-element .file-header .file-extension{display:inline-block;font-weight:500;border:solid 1px #f0f0f0;border-radius:4px;background-color:#f7f7f7;padding:.3rem .5rem;text-transform:uppercase}.file-panel .file-element .file-header .file-name{font-family:CeraRoundPro,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";text-decoration:none;white-space:nowrap;display:inline-block;margin:0 .5rem}.file-panel .file-element .file-header .icon{font-size:.875rem;color:#757575;cursor:pointer}.file-panel .file-element a.file-header{color:inherit;text-decoration:none;cursor:pointer}.file-panel .file-element textarea{background-color:#fff;margin-top:.45rem;width:100%;resize:none}@media(min-width: 576px){.file-panel .file-element textarea{min-width:405px}}@media(min-width: 768px){.file-panel .file-element textarea{min-width:585px}}@media(min-width: 992px){.file-panel .file-element textarea{min-width:825px}}@media(min-width: 1200px){.file-panel .file-element textarea{min-width:1005px}}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 5481
/*!********************************************!*\
  !*** ./node_modules/lodash/_coreJsData.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ 9325);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ },

/***/ 5527
/*!*********************************************!*\
  !*** ./node_modules/lodash/_isPrototype.js ***!
  \*********************************************/
(module) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ },

/***/ 5556
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) // removed by dead control flow
{ var throwOnDirectAccess, ReactIs; } else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(/*! ./factoryWithThrowingShims */ 2694)();
}


/***/ },

/***/ 5580
/*!******************************************!*\
  !*** ./node_modules/lodash/_DataView.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ 6110),
    root = __webpack_require__(/*! ./_root */ 9325);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ },

/***/ 5749
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashSet.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ 1042);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ },

/***/ 5765
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseUniq.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var SetCache = __webpack_require__(/*! ./_SetCache */ 8859),
    arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ 5325),
    arrayIncludesWith = __webpack_require__(/*! ./_arrayIncludesWith */ 9905),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ 9219),
    createSet = __webpack_require__(/*! ./_createSet */ 4517),
    setToArray = __webpack_require__(/*! ./_setToArray */ 4247);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;


/***/ },

/***/ 5861
/*!****************************************!*\
  !*** ./node_modules/lodash/_getTag.js ***!
  \****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var DataView = __webpack_require__(/*! ./_DataView */ 5580),
    Map = __webpack_require__(/*! ./_Map */ 8223),
    Promise = __webpack_require__(/*! ./_Promise */ 2804),
    Set = __webpack_require__(/*! ./_Set */ 6545),
    WeakMap = __webpack_require__(/*! ./_WeakMap */ 8303),
    baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 2552),
    toSource = __webpack_require__(/*! ./_toSource */ 7473);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ },

/***/ 5891
/*!***********************************************!*\
  !*** ./node_modules/lodash/_isFlattenable.js ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ 1873),
    isArguments = __webpack_require__(/*! ./isArguments */ 2428),
    isArray = __webpack_require__(/*! ./isArray */ 6449);

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ },

/***/ 5911
/*!*********************************************!*\
  !*** ./node_modules/lodash/_equalArrays.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var SetCache = __webpack_require__(/*! ./_SetCache */ 8859),
    arraySome = __webpack_require__(/*! ./_arraySome */ 4248),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ 9219);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ },

/***/ 5927
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseXor.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseDifference = __webpack_require__(/*! ./_baseDifference */ 3915),
    baseFlatten = __webpack_require__(/*! ./_baseFlatten */ 3120),
    baseUniq = __webpack_require__(/*! ./_baseUniq */ 5765);

/**
 * The base implementation of methods like `_.xor`, without support for
 * iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of values.
 */
function baseXor(arrays, iteratee, comparator) {
  var length = arrays.length;
  if (length < 2) {
    return length ? baseUniq(arrays[0]) : [];
  }
  var index = -1,
      result = Array(length);

  while (++index < length) {
    var array = arrays[index],
        othIndex = -1;

    while (++othIndex < length) {
      if (othIndex != index) {
        result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
      }
    }
  }
  return baseUniq(baseFlatten(result, 1), iteratee, comparator);
}

module.exports = baseXor;


/***/ },

/***/ 5943
/*!**************************************************************************!*\
  !*** ./node_modules/react-dnd/lib/utils/disposables/SerialDisposable.js ***!
  \**************************************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Represents a disposable resource whose underlying disposable resource can
 * be replaced by another disposable resource, causing automatic disposal of
 * the previous underlying disposable resource.
 */
var SerialDisposable = /** @class */ (function () {
    function SerialDisposable() {
        this.isDisposed = false;
    }
    /**
     * Gets the underlying disposable.
     * @returns {Any} the underlying disposable.
     */
    SerialDisposable.prototype.getDisposable = function () {
        return this.current;
    };
    SerialDisposable.prototype.setDisposable = function (value) {
        var shouldDispose = this.isDisposed;
        if (!shouldDispose) {
            var old = this.current;
            this.current = value;
            if (old) {
                old.dispose();
            }
        }
        if (shouldDispose && value) {
            value.dispose();
        }
    };
    /** Performs the task of cleaning up resources. */
    SerialDisposable.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.isDisposed = true;
            var old = this.current;
            this.current = undefined;
            if (old) {
                old.dispose();
            }
        }
    };
    return SerialDisposable;
}());
exports.SerialDisposable = SerialDisposable;


/***/ },

/***/ 5949
/*!****************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/editor/editor.scss ***!
  \****************************************************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ 1601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.editor{color:#757575}.editor .modal{padding:2.75rem;z-index:1035}.editor.embedded .modal{padding:2rem}.editor.embedded .modal label{display:none}.editor.embedded .modal .modal-body{padding:1.25rem}.editor .modal-content{background-color:#fff}.editor .modal-content .modal-body{padding:1.5rem 1.5rem 1.25rem 1.5rem}.editor .editor-body .plain-text iframe{width:100%;height:100%;margin-bottom:0;color:#000;resize:none}.editor .editor-popup-pwd-dialog{width:580px;height:480px;position:absolute;left:50%;top:50%;transform:translate3d(-50%, -50%, 0);z-index:1050}.editor .waiting-modal .modal-dialog{width:500px;margin:50px auto}.editor .toastWrapper{z-index:1051;position:fixed;top:5.75rem;left:50%;transform:translateX(-50%)}.editor .m-spinner-fullscreen{z-index:1045}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 5950
/*!*************************************!*\
  !*** ./node_modules/lodash/keys.js ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ 695),
    baseKeys = __webpack_require__(/*! ./_baseKeys */ 8984),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ 4894);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ },

/***/ 5970
/*!****************************************!*\
  !*** ./node_modules/lodash/flatten.js ***!
  \****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseFlatten = __webpack_require__(/*! ./_baseFlatten */ 3120);

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ },

/***/ 5977
/*!*****************************************************!*\
  !*** ./node_modules/dnd-core/lib/utils/equality.js ***!
  \*****************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.strictEquality = function (a, b) { return a === b; };
/**
 * Determine if two cartesian coordinate offsets are equal
 * @param offsetA
 * @param offsetB
 */
function areCoordsEqual(offsetA, offsetB) {
    if (!offsetA && !offsetB) {
        return true;
    }
    else if (!offsetA || !offsetB) {
        return false;
    }
    else {
        return offsetA.x === offsetB.x && offsetA.y === offsetB.y;
    }
}
exports.areCoordsEqual = areCoordsEqual;
/**
 * Determines if two arrays of items are equal
 * @param a The first array of items
 * @param b The second array of items
 */
function areArraysEqual(a, b, isEqual) {
    if (isEqual === void 0) { isEqual = exports.strictEquality; }
    if (a.length !== b.length) {
        return false;
    }
    for (var i = 0; i < a.length; ++i) {
        if (!isEqual(a[i], b[i])) {
            return false;
        }
    }
    return true;
}
exports.areArraysEqual = areArraysEqual;


/***/ },

/***/ 6009
/*!******************************************!*\
  !*** ./node_modules/lodash/_nodeUtil.js ***!
  \******************************************/
(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ 4840);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;


/***/ },

/***/ 6017
/*!***********************************************!*\
  !*** ./node_modules/lodash/_LodashWrapper.js ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseCreate = __webpack_require__(/*! ./_baseCreate */ 9344),
    baseLodash = __webpack_require__(/*! ./_baseLodash */ 4033);

/**
 * The base constructor for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap.
 * @param {boolean} [chainAll] Enable explicit method chain sequences.
 */
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = undefined;
}

LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;

module.exports = LodashWrapper;


/***/ },

/***/ 6025
/*!**********************************************!*\
  !*** ./node_modules/lodash/_assocIndexOf.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var eq = __webpack_require__(/*! ./eq */ 5288);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ },

/***/ 6110
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getNative.js ***!
  \*******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ 5083),
    getValue = __webpack_require__(/*! ./_getValue */ 392);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ },

/***/ 6131
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseIndexOf.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(/*! ./_baseFindIndex */ 2523),
    baseIsNaN = __webpack_require__(/*! ./_baseIsNaN */ 5463),
    strictIndexOf = __webpack_require__(/*! ./_strictIndexOf */ 6959);

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;


/***/ },

/***/ 6216
/*!****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./src/components/editor/editorRoot.css ***!
  \****************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ 1601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `
html, body, body > div {
  height: 100%;
  background-color: rgba(0,0,0,0);
}

body {
  overflow: hidden;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 6314
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
(module) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ },

/***/ 6449
/*!****************************************!*\
  !*** ./node_modules/lodash/isArray.js ***!
  \****************************************/
(module) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ },

/***/ 6545
/*!*************************************!*\
  !*** ./node_modules/lodash/_Set.js ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ 6110),
    root = __webpack_require__(/*! ./_root */ 9325);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ },

/***/ 6625
/*!************************************!*\
  !*** ./node_modules/lodash/xor.js ***!
  \************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ 9770),
    baseRest = __webpack_require__(/*! ./_baseRest */ 9302),
    baseXor = __webpack_require__(/*! ./_baseXor */ 5927),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ 3693);

/**
 * Creates an array of unique values that is the
 * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
 * of the given arrays. The order of result values is determined by the order
 * they occur in the arrays.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.without
 * @example
 *
 * _.xor([2, 1], [2, 3]);
 * // => [1, 3]
 */
var xor = baseRest(function(arrays) {
  return baseXor(arrayFilter(arrays, isArrayLikeObject));
});

module.exports = xor;


/***/ },

/***/ 6721
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashGet.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ 1042);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ },

/***/ 6757
/*!******************************************!*\
  !*** ./node_modules/lodash/_overRest.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var apply = __webpack_require__(/*! ./_apply */ 1033);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ },

/***/ 6789
/*!**************************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/MonotonicInterpolant.js ***!
  \**************************************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* eslint
   no-plusplus: off,
   no-mixed-operators: off
*/
var MonotonicInterpolant = /** @class */ (function () {
    function MonotonicInterpolant(xs, ys) {
        var length = xs.length;
        // Rearrange xs and ys so that xs is sorted
        var indexes = [];
        for (var i = 0; i < length; i++) {
            indexes.push(i);
        }
        indexes.sort(function (a, b) { return (xs[a] < xs[b] ? -1 : 1); });
        // Get consecutive differences and slopes
        var dys = [];
        var dxs = [];
        var ms = [];
        var dx;
        var dy;
        for (var i = 0; i < length - 1; i++) {
            dx = xs[i + 1] - xs[i];
            dy = ys[i + 1] - ys[i];
            dxs.push(dx);
            dys.push(dy);
            ms.push(dy / dx);
        }
        // Get degree-1 coefficients
        var c1s = [ms[0]];
        for (var i = 0; i < dxs.length - 1; i++) {
            var m2 = ms[i];
            var mNext = ms[i + 1];
            if (m2 * mNext <= 0) {
                c1s.push(0);
            }
            else {
                dx = dxs[i];
                var dxNext = dxs[i + 1];
                var common = dx + dxNext;
                c1s.push(3 * common / ((common + dxNext) / m2 + (common + dx) / mNext));
            }
        }
        c1s.push(ms[ms.length - 1]);
        // Get degree-2 and degree-3 coefficients
        var c2s = [];
        var c3s = [];
        var m;
        for (var i = 0; i < c1s.length - 1; i++) {
            m = ms[i];
            var c1 = c1s[i];
            var invDx = 1 / dxs[i];
            var common = c1 + c1s[i + 1] - m - m;
            c2s.push((m - c1 - common) * invDx);
            c3s.push(common * invDx * invDx);
        }
        this.xs = xs;
        this.ys = ys;
        this.c1s = c1s;
        this.c2s = c2s;
        this.c3s = c3s;
    }
    MonotonicInterpolant.prototype.interpolate = function (x) {
        var _a = this, xs = _a.xs, ys = _a.ys, c1s = _a.c1s, c2s = _a.c2s, c3s = _a.c3s;
        // The rightmost point in the dataset should give an exact result
        var i = xs.length - 1;
        if (x === xs[i]) {
            return ys[i];
        }
        // Search for the interval x is in, returning the corresponding y if x is one of the original xs
        var low = 0;
        var high = c3s.length - 1;
        var mid;
        while (low <= high) {
            mid = Math.floor(0.5 * (low + high));
            var xHere = xs[mid];
            if (xHere < x) {
                low = mid + 1;
            }
            else if (xHere > x) {
                high = mid - 1;
            }
            else {
                return ys[mid];
            }
        }
        i = Math.max(0, high);
        // Interpolate
        var diff = x - xs[i];
        var diffSq = diff * diff;
        return ys[i] + c1s[i] * diff + c2s[i] * diffSq + c3s[i] * diff * diffSq;
    };
    return MonotonicInterpolant;
}());
exports["default"] = MonotonicInterpolant;
//# sourceMappingURL=MonotonicInterpolant.js.map

/***/ },

/***/ 6800
/*!************************************************!*\
  !*** ./node_modules/lodash/_isIterateeCall.js ***!
  \************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var eq = __webpack_require__(/*! ./eq */ 5288),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ 4894),
    isIndex = __webpack_require__(/*! ./_isIndex */ 361),
    isObject = __webpack_require__(/*! ./isObject */ 3805);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ },

/***/ 6925
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
(module) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ },

/***/ 6929
/*!********************************************!*\
  !*** ./node_modules/lodash/_createFlow.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var LodashWrapper = __webpack_require__(/*! ./_LodashWrapper */ 6017),
    flatRest = __webpack_require__(/*! ./_flatRest */ 8816),
    getData = __webpack_require__(/*! ./_getData */ 7381),
    getFuncName = __webpack_require__(/*! ./_getFuncName */ 2284),
    isArray = __webpack_require__(/*! ./isArray */ 6449),
    isLaziable = __webpack_require__(/*! ./_isLaziable */ 5087);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to compose bitmasks for function metadata. */
var WRAP_CURRY_FLAG = 8,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_ARY_FLAG = 128,
    WRAP_REARG_FLAG = 256;

/**
 * Creates a `_.flow` or `_.flowRight` function.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new flow function.
 */
function createFlow(fromRight) {
  return flatRest(function(funcs) {
    var length = funcs.length,
        index = length,
        prereq = LodashWrapper.prototype.thru;

    if (fromRight) {
      funcs.reverse();
    }
    while (index--) {
      var func = funcs[index];
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
        var wrapper = new LodashWrapper([], true);
      }
    }
    index = wrapper ? index : length;
    while (++index < length) {
      func = funcs[index];

      var funcName = getFuncName(func),
          data = funcName == 'wrapper' ? getData(func) : undefined;

      if (data && isLaziable(data[0]) &&
            data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
            !data[4].length && data[9] == 1
          ) {
        wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
      } else {
        wrapper = (func.length == 1 && isLaziable(func))
          ? wrapper[funcName]()
          : wrapper.thru(func);
      }
    }
    return function() {
      var args = arguments,
          value = args[0];

      if (wrapper && args.length == 1 && isArray(value)) {
        return wrapper.plant(value).value();
      }
      var index = 0,
          result = length ? funcs[index].apply(this, args) : value;

      while (++index < length) {
        result = funcs[index].call(this, result);
      }
      return result;
    };
  });
}

module.exports = createFlow;


/***/ },

/***/ 6959
/*!***********************************************!*\
  !*** ./node_modules/lodash/_strictIndexOf.js ***!
  \***********************************************/
(module) {

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;


/***/ },

/***/ 7068
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsEqualDeep.js ***!
  \*************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var Stack = __webpack_require__(/*! ./_Stack */ 9598),
    equalArrays = __webpack_require__(/*! ./_equalArrays */ 5911),
    equalByTag = __webpack_require__(/*! ./_equalByTag */ 1986),
    equalObjects = __webpack_require__(/*! ./_equalObjects */ 689),
    getTag = __webpack_require__(/*! ./_getTag */ 5861),
    isArray = __webpack_require__(/*! ./isArray */ 6449),
    isBuffer = __webpack_require__(/*! ./isBuffer */ 3656),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ 7167);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ },

/***/ 7167
/*!*********************************************!*\
  !*** ./node_modules/lodash/isTypedArray.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(/*! ./_baseIsTypedArray */ 4901),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ 7301),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ 6009);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ },

/***/ 7185
/*!**************************************************!*\
  !*** ./node_modules/lodash/_baseIntersection.js ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var SetCache = __webpack_require__(/*! ./_SetCache */ 8859),
    arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ 5325),
    arrayIncludesWith = __webpack_require__(/*! ./_arrayIncludesWith */ 9905),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ 4932),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ 7301),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ 9219);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseIntersection;


/***/ },

/***/ 7217
/*!**********************************************************!*\
  !*** ./node_modules/autobind-decorator/lib/esm/index.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   boundClass: () => (/* binding */ boundClass),
/* harmony export */   boundMethod: () => (/* binding */ boundMethod),
/* harmony export */   "default": () => (/* binding */ autobind)
/* harmony export */ });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Return a descriptor removing the value and returning a getter
 * The getter will return a .bind version of the function
 * and memoize the result against a symbol on the instance
 */
function boundMethod(target, key, descriptor) {
  var fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new TypeError("@boundMethod decorator can only be applied to methods not: ".concat(_typeof(fn)));
  } // In IE11 calling Object.defineProperty has a side-effect of evaluating the
  // getter for the property which is being replaced. This causes infinite
  // recursion and an "Out of stack space" error.


  var definingProperty = false;
  return {
    configurable: true,
    get: function get() {
      // eslint-disable-next-line no-prototype-builtins
      if (definingProperty || this === target.prototype || this.hasOwnProperty(key) || typeof fn !== 'function') {
        return fn;
      }

      var boundFn = fn.bind(this);
      definingProperty = true;
      Object.defineProperty(this, key, {
        configurable: true,
        get: function get() {
          return boundFn;
        },
        set: function set(value) {
          fn = value;
          delete this[key];
        }
      });
      definingProperty = false;
      return boundFn;
    },
    set: function set(value) {
      fn = value;
    }
  };
}
/**
 * Use boundMethod to bind all methods on the target.prototype
 */

function boundClass(target) {
  // (Using reflect to get all keys including symbols)
  var keys; // Use Reflect if exists

  if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
    keys = Reflect.ownKeys(target.prototype);
  } else {
    keys = Object.getOwnPropertyNames(target.prototype); // Use symbols if support is provided

    if (typeof Object.getOwnPropertySymbols === 'function') {
      keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
    }
  }

  keys.forEach(function (key) {
    // Ignore special case target method
    if (key === 'constructor') {
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(target.prototype, key); // Only methods need binding

    if (typeof descriptor.value === 'function') {
      Object.defineProperty(target.prototype, key, boundMethod(target, key, descriptor));
    }
  });
  return target;
}
function autobind() {
  if (arguments.length === 1) {
    return boundClass.apply(void 0, arguments);
  }

  return boundMethod.apply(void 0, arguments);
}

/***/ },

/***/ 7241
/*!***************************************!*\
  !*** ./node_modules/lodash/keysIn.js ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ 695),
    baseKeysIn = __webpack_require__(/*! ./_baseKeysIn */ 2903),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ 4894);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ },

/***/ 7258
/*!**********************************************************!*\
  !*** ./node_modules/dnd-core/lib/HandlerRegistryImpl.js ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var registry_1 = __webpack_require__(/*! ./actions/registry */ 4092);
var getNextUniqueId_1 = __webpack_require__(/*! ./utils/getNextUniqueId */ 1846);
var interfaces_1 = __webpack_require__(/*! ./interfaces */ 3067);
var contracts_1 = __webpack_require__(/*! ./contracts */ 404);
var invariant = __webpack_require__(/*! invariant */ 311);
var asap = __webpack_require__(/*! asap */ 5236);
function getNextHandlerId(role) {
    var id = getNextUniqueId_1.default().toString();
    switch (role) {
        case interfaces_1.HandlerRole.SOURCE:
            return "S" + id;
        case interfaces_1.HandlerRole.TARGET:
            return "T" + id;
        default:
            throw new Error("Unknown Handler Role: " + role);
    }
}
function parseRoleFromHandlerId(handlerId) {
    switch (handlerId[0]) {
        case 'S':
            return interfaces_1.HandlerRole.SOURCE;
        case 'T':
            return interfaces_1.HandlerRole.TARGET;
        default:
            invariant(false, "Cannot parse handler ID: " + handlerId);
    }
}
function mapContainsValue(map, searchValue) {
    var entries = map.entries();
    var isDone = false;
    do {
        var _a = entries.next(), done = _a.done, _b = _a.value, value = _b[1];
        if (value === searchValue) {
            return true;
        }
        isDone = done;
    } while (!isDone);
    return false;
}
var HandlerRegistryImpl = /** @class */ (function () {
    function HandlerRegistryImpl(store) {
        this.store = store;
        this.types = new Map();
        this.dragSources = new Map();
        this.dropTargets = new Map();
        this.pinnedSourceId = null;
        this.pinnedSource = null;
    }
    HandlerRegistryImpl.prototype.addSource = function (type, source) {
        contracts_1.validateType(type);
        contracts_1.validateSourceContract(source);
        var sourceId = this.addHandler(interfaces_1.HandlerRole.SOURCE, type, source);
        this.store.dispatch(registry_1.addSource(sourceId));
        return sourceId;
    };
    HandlerRegistryImpl.prototype.addTarget = function (type, target) {
        contracts_1.validateType(type, true);
        contracts_1.validateTargetContract(target);
        var targetId = this.addHandler(interfaces_1.HandlerRole.TARGET, type, target);
        this.store.dispatch(registry_1.addTarget(targetId));
        return targetId;
    };
    HandlerRegistryImpl.prototype.containsHandler = function (handler) {
        return (mapContainsValue(this.dragSources, handler) ||
            mapContainsValue(this.dropTargets, handler));
    };
    HandlerRegistryImpl.prototype.getSource = function (sourceId, includePinned) {
        if (includePinned === void 0) { includePinned = false; }
        invariant(this.isSourceId(sourceId), 'Expected a valid source ID.');
        var isPinned = includePinned && sourceId === this.pinnedSourceId;
        var source = isPinned ? this.pinnedSource : this.dragSources.get(sourceId);
        return source;
    };
    HandlerRegistryImpl.prototype.getTarget = function (targetId) {
        invariant(this.isTargetId(targetId), 'Expected a valid target ID.');
        return this.dropTargets.get(targetId);
    };
    HandlerRegistryImpl.prototype.getSourceType = function (sourceId) {
        invariant(this.isSourceId(sourceId), 'Expected a valid source ID.');
        return this.types.get(sourceId);
    };
    HandlerRegistryImpl.prototype.getTargetType = function (targetId) {
        invariant(this.isTargetId(targetId), 'Expected a valid target ID.');
        return this.types.get(targetId);
    };
    HandlerRegistryImpl.prototype.isSourceId = function (handlerId) {
        var role = parseRoleFromHandlerId(handlerId);
        return role === interfaces_1.HandlerRole.SOURCE;
    };
    HandlerRegistryImpl.prototype.isTargetId = function (handlerId) {
        var role = parseRoleFromHandlerId(handlerId);
        return role === interfaces_1.HandlerRole.TARGET;
    };
    HandlerRegistryImpl.prototype.removeSource = function (sourceId) {
        var _this = this;
        invariant(this.getSource(sourceId), 'Expected an existing source.');
        this.store.dispatch(registry_1.removeSource(sourceId));
        asap(function () {
            _this.dragSources.delete(sourceId);
            _this.types.delete(sourceId);
        });
    };
    HandlerRegistryImpl.prototype.removeTarget = function (targetId) {
        invariant(this.getTarget(targetId), 'Expected an existing target.');
        this.store.dispatch(registry_1.removeTarget(targetId));
        this.dropTargets.delete(targetId);
        this.types.delete(targetId);
    };
    HandlerRegistryImpl.prototype.pinSource = function (sourceId) {
        var source = this.getSource(sourceId);
        invariant(source, 'Expected an existing source.');
        this.pinnedSourceId = sourceId;
        this.pinnedSource = source;
    };
    HandlerRegistryImpl.prototype.unpinSource = function () {
        invariant(this.pinnedSource, 'No source is pinned at the time.');
        this.pinnedSourceId = null;
        this.pinnedSource = null;
    };
    HandlerRegistryImpl.prototype.addHandler = function (role, type, handler) {
        var id = getNextHandlerId(role);
        this.types.set(id, type);
        if (role === interfaces_1.HandlerRole.SOURCE) {
            this.dragSources.set(id, handler);
        }
        else if (role === interfaces_1.HandlerRole.TARGET) {
            this.dropTargets.set(id, handler);
        }
        return id;
    };
    return HandlerRegistryImpl;
}());
exports["default"] = HandlerRegistryImpl;


/***/ },

/***/ 7283
/*!*************************************************************!*\
  !*** ./node_modules/react-dnd/lib/createSourceConnector.js ***!
  \*************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var wrapConnectorHooks_1 = __webpack_require__(/*! ./wrapConnectorHooks */ 9674);
var shallowEqual = __webpack_require__(/*! shallowequal */ 2833);
function createSourceConnector(backend) {
    var currentHandlerId;
    var currentDragSourceNode;
    var currentDragSourceOptions;
    var disconnectCurrentDragSource;
    var currentDragPreviewNode;
    var currentDragPreviewOptions;
    var disconnectCurrentDragPreview;
    function reconnectDragSource() {
        if (disconnectCurrentDragSource) {
            disconnectCurrentDragSource();
            disconnectCurrentDragSource = undefined;
        }
        if (currentHandlerId && currentDragSourceNode) {
            disconnectCurrentDragSource = backend.connectDragSource(currentHandlerId, currentDragSourceNode, currentDragSourceOptions);
        }
    }
    function reconnectDragPreview() {
        if (disconnectCurrentDragPreview) {
            disconnectCurrentDragPreview();
            disconnectCurrentDragPreview = undefined;
        }
        if (currentHandlerId && currentDragPreviewNode) {
            disconnectCurrentDragPreview = backend.connectDragPreview(currentHandlerId, currentDragPreviewNode, currentDragPreviewOptions);
        }
    }
    function receiveHandlerId(handlerId) {
        if (handlerId === currentHandlerId) {
            return;
        }
        currentHandlerId = handlerId;
        reconnectDragSource();
        reconnectDragPreview();
    }
    var hooks = wrapConnectorHooks_1.default({
        dragSource: function connectDragSource(node, options) {
            if (node === currentDragSourceNode &&
                shallowEqual(options, currentDragSourceOptions)) {
                return;
            }
            currentDragSourceNode = node;
            currentDragSourceOptions = options;
            reconnectDragSource();
        },
        dragPreview: function connectDragPreview(node, options) {
            if (node === currentDragPreviewNode &&
                shallowEqual(options, currentDragPreviewOptions)) {
                return;
            }
            currentDragPreviewNode = node;
            currentDragPreviewOptions = options;
            reconnectDragPreview();
        },
    });
    return {
        receiveHandlerId: receiveHandlerId,
        hooks: hooks,
    };
}
exports["default"] = createSourceConnector;


/***/ },

/***/ 7296
/*!******************************************!*\
  !*** ./node_modules/lodash/_isMasked.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var coreJsData = __webpack_require__(/*! ./_coreJsData */ 5481);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ },

/***/ 7301
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseUnary.js ***!
  \*******************************************/
(module) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ },

/***/ 7315
/*!*****************************************************************************!*\
  !*** ./node_modules/react-tag-input/dist-modules/components/Suggestions.js ***!
  \*****************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(/*! react */ 1594);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ 5556);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isEqual = __webpack_require__(/*! lodash/isEqual */ 2404);

var _isEqual2 = _interopRequireDefault(_isEqual);

var _escape = __webpack_require__(/*! lodash/escape */ 4425);

var _escape2 = _interopRequireDefault(_escape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var maybeScrollSuggestionIntoView = function maybeScrollSuggestionIntoView(suggestionEl, suggestionsContainer) {
  var containerHeight = suggestionsContainer.offsetHeight;
  var suggestionHeight = suggestionEl.offsetHeight;
  var relativeSuggestionTop = suggestionEl.offsetTop - suggestionsContainer.scrollTop;

  if (relativeSuggestionTop + suggestionHeight >= containerHeight) {
    suggestionsContainer.scrollTop += relativeSuggestionTop - containerHeight + suggestionHeight;
  } else if (relativeSuggestionTop < 0) {
    suggestionsContainer.scrollTop += relativeSuggestionTop;
  }
};

var Suggestions = function (_Component) {
  _inherits(Suggestions, _Component);

  function Suggestions() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Suggestions);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Suggestions.__proto__ || Object.getPrototypeOf(Suggestions)).call.apply(_ref, [this].concat(args))), _this), _this.markIt = function (input, query) {
      var escapedRegex = query.trim().replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
      var labelValue = input[_this.props.labelField];


      return {
        __html: labelValue.replace(RegExp(escapedRegex, 'gi'), function (x) {
          return '<mark>' + (0, _escape2.default)(x) + '</mark>';
        })
      };
    }, _this.shouldRenderSuggestions = function (query) {
      var _this$props = _this.props,
          minQueryLength = _this$props.minQueryLength,
          isFocused = _this$props.isFocused;

      return query.length >= minQueryLength && isFocused;
    }, _this.renderSuggestion = function (item, query) {
      var renderSuggestion = _this.props.renderSuggestion;

      if (typeof renderSuggestion === 'function') {
        return renderSuggestion(item, query);
      }
      return _react2.default.createElement('span', { dangerouslySetInnerHTML: _this.markIt(item, query) });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Suggestions, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var props = this.props;

      var shouldRenderSuggestions = props.shouldRenderSuggestions || this.shouldRenderSuggestions;
      return props.isFocused !== nextProps.isFocused || !(0, _isEqual2.default)(props.suggestions, nextProps.suggestions) || shouldRenderSuggestions(nextProps.query) || shouldRenderSuggestions(nextProps.query) !== shouldRenderSuggestions(props.query);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props = this.props,
          selectedIndex = _props.selectedIndex,
          classNames = _props.classNames;


      if (this.suggestionsContainer && prevProps.selectedIndex !== selectedIndex) {
        var activeSuggestion = this.suggestionsContainer.querySelector(classNames.activeSuggestion);

        if (activeSuggestion) {
          maybeScrollSuggestionIntoView(activeSuggestion, this.suggestionsContainer);
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props;


      var suggestions = props.suggestions.map(function (item, i) {
        return _react2.default.createElement(
          'li',
          {
            key: i,
            onMouseDown: props.handleClick.bind(null, i),
            onTouchStart: props.handleClick.bind(null, i),
            onMouseOver: props.handleHover.bind(null, i),
            className: i === props.selectedIndex ? props.classNames.activeSuggestion : '' },
          this.renderSuggestion(item, props.query)
        );
      }.bind(this));

      // use the override, if provided
      var shouldRenderSuggestions = props.shouldRenderSuggestions || this.shouldRenderSuggestions;
      if (suggestions.length === 0 || !shouldRenderSuggestions(props.query)) {
        return null;
      }

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(elem) {
            _this2.suggestionsContainer = elem;
          },
          className: this.props.classNames.suggestions },
        _react2.default.createElement(
          'ul',
          null,
          ' ',
          suggestions,
          ' '
        )
      );
    }
  }]);

  return Suggestions;
}(_react.Component);

Suggestions.propTypes = {
  query: _propTypes2.default.string.isRequired,
  selectedIndex: _propTypes2.default.number.isRequired,
  suggestions: _propTypes2.default.array.isRequired,
  handleClick: _propTypes2.default.func.isRequired,
  handleHover: _propTypes2.default.func.isRequired,
  minQueryLength: _propTypes2.default.number,
  shouldRenderSuggestions: _propTypes2.default.func,
  isFocused: _propTypes2.default.bool.isRequired,
  classNames: _propTypes2.default.object,
  labelField: _propTypes2.default.string.isRequired,
  renderSuggestion: _propTypes2.default.func
};
Suggestions.defaultProps = {
  minQueryLength: 2
};
exports["default"] = Suggestions;

/***/ },

/***/ 7334
/*!*****************************************!*\
  !*** ./node_modules/lodash/constant.js ***!
  \*****************************************/
(module) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ },

/***/ 7357
/*!********************************************************!*\
  !*** ./node_modules/dnd-core/lib/reducers/refCount.js ***!
  \********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var registry_1 = __webpack_require__(/*! ../actions/registry */ 4092);
function refCount(state, action) {
    if (state === void 0) { state = 0; }
    switch (action.type) {
        case registry_1.ADD_SOURCE:
        case registry_1.ADD_TARGET:
            return state + 1;
        case registry_1.REMOVE_SOURCE:
        case registry_1.REMOVE_TARGET:
            return state - 1;
        default:
            return state;
    }
}
exports["default"] = refCount;


/***/ },

/***/ 7381
/*!*****************************************!*\
  !*** ./node_modules/lodash/_getData.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var metaMap = __webpack_require__(/*! ./_metaMap */ 8152),
    noop = __webpack_require__(/*! ./noop */ 3950);

/**
 * Gets metadata for `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {*} Returns the metadata for `func`.
 */
var getData = !metaMap ? noop : function(func) {
  return metaMap.get(func);
};

module.exports = getData;


/***/ },

/***/ 7386
/*!******************************************************!*\
  !*** ./node_modules/dnd-core/lib/utils/dirtiness.js ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var intersection = __webpack_require__(/*! lodash/intersection */ 5287);
exports.NONE = [];
exports.ALL = [];
/**
 * Determines if the given handler IDs are dirty or not.
 *
 * @param dirtyIds The set of dirty handler ids
 * @param handlerIds The set of handler ids to check
 */
function areDirty(dirtyIds, handlerIds) {
    if (dirtyIds === exports.NONE) {
        return false;
    }
    if (dirtyIds === exports.ALL || typeof handlerIds === 'undefined') {
        return true;
    }
    return intersection(handlerIds, dirtyIds).length > 0;
}
exports.areDirty = areDirty;


/***/ },

/***/ 7422
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseGet.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var castPath = __webpack_require__(/*! ./_castPath */ 1769),
    toKey = __webpack_require__(/*! ./_toKey */ 7797);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ },

/***/ 7426
/*!***********************************************************!*\
  !*** ./node_modules/react-dnd/lib/createTargetMonitor.js ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var invariant = __webpack_require__(/*! invariant */ 311);
var isCallingCanDrop = false;
var TargetMonitor = /** @class */ (function () {
    function TargetMonitor(manager) {
        this.internalMonitor = manager.getMonitor();
    }
    TargetMonitor.prototype.receiveHandlerId = function (targetId) {
        this.targetId = targetId;
    };
    TargetMonitor.prototype.canDrop = function () {
        invariant(!isCallingCanDrop, 'You may not call monitor.canDrop() inside your canDrop() implementation. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target-monitor.html');
        try {
            isCallingCanDrop = true;
            return this.internalMonitor.canDropOnTarget(this.targetId);
        }
        finally {
            isCallingCanDrop = false;
        }
    };
    TargetMonitor.prototype.isOver = function (options) {
        return this.internalMonitor.isOverTarget(this.targetId, options);
    };
    TargetMonitor.prototype.getItemType = function () {
        return this.internalMonitor.getItemType();
    };
    TargetMonitor.prototype.getItem = function () {
        return this.internalMonitor.getItem();
    };
    TargetMonitor.prototype.getDropResult = function () {
        return this.internalMonitor.getDropResult();
    };
    TargetMonitor.prototype.didDrop = function () {
        return this.internalMonitor.didDrop();
    };
    TargetMonitor.prototype.getInitialClientOffset = function () {
        return this.internalMonitor.getInitialClientOffset();
    };
    TargetMonitor.prototype.getInitialSourceClientOffset = function () {
        return this.internalMonitor.getInitialSourceClientOffset();
    };
    TargetMonitor.prototype.getSourceClientOffset = function () {
        return this.internalMonitor.getSourceClientOffset();
    };
    TargetMonitor.prototype.getClientOffset = function () {
        return this.internalMonitor.getClientOffset();
    };
    TargetMonitor.prototype.getDifferenceFromInitialOffset = function () {
        return this.internalMonitor.getDifferenceFromInitialOffset();
    };
    return TargetMonitor;
}());
exports.TargetMonitor = TargetMonitor;
function createTargetMonitor(manager) {
    return new TargetMonitor(manager);
}
exports["default"] = createTargetMonitor;


/***/ },

/***/ 7473
/*!******************************************!*\
  !*** ./node_modules/lodash/_toSource.js ***!
  \******************************************/
(module) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ },

/***/ 7534
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsArguments.js ***!
  \*************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 2552),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 346);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ },

/***/ 7549
/*!*******************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/getEmptyImage.js ***!
  \*******************************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var emptyImage;
function getEmptyImage() {
    if (!emptyImage) {
        emptyImage = new Image();
        emptyImage.src =
            'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    }
    return emptyImage;
}
exports["default"] = getEmptyImage;
//# sourceMappingURL=getEmptyImage.js.map

/***/ },

/***/ 7556
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseToString.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ 1873),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ 4932),
    isArray = __webpack_require__(/*! ./isArray */ 6449),
    isSymbol = __webpack_require__(/*! ./isSymbol */ 4394);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ },

/***/ 7644
/*!**********************************************************!*\
  !*** ./node_modules/dnd-core/lib/reducers/dragOffset.js ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var dragDrop_1 = __webpack_require__(/*! ../actions/dragDrop */ 580);
var equality_1 = __webpack_require__(/*! ../utils/equality */ 5977);
var initialState = {
    initialSourceClientOffset: null,
    initialClientOffset: null,
    clientOffset: null,
};
function dragOffset(state, action) {
    if (state === void 0) { state = initialState; }
    var payload = action.payload;
    switch (action.type) {
        case dragDrop_1.BEGIN_DRAG:
            return {
                initialSourceClientOffset: payload.sourceClientOffset,
                initialClientOffset: payload.clientOffset,
                clientOffset: payload.clientOffset,
            };
        case dragDrop_1.HOVER:
            if (equality_1.areCoordsEqual(state.clientOffset, payload.clientOffset)) {
                return state;
            }
            return __assign({}, state, { clientOffset: payload.clientOffset });
        case dragDrop_1.END_DRAG:
        case dragDrop_1.DROP:
            return initialState;
        default:
            return state;
    }
}
exports["default"] = dragOffset;


/***/ },

/***/ 7646
/*!***********************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/NativeDragSources.js ***!
  \***********************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var NativeTypes = __importStar(__webpack_require__(/*! ./NativeTypes */ 8015));
function getDataFromDataTransfer(dataTransfer, typesToTry, defaultValue) {
    var result = typesToTry.reduce(function (resultSoFar, typeToTry) { return resultSoFar || dataTransfer.getData(typeToTry); }, null);
    return result != null // eslint-disable-line eqeqeq
        ? result
        : defaultValue;
}
var nativeTypesConfig = (_a = {},
    _a[NativeTypes.FILE] = {
        exposeProperty: 'files',
        matchesTypes: ['Files'],
        getData: function (dataTransfer) {
            return Array.prototype.slice.call(dataTransfer.files);
        },
    },
    _a[NativeTypes.URL] = {
        exposeProperty: 'urls',
        matchesTypes: ['Url', 'text/uri-list'],
        getData: function (dataTransfer, matchesTypes) {
            return getDataFromDataTransfer(dataTransfer, matchesTypes, '').split('\n');
        },
    },
    _a[NativeTypes.TEXT] = {
        exposeProperty: 'text',
        matchesTypes: ['Text', 'text/plain'],
        getData: function (dataTransfer, matchesTypes) {
            return getDataFromDataTransfer(dataTransfer, matchesTypes, '');
        },
    },
    _a);
function createNativeDragSource(type) {
    var _a = nativeTypesConfig[type], exposeProperty = _a.exposeProperty, matchesTypes = _a.matchesTypes, getData = _a.getData;
    return /** @class */ (function () {
        function NativeDragSource() {
            this.item = (_a = {},
                Object.defineProperty(_a, exposeProperty, {
                    get: function () {
                        // tslint:disable-next-line no-console
                        console.warn("Browser doesn't allow reading \"" + exposeProperty + "\" until the drop event.");
                        return null;
                    },
                    enumerable: true,
                    configurable: true
                }),
                _a);
            var _a;
        }
        NativeDragSource.prototype.mutateItemByReadingDataTransfer = function (dataTransfer) {
            delete this.item[exposeProperty];
            this.item[exposeProperty] = getData(dataTransfer, matchesTypes);
        };
        NativeDragSource.prototype.canDrag = function () {
            return true;
        };
        NativeDragSource.prototype.beginDrag = function () {
            return this.item;
        };
        NativeDragSource.prototype.isDragging = function (monitor, handle) {
            return handle === monitor.getSourceId();
        };
        NativeDragSource.prototype.endDrag = function () {
            // empty
        };
        return NativeDragSource;
    }());
}
exports.createNativeDragSource = createNativeDragSource;
function matchNativeItemType(dataTransfer) {
    var dataTransferTypes = Array.prototype.slice.call(dataTransfer.types || []);
    return (Object.keys(nativeTypesConfig).filter(function (nativeItemType) {
        var matchesTypes = nativeTypesConfig[nativeItemType].matchesTypes;
        return matchesTypes.some(function (t) { return dataTransferTypes.indexOf(t) > -1; });
    })[0] || null);
}
exports.matchNativeItemType = matchNativeItemType;
var _a;
//# sourceMappingURL=NativeDragSources.js.map

/***/ },

/***/ 7659
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
(module) {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ },

/***/ 7670
/*!************************************************!*\
  !*** ./node_modules/lodash/_mapCacheDelete.js ***!
  \************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ 2651);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ },

/***/ 7797
/*!***************************************!*\
  !*** ./node_modules/lodash/_toKey.js ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isSymbol = __webpack_require__(/*! ./isSymbol */ 4394);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ },

/***/ 7825
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
(module) {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ },

/***/ 7828
/*!********************************************!*\
  !*** ./node_modules/lodash/_Uint8Array.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ 9325);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ },

/***/ 7987
/*!*********************************************!*\
  !*** ./node_modules/react-dnd/lib/index.js ***!
  \*********************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var DragDropContext_1 = __webpack_require__(/*! ./DragDropContext */ 1289);
exports.DragDropContext = DragDropContext_1.DragDropContext;
exports.DragDropContextProvider = DragDropContext_1.DragDropContextProvider;
var DragLayer_1 = __webpack_require__(/*! ./DragLayer */ 4820);
exports.DragLayer = DragLayer_1.default;
var DragSource_1 = __webpack_require__(/*! ./DragSource */ 1732);
exports.DragSource = DragSource_1.default;
var DropTarget_1 = __webpack_require__(/*! ./DropTarget */ 8511);
exports.DropTarget = DropTarget_1.default;


/***/ },

/***/ 8003
/*!*****************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/OffsetUtils.js ***!
  \*****************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var BrowserDetector_1 = __webpack_require__(/*! ./BrowserDetector */ 1105);
var MonotonicInterpolant_1 = __importDefault(__webpack_require__(/*! ./MonotonicInterpolant */ 6789));
var ELEMENT_NODE = 1;
function getNodeClientOffset(node) {
    var el = node.nodeType === ELEMENT_NODE ? node : node.parentElement;
    if (!el) {
        return null;
    }
    var _a = el.getBoundingClientRect(), top = _a.top, left = _a.left;
    return { x: left, y: top };
}
exports.getNodeClientOffset = getNodeClientOffset;
function getEventClientOffset(e) {
    return {
        x: e.clientX,
        y: e.clientY,
    };
}
exports.getEventClientOffset = getEventClientOffset;
function isImageNode(node) {
    return (node.nodeName === 'IMG' &&
        (BrowserDetector_1.isFirefox() || !document.documentElement.contains(node)));
}
function getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight) {
    var dragPreviewWidth = isImage ? dragPreview.width : sourceWidth;
    var dragPreviewHeight = isImage ? dragPreview.height : sourceHeight;
    // Work around @2x coordinate discrepancies in browsers
    if (BrowserDetector_1.isSafari() && isImage) {
        dragPreviewHeight /= window.devicePixelRatio;
        dragPreviewWidth /= window.devicePixelRatio;
    }
    return { dragPreviewWidth: dragPreviewWidth, dragPreviewHeight: dragPreviewHeight };
}
function getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint) {
    // The browsers will use the image intrinsic size under different conditions.
    // Firefox only cares if it's an image, but WebKit also wants it to be detached.
    var isImage = isImageNode(dragPreview);
    var dragPreviewNode = isImage ? sourceNode : dragPreview;
    var dragPreviewNodeOffsetFromClient = getNodeClientOffset(dragPreviewNode);
    var offsetFromDragPreview = {
        x: clientOffset.x - dragPreviewNodeOffsetFromClient.x,
        y: clientOffset.y - dragPreviewNodeOffsetFromClient.y,
    };
    var sourceWidth = sourceNode.offsetWidth, sourceHeight = sourceNode.offsetHeight;
    var anchorX = anchorPoint.anchorX, anchorY = anchorPoint.anchorY;
    var _a = getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight), dragPreviewWidth = _a.dragPreviewWidth, dragPreviewHeight = _a.dragPreviewHeight;
    var calculateYOffset = function () {
        var interpolantY = new MonotonicInterpolant_1.default([0, 0.5, 1], [
            // Dock to the top
            offsetFromDragPreview.y,
            // Align at the center
            offsetFromDragPreview.y / sourceHeight * dragPreviewHeight,
            // Dock to the bottom
            offsetFromDragPreview.y + dragPreviewHeight - sourceHeight,
        ]);
        var y = interpolantY.interpolate(anchorY);
        // Work around Safari 8 positioning bug
        if (BrowserDetector_1.isSafari() && isImage) {
            // We'll have to wait for @3x to see if this is entirely correct
            y += (window.devicePixelRatio - 1) * dragPreviewHeight;
        }
        return y;
    };
    var calculateXOffset = function () {
        // Interpolate coordinates depending on anchor point
        // If you know a simpler way to do this, let me know
        var interpolantX = new MonotonicInterpolant_1.default([0, 0.5, 1], [
            // Dock to the left
            offsetFromDragPreview.x,
            // Align at the center
            offsetFromDragPreview.x / sourceWidth * dragPreviewWidth,
            // Dock to the right
            offsetFromDragPreview.x + dragPreviewWidth - sourceWidth,
        ]);
        return interpolantX.interpolate(anchorX);
    };
    // Force offsets if specified in the options.
    var offsetX = offsetPoint.offsetX, offsetY = offsetPoint.offsetY;
    var isManualOffsetX = offsetX === 0 || offsetX;
    var isManualOffsetY = offsetY === 0 || offsetY;
    return {
        x: isManualOffsetX ? offsetX : calculateXOffset(),
        y: isManualOffsetY ? offsetY : calculateYOffset(),
    };
}
exports.getDragPreviewOffset = getDragPreviewOffset;
//# sourceMappingURL=OffsetUtils.js.map

/***/ },

/***/ 8015
/*!*****************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/NativeTypes.js ***!
  \*****************************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FILE = '__NATIVE_FILE__';
exports.URL = '__NATIVE_URL__';
exports.TEXT = '__NATIVE_TEXT__';
//# sourceMappingURL=NativeTypes.js.map

/***/ },

/***/ 8096
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseTimes.js ***!
  \*******************************************/
(module) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ },

/***/ 8152
/*!*****************************************!*\
  !*** ./node_modules/lodash/_metaMap.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var WeakMap = __webpack_require__(/*! ./_WeakMap */ 8303);

/** Used to store function metadata. */
var metaMap = WeakMap && new WeakMap;

module.exports = metaMap;


/***/ },

/***/ 8156
/*!************************************!*\
  !*** ./node_modules/lodash/get.js ***!
  \************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var baseGet = __webpack_require__(/*! ./_baseGet */ 7422);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ },

/***/ 8217
/*!*********************************************************************************!*\
  !*** ./node_modules/react-tag-input/dist-modules/components/RemoveComponent.js ***!
  \*********************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _react = __webpack_require__(/*! react */ 1594);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ 5556);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _constants = __webpack_require__(/*! ./constants */ 4319);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crossStr = String.fromCharCode(215);
var RemoveComponent = function RemoveComponent(props) {
  var readOnly = props.readOnly,
      removeComponent = props.removeComponent,
      onRemove = props.onRemove,
      className = props.className,
      tag = props.tag,
      index = props.index;


  var onKeydown = function onKeydown(event) {
    if (event.keyCode === _constants.KEYS.ENTER || event.keyCode === _constants.KEYS.SPACE) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.keyCode === _constants.KEYS.BACKSPACE) {
      onRemove(event);
    }
  };

  if (readOnly) {
    return _react2.default.createElement('span', null);
  }

  if (removeComponent) {
    var Component = removeComponent;
    return _react2.default.createElement(Component, props);
  }

  return _react2.default.createElement(
    'button',
    {
      onClick: onRemove,
      onKeyDown: onKeydown,
      className: className,
      'aria-label': 'Tag at index ' + index + ' with value ' + tag.id + ' focussed. Press backspace to remove' },
    crossStr
  );
};

RemoveComponent.propTypes = {
  className: _propTypes2.default.string,
  onRemove: _propTypes2.default.func.isRequired,
  readOnly: _propTypes2.default.bool,
  removeComponent: _propTypes2.default.func,
  tag: _propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired,
    className: _propTypes2.default.string,
    key: _propTypes2.default.string
  }),
  index: _propTypes2.default.number.isRequired
};

exports["default"] = RemoveComponent;

/***/ },

/***/ 8223
/*!*************************************!*\
  !*** ./node_modules/lodash/_Map.js ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ 6110),
    root = __webpack_require__(/*! ./_root */ 9325);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ },

/***/ 8238
/*!****************************************************!*\
  !*** ./node_modules/redux/es/redux.js + 1 modules ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __DO_NOT_USE__ActionTypes: () => (/* binding */ ActionTypes),
  applyMiddleware: () => (/* binding */ applyMiddleware),
  bindActionCreators: () => (/* binding */ bindActionCreators),
  combineReducers: () => (/* binding */ combineReducers),
  compose: () => (/* binding */ compose),
  createStore: () => (/* binding */ createStore),
  legacy_createStore: () => (/* binding */ legacy_createStore)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js + 3 modules
var defineProperty = __webpack_require__(4705);
;// ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js

function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      (0,defineProperty/* default */.A)(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}

;// ./node_modules/redux/es/redux.js


/**
 * Adapted from React: https://github.com/facebook/react/blob/master/packages/shared/formatProdErrorMessage.js
 *
 * Do not require this module directly! Use normal throw error calls. These messages will be replaced with error codes
 * during build.
 * @param {number} code
 */
function formatProdErrorMessage(code) {
  return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or " + 'use the non-minified dev environment for full errors. ';
}

// Inlined version of the `symbol-observable` polyfill
var $$observable = (function () {
  return typeof Symbol === 'function' && Symbol.observable || '@@observable';
})();

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

// Inlined / shortened version of `kindOf` from https://github.com/jonschlinkert/kind-of
function miniKindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';
  var type = typeof val;

  switch (type) {
    case 'boolean':
    case 'string':
    case 'number':
    case 'symbol':
    case 'function':
      {
        return type;
      }
  }

  if (Array.isArray(val)) return 'array';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  var constructorName = ctorName(val);

  switch (constructorName) {
    case 'Symbol':
    case 'Promise':
    case 'WeakMap':
    case 'WeakSet':
    case 'Map':
    case 'Set':
      return constructorName;
  } // other


  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
}

function ctorName(val) {
  return typeof val.constructor === 'function' ? val.constructor.name : null;
}

function isError(val) {
  return val instanceof Error || typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number';
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function' && typeof val.getDate === 'function' && typeof val.setDate === 'function';
}

function kindOf(val) {
  var typeOfVal = typeof val;

  if (false) // removed by dead control flow
{}

  return typeOfVal;
}

/**
 * @deprecated
 *
 * **We recommend using the `configureStore` method
 * of the `@reduxjs/toolkit` package**, which replaces `createStore`.
 *
 * Redux Toolkit is our recommended approach for writing Redux logic today,
 * including store setup, reducers, data fetching, and more.
 *
 * **For more details, please read this Redux docs page:**
 * **https://redux.js.org/introduction/why-rtk-is-redux-today**
 *
 * `configureStore` from Redux Toolkit is an improved version of `createStore` that
 * simplifies setup and helps avoid common bugs.
 *
 * You should not be using the `redux` core package by itself today, except for learning purposes.
 * The `createStore` method from the core `redux` package will not be removed, but we encourage
 * all users to migrate to using Redux Toolkit for all Redux code.
 *
 * If you want to use `createStore` without this visual deprecation warning, use
 * the `legacy_createStore` import instead:
 *
 * `import { legacy_createStore as createStore} from 'redux'`
 *
 */

function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error( true ? formatProdErrorMessage(0) : 0);
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error( true ? formatProdErrorMessage(1) : 0);
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error( true ? formatProdErrorMessage(2) : 0);
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error( true ? formatProdErrorMessage(3) : 0);
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error( true ? formatProdErrorMessage(4) : 0);
    }

    if (isDispatching) {
      throw new Error( true ? formatProdErrorMessage(5) : 0);
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error( true ? formatProdErrorMessage(6) : 0);
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error( true ? formatProdErrorMessage(7) : 0);
    }

    if (typeof action.type === 'undefined') {
      throw new Error( true ? formatProdErrorMessage(8) : 0);
    }

    if (isDispatching) {
      throw new Error( true ? formatProdErrorMessage(9) : 0);
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error( true ? formatProdErrorMessage(10) : 0);
    }

    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new Error( true ? formatProdErrorMessage(11) : 0);
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[$$observable] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}
/**
 * Creates a Redux store that holds the state tree.
 *
 * **We recommend using `configureStore` from the
 * `@reduxjs/toolkit` package**, which replaces `createStore`:
 * **https://redux.js.org/introduction/why-rtk-is-redux-today**
 *
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

var legacy_createStore = createStore;

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    return "The " + argumentName + " has unexpected type of \"" + kindOf(inputState) + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE) return;

  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error( true ? formatProdErrorMessage(12) : 0);
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error( true ? formatProdErrorMessage(13) : 0);
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (false) // removed by dead control flow
{}

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same
  // keys multiple times.

  var unexpectedKeyCache;

  if (false) // removed by dead control flow
{}

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (false) // removed by dead control flow
{ var warningMessage; }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var actionType = action && action.type;
        throw new Error( true ? formatProdErrorMessage(14) : 0);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass an action creator as the first argument,
 * and get a dispatch wrapped function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */


function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error( true ? formatProdErrorMessage(16) : 0);
  }

  var boundActionCreators = {};

  for (var key in actionCreators) {
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error( true ? formatProdErrorMessage(15) : 0);
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2(_objectSpread2({}, store), {}, {
        dispatch: _dispatch
      });
    };
  };
}




/***/ },

/***/ 8303
/*!*****************************************!*\
  !*** ./node_modules/lodash/_WeakMap.js ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ 6110),
    root = __webpack_require__(/*! ./_root */ 9325);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ },

/***/ 8379
/*!*********************************************************!*\
  !*** ./node_modules/react-dnd/lib/utils/isValidType.js ***!
  \*********************************************************/
(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function isValidType(type, allowArray) {
    return (typeof type === 'string' ||
        typeof type === 'symbol' ||
        (!!allowArray &&
            Array.isArray(type) &&
            type.every(function (t) { return isValidType(t, false); })));
}
exports["default"] = isValidType;


/***/ },

/***/ 8511
/*!**************************************************!*\
  !*** ./node_modules/react-dnd/lib/DropTarget.js ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var checkDecoratorArguments_1 = __webpack_require__(/*! ./utils/checkDecoratorArguments */ 4306);
var decorateHandler_1 = __webpack_require__(/*! ./decorateHandler */ 1258);
var registerTarget_1 = __webpack_require__(/*! ./registerTarget */ 5331);
var createTargetFactory_1 = __webpack_require__(/*! ./createTargetFactory */ 9534);
var createTargetMonitor_1 = __webpack_require__(/*! ./createTargetMonitor */ 7426);
var createTargetConnector_1 = __webpack_require__(/*! ./createTargetConnector */ 1975);
var isValidType_1 = __webpack_require__(/*! ./utils/isValidType */ 8379);
var invariant = __webpack_require__(/*! invariant */ 311);
var isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ 1331);
function DropTarget(type, spec, collect, options) {
    if (options === void 0) { options = {}; }
    checkDecoratorArguments_1.default('DropTarget', 'type, spec, collect[, options]', type, spec, collect, options);
    var getType = type;
    if (typeof type !== 'function') {
        invariant(isValidType_1.default(type, true), 'Expected "type" provided as the first argument to DropTarget to be ' +
            'a string, an array of strings, or a function that returns either given ' +
            'the current props. Instead, received %s. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', type);
        getType = function () { return type; };
    }
    invariant(isPlainObject(spec), 'Expected "spec" provided as the second argument to DropTarget to be ' +
        'a plain object. Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', spec);
    var createTarget = createTargetFactory_1.default(spec);
    invariant(typeof collect === 'function', 'Expected "collect" provided as the third argument to DropTarget to be ' +
        'a function that returns a plain object of props to inject. ' +
        'Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', collect);
    invariant(isPlainObject(options), 'Expected "options" provided as the fourth argument to DropTarget to be ' +
        'a plain object when specified. ' +
        'Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', collect);
    return function decorateTarget(DecoratedComponent) {
        return decorateHandler_1.default({
            containerDisplayName: 'DropTarget',
            createHandler: createTarget,
            registerHandler: registerTarget_1.default,
            createMonitor: createTargetMonitor_1.default,
            createConnector: createTargetConnector_1.default,
            DecoratedComponent: DecoratedComponent,
            getType: getType,
            collect: collect,
            options: options,
        });
    };
}
exports["default"] = DropTarget;


/***/ },

/***/ 8514
/*!**************************************************************!*\
  !*** ./node_modules/react-transition-group/CSSTransition.js ***!
  \**************************************************************/
(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = void 0;

var PropTypes = _interopRequireWildcard(__webpack_require__(/*! prop-types */ 5556));

var _addClass = _interopRequireDefault(__webpack_require__(/*! dom-helpers/class/addClass */ 2963));

var _removeClass = _interopRequireDefault(__webpack_require__(/*! dom-helpers/class/removeClass */ 788));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ 1594));

var _Transition = _interopRequireDefault(__webpack_require__(/*! ./Transition */ 495));

var _PropTypes = __webpack_require__(/*! ./utils/PropTypes */ 554);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var addClass = function addClass(node, classes) {
  return node && classes && classes.split(' ').forEach(function (c) {
    return (0, _addClass.default)(node, c);
  });
};

var removeClass = function removeClass(node, classes) {
  return node && classes && classes.split(' ').forEach(function (c) {
    return (0, _removeClass.default)(node, c);
  });
};
/**
 * A transition component inspired by the excellent
 * [ng-animate](http://www.nganimate.org/) library, you should use it if you're
 * using CSS transitions or animations. It's built upon the
 * [`Transition`](https://reactcommunity.org/react-transition-group/transition)
 * component, so it inherits all of its props.
 *
 * `CSSTransition` applies a pair of class names during the `appear`, `enter`,
 * and `exit` states of the transition. The first class is applied and then a
 * second `*-active` class in order to activate the CSSS transition. After the
 * transition, matching `*-done` class names are applied to persist the
 * transition state.
 *
 * ```jsx
 * function App() {
 *   const [inProp, setInProp] = useState(false);
 *   return (
 *     <div>
 *       <CSSTransition in={inProp} timeout={200} classNames="my-node">
 *         <div>
 *           {"I'll receive my-node-* classes"}
 *         </div>
 *       </CSSTransition>
 *       <button type="button" onClick={() => setInProp(true)}>
 *         Click to Enter
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * When the `in` prop is set to `true`, the child component will first receive
 * the class `example-enter`, then the `example-enter-active` will be added in
 * the next tick. `CSSTransition` [forces a
 * reflow](https://github.com/reactjs/react-transition-group/blob/5007303e729a74be66a21c3e2205e4916821524b/src/CSSTransition.js#L208-L215)
 * between before adding the `example-enter-active`. This is an important trick
 * because it allows us to transition between `example-enter` and
 * `example-enter-active` even though they were added immediately one after
 * another. Most notably, this is what makes it possible for us to animate
 * _appearance_.
 *
 * ```css
 * .my-node-enter {
 *   opacity: 0;
 * }
 * .my-node-enter-active {
 *   opacity: 1;
 *   transition: opacity 200ms;
 * }
 * .my-node-exit {
 *   opacity: 1;
 * }
 * .my-node-exit-active {
 *   opacity: 0;
 *   transition: opacity 200ms;
 * }
 * ```
 *
 * `*-active` classes represent which styles you want to animate **to**.
 */


var CSSTransition =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(CSSTransition, _React$Component);

  function CSSTransition() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _this.onEnter = function (node, appearing) {
      var _this$getClassNames = _this.getClassNames(appearing ? 'appear' : 'enter'),
          className = _this$getClassNames.className;

      _this.removeClasses(node, 'exit');

      addClass(node, className);

      if (_this.props.onEnter) {
        _this.props.onEnter(node, appearing);
      }
    };

    _this.onEntering = function (node, appearing) {
      var _this$getClassNames2 = _this.getClassNames(appearing ? 'appear' : 'enter'),
          activeClassName = _this$getClassNames2.activeClassName;

      _this.reflowAndAddClass(node, activeClassName);

      if (_this.props.onEntering) {
        _this.props.onEntering(node, appearing);
      }
    };

    _this.onEntered = function (node, appearing) {
      var appearClassName = _this.getClassNames('appear').doneClassName;

      var enterClassName = _this.getClassNames('enter').doneClassName;

      var doneClassName = appearing ? appearClassName + " " + enterClassName : enterClassName;

      _this.removeClasses(node, appearing ? 'appear' : 'enter');

      addClass(node, doneClassName);

      if (_this.props.onEntered) {
        _this.props.onEntered(node, appearing);
      }
    };

    _this.onExit = function (node) {
      var _this$getClassNames3 = _this.getClassNames('exit'),
          className = _this$getClassNames3.className;

      _this.removeClasses(node, 'appear');

      _this.removeClasses(node, 'enter');

      addClass(node, className);

      if (_this.props.onExit) {
        _this.props.onExit(node);
      }
    };

    _this.onExiting = function (node) {
      var _this$getClassNames4 = _this.getClassNames('exit'),
          activeClassName = _this$getClassNames4.activeClassName;

      _this.reflowAndAddClass(node, activeClassName);

      if (_this.props.onExiting) {
        _this.props.onExiting(node);
      }
    };

    _this.onExited = function (node) {
      var _this$getClassNames5 = _this.getClassNames('exit'),
          doneClassName = _this$getClassNames5.doneClassName;

      _this.removeClasses(node, 'exit');

      addClass(node, doneClassName);

      if (_this.props.onExited) {
        _this.props.onExited(node);
      }
    };

    _this.getClassNames = function (type) {
      var classNames = _this.props.classNames;
      var isStringClassNames = typeof classNames === 'string';
      var prefix = isStringClassNames && classNames ? classNames + '-' : '';
      var className = isStringClassNames ? prefix + type : classNames[type];
      var activeClassName = isStringClassNames ? className + '-active' : classNames[type + 'Active'];
      var doneClassName = isStringClassNames ? className + '-done' : classNames[type + 'Done'];
      return {
        className: className,
        activeClassName: activeClassName,
        doneClassName: doneClassName
      };
    };

    return _this;
  }

  var _proto = CSSTransition.prototype;

  _proto.removeClasses = function removeClasses(node, type) {
    var _this$getClassNames6 = this.getClassNames(type),
        className = _this$getClassNames6.className,
        activeClassName = _this$getClassNames6.activeClassName,
        doneClassName = _this$getClassNames6.doneClassName;

    className && removeClass(node, className);
    activeClassName && removeClass(node, activeClassName);
    doneClassName && removeClass(node, doneClassName);
  };

  _proto.reflowAndAddClass = function reflowAndAddClass(node, className) {
    // This is for to force a repaint,
    // which is necessary in order to transition styles when adding a class name.
    if (className) {
      /* eslint-disable no-unused-expressions */
      node && node.scrollTop;
      /* eslint-enable no-unused-expressions */

      addClass(node, className);
    }
  };

  _proto.render = function render() {
    var props = _extends({}, this.props);

    delete props.classNames;
    return _react.default.createElement(_Transition.default, _extends({}, props, {
      onEnter: this.onEnter,
      onEntered: this.onEntered,
      onEntering: this.onEntering,
      onExit: this.onExit,
      onExiting: this.onExiting,
      onExited: this.onExited
    }));
  };

  return CSSTransition;
}(_react.default.Component);

CSSTransition.defaultProps = {
  classNames: ''
};
CSSTransition.propTypes =  false ? 0 : {};
var _default = CSSTransition;
exports["default"] = _default;
module.exports = exports["default"];

/***/ },

/***/ 8586
/*!***************************************!*\
  !*** ./node_modules/lodash/_isKey.js ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isArray = __webpack_require__(/*! ./isArray */ 6449),
    isSymbol = __webpack_require__(/*! ./isSymbol */ 4394);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ },

/***/ 8605
/*!***********************************************************************!*\
  !*** ./node_modules/react-transition-group/TransitionGroupContext.js ***!
  \***********************************************************************/
(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ 1594));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _react.default.createContext(null);

exports["default"] = _default;
module.exports = exports["default"];

/***/ },

/***/ 8655
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheHas.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ 6025);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ },

/***/ 8816
/*!******************************************!*\
  !*** ./node_modules/lodash/_flatRest.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var flatten = __webpack_require__(/*! ./flatten */ 5970),
    overRest = __webpack_require__(/*! ./_overRest */ 6757),
    setToString = __webpack_require__(/*! ./_setToString */ 2865);

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;


/***/ },

/***/ 8859
/*!******************************************!*\
  !*** ./node_modules/lodash/_SetCache.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var MapCache = __webpack_require__(/*! ./_MapCache */ 3661),
    setCacheAdd = __webpack_require__(/*! ./_setCacheAdd */ 1380),
    setCacheHas = __webpack_require__(/*! ./_setCacheHas */ 1459);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ },

/***/ 8879
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getPrototype.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var overArg = __webpack_require__(/*! ./_overArg */ 4335);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ },

/***/ 8929
/*!***************************************************************!*\
  !*** ./node_modules/react-dnd/lib/utils/disposables/index.js ***!
  \***************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", ({ value: true }));
__export(__webpack_require__(/*! ./Disposable */ 2795));
__export(__webpack_require__(/*! ./SerialDisposable */ 5943));
__export(__webpack_require__(/*! ./CompositeDisposable */ 1636));


/***/ },

/***/ 8984
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseKeys.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isPrototype = __webpack_require__(/*! ./_isPrototype */ 5527),
    nativeKeys = __webpack_require__(/*! ./_nativeKeys */ 3650);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ },

/***/ 9121
/*!*****************************************************!*\
  !*** ./node_modules/dnd-core/lib/reducers/index.js ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var dragOffset_1 = __webpack_require__(/*! ./dragOffset */ 7644);
var dragOperation_1 = __webpack_require__(/*! ./dragOperation */ 2246);
var refCount_1 = __webpack_require__(/*! ./refCount */ 7357);
var dirtyHandlerIds_1 = __webpack_require__(/*! ./dirtyHandlerIds */ 3499);
var stateId_1 = __webpack_require__(/*! ./stateId */ 949);
var get = __webpack_require__(/*! lodash/get */ 8156);
function reduce(state, action) {
    if (state === void 0) { state = {}; }
    return {
        dirtyHandlerIds: dirtyHandlerIds_1.default(state.dirtyHandlerIds, {
            type: action.type,
            payload: __assign({}, action.payload, { prevTargetIds: get(state, 'dragOperation.targetIds', []) }),
        }),
        dragOffset: dragOffset_1.default(state.dragOffset, action),
        refCount: refCount_1.default(state.refCount, action),
        dragOperation: dragOperation_1.default(state.dragOperation, action),
        stateId: stateId_1.default(state.stateId),
    };
}
exports["default"] = reduce;


/***/ },

/***/ 9206
/*!***********************************************************!*\
  !*** ./node_modules/react-dnd/lib/createSourceMonitor.js ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var invariant = __webpack_require__(/*! invariant */ 311);
var isCallingCanDrag = false;
var isCallingIsDragging = false;
var SourceMonitor = /** @class */ (function () {
    function SourceMonitor(manager) {
        this.internalMonitor = manager.getMonitor();
    }
    SourceMonitor.prototype.receiveHandlerId = function (sourceId) {
        this.sourceId = sourceId;
    };
    SourceMonitor.prototype.canDrag = function () {
        invariant(!isCallingCanDrag, 'You may not call monitor.canDrag() inside your canDrag() implementation. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source-monitor.html');
        try {
            isCallingCanDrag = true;
            return this.internalMonitor.canDragSource(this.sourceId);
        }
        finally {
            isCallingCanDrag = false;
        }
    };
    SourceMonitor.prototype.isDragging = function () {
        invariant(!isCallingIsDragging, 'You may not call monitor.isDragging() inside your isDragging() implementation. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source-monitor.html');
        try {
            isCallingIsDragging = true;
            return this.internalMonitor.isDraggingSource(this.sourceId);
        }
        finally {
            isCallingIsDragging = false;
        }
    };
    SourceMonitor.prototype.subscribeToStateChange = function (listener, options) {
        return this.internalMonitor.subscribeToStateChange(listener, options);
    };
    SourceMonitor.prototype.isDraggingSource = function (sourceId) {
        return this.internalMonitor.isDraggingSource(sourceId);
    };
    SourceMonitor.prototype.isOverTarget = function (targetId, options) {
        return this.internalMonitor.isOverTarget(targetId, options);
    };
    SourceMonitor.prototype.getTargetIds = function () {
        return this.internalMonitor.getTargetIds();
    };
    SourceMonitor.prototype.isSourcePublic = function () {
        return this.internalMonitor.isSourcePublic();
    };
    SourceMonitor.prototype.getSourceId = function () {
        return this.internalMonitor.getSourceId();
    };
    SourceMonitor.prototype.subscribeToOffsetChange = function (listener) {
        return this.internalMonitor.subscribeToOffsetChange(listener);
    };
    SourceMonitor.prototype.canDragSource = function (sourceId) {
        return this.internalMonitor.canDragSource(sourceId);
    };
    SourceMonitor.prototype.canDropOnTarget = function (targetId) {
        return this.internalMonitor.canDropOnTarget(targetId);
    };
    SourceMonitor.prototype.getItemType = function () {
        return this.internalMonitor.getItemType();
    };
    SourceMonitor.prototype.getItem = function () {
        return this.internalMonitor.getItem();
    };
    SourceMonitor.prototype.getDropResult = function () {
        return this.internalMonitor.getDropResult();
    };
    SourceMonitor.prototype.didDrop = function () {
        return this.internalMonitor.didDrop();
    };
    SourceMonitor.prototype.getInitialClientOffset = function () {
        return this.internalMonitor.getInitialClientOffset();
    };
    SourceMonitor.prototype.getInitialSourceClientOffset = function () {
        return this.internalMonitor.getInitialSourceClientOffset();
    };
    SourceMonitor.prototype.getSourceClientOffset = function () {
        return this.internalMonitor.getSourceClientOffset();
    };
    SourceMonitor.prototype.getClientOffset = function () {
        return this.internalMonitor.getClientOffset();
    };
    SourceMonitor.prototype.getDifferenceFromInitialOffset = function () {
        return this.internalMonitor.getDifferenceFromInitialOffset();
    };
    return SourceMonitor;
}());
function createSourceMonitor(manager) {
    return new SourceMonitor(manager);
}
exports["default"] = createSourceMonitor;


/***/ },

/***/ 9213
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/editor/components/EditorModalFooter.scss ***!
  \**************************************************************************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ 1601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ 6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `#sign-msg-option{color:#757575}.collapsed[data-target="#sign-msg-option"] span.icon:before{content:""}[data-target="#sign-msg-option"]:not(.collapsed) span.icon:before{content:""}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 9219
/*!******************************************!*\
  !*** ./node_modules/lodash/_cacheHas.js ***!
  \******************************************/
(module) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ },

/***/ 9302
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseRest.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var identity = __webpack_require__(/*! ./identity */ 3488),
    overRest = __webpack_require__(/*! ./_overRest */ 6757),
    setToString = __webpack_require__(/*! ./_setToString */ 2865);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ },

/***/ 9325
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ 4840);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ },

/***/ 9344
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseCreate.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./isObject */ 3805);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ },

/***/ 9350
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
(module) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ },

/***/ 9534
/*!***********************************************************!*\
  !*** ./node_modules/react-dnd/lib/createTargetFactory.js ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var react_1 = __webpack_require__(/*! react */ 1594);
var invariant = __webpack_require__(/*! invariant */ 311);
var isPlainObject = __webpack_require__(/*! lodash/isPlainObject */ 1331);
var ALLOWED_SPEC_METHODS = ['canDrop', 'hover', 'drop'];
function createTargetFactory(spec) {
    Object.keys(spec).forEach(function (key) {
        invariant(ALLOWED_SPEC_METHODS.indexOf(key) > -1, 'Expected the drop target specification to only have ' +
            'some of the following keys: %s. ' +
            'Instead received a specification with an unexpected "%s" key. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', ALLOWED_SPEC_METHODS.join(', '), key);
        invariant(typeof spec[key] === 'function', 'Expected %s in the drop target specification to be a function. ' +
            'Instead received a specification with %s: %s. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', key, key, spec[key]);
    });
    var TargetImpl = /** @class */ (function () {
        function TargetImpl(monitor) {
            this.monitor = monitor;
            this.props = null;
            this.ref = react_1.createRef();
        }
        TargetImpl.prototype.receiveProps = function (props) {
            this.props = props;
        };
        TargetImpl.prototype.receiveMonitor = function (monitor) {
            this.monitor = monitor;
        };
        TargetImpl.prototype.canDrop = function () {
            if (!spec.canDrop) {
                return true;
            }
            return spec.canDrop(this.props, this.monitor);
        };
        TargetImpl.prototype.hover = function () {
            if (!spec.hover) {
                return;
            }
            spec.hover(this.props, this.monitor, this.ref.current);
        };
        TargetImpl.prototype.drop = function () {
            if (!spec.drop) {
                return undefined;
            }
            var dropResult = spec.drop(this.props, this.monitor, this.ref.current);
            if (false) // removed by dead control flow
{}
            return dropResult;
        };
        return TargetImpl;
    }());
    return function createTarget(monitor) {
        return new TargetImpl(monitor);
    };
}
exports["default"] = createTargetFactory;


/***/ },

/***/ 9570
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseSetToString.js ***!
  \*************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var constant = __webpack_require__(/*! ./constant */ 7334),
    defineProperty = __webpack_require__(/*! ./_defineProperty */ 3243),
    identity = __webpack_require__(/*! ./identity */ 3488);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ },

/***/ 9598
/*!***************************************!*\
  !*** ./node_modules/lodash/_Stack.js ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var ListCache = __webpack_require__(/*! ./_ListCache */ 79),
    stackClear = __webpack_require__(/*! ./_stackClear */ 1420),
    stackDelete = __webpack_require__(/*! ./_stackDelete */ 938),
    stackGet = __webpack_require__(/*! ./_stackGet */ 3605),
    stackHas = __webpack_require__(/*! ./_stackHas */ 9817),
    stackSet = __webpack_require__(/*! ./_stackSet */ 945);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ },

/***/ 9674
/*!**********************************************************!*\
  !*** ./node_modules/react-dnd/lib/wrapConnectorHooks.js ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var react_1 = __webpack_require__(/*! react */ 1594);
var cloneWithRef_1 = __webpack_require__(/*! ./utils/cloneWithRef */ 4171);
function throwIfCompositeComponentElement(element) {
    // Custom components can no longer be wrapped directly in React DnD 2.0
    // so that we don't need to depend on findDOMNode() from react-dom.
    if (typeof element.type === 'string') {
        return;
    }
    var displayName = element.type.displayName || element.type.name || 'the component';
    throw new Error('Only native element nodes can now be passed to React DnD connectors.' +
        ("You can either wrap " + displayName + " into a <div>, or turn it into a ") +
        'drag source or a drop target itself.');
}
function wrapHookToRecognizeElement(hook) {
    return function (elementOrNode, options) {
        if (elementOrNode === void 0) { elementOrNode = null; }
        if (options === void 0) { options = null; }
        // When passed a node, call the hook straight away.
        if (!react_1.isValidElement(elementOrNode)) {
            var node = elementOrNode;
            hook(node, options);
            return undefined;
        }
        // If passed a ReactElement, clone it and attach this function as a ref.
        // This helps us achieve a neat API where user doesn't even know that refs
        // are being used under the hood.
        var element = elementOrNode;
        throwIfCompositeComponentElement(element);
        // When no options are passed, use the hook directly
        var ref = options ? function (node) { return hook(node, options); } : hook;
        return cloneWithRef_1.default(element, ref);
    };
}
function wrapConnectorHooks(hooks) {
    var wrappedHooks = {};
    Object.keys(hooks).forEach(function (key) {
        var hook = hooks[key];
        var wrappedHook = wrapHookToRecognizeElement(hook);
        wrappedHooks[key] = function () { return wrappedHook; };
    });
    return wrappedHooks;
}
exports["default"] = wrapConnectorHooks;


/***/ },

/***/ 9767
/*!******************************************************************!*\
  !*** ./node_modules/react-dnd-html5-backend/lib/HTML5Backend.js ***!
  \******************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/* eslint-disable no-underscore-dangle */
var defaults_1 = __importDefault(__webpack_require__(/*! lodash/defaults */ 4684));
var EnterLeaveCounter_1 = __importDefault(__webpack_require__(/*! ./EnterLeaveCounter */ 3344));
var BrowserDetector_1 = __webpack_require__(/*! ./BrowserDetector */ 1105);
var OffsetUtils_1 = __webpack_require__(/*! ./OffsetUtils */ 8003);
var NativeDragSources_1 = __webpack_require__(/*! ./NativeDragSources */ 7646);
var NativeTypes = __importStar(__webpack_require__(/*! ./NativeTypes */ 8015));
var autobind_decorator_1 = __importDefault(__webpack_require__(/*! autobind-decorator */ 7217));
var shallowEqual = __webpack_require__(/*! shallowequal */ 2833);
var HTML5Backend = /** @class */ (function () {
    function HTML5Backend(manager) {
        this.sourcePreviewNodes = {};
        this.sourcePreviewNodeOptions = {};
        this.sourceNodes = {};
        this.sourceNodeOptions = {};
        this.enterLeaveCounter = new EnterLeaveCounter_1.default();
        this.dragStartSourceIds = null;
        this.dropTargetIds = [];
        this.dragEnterTargetIds = [];
        this.currentNativeSource = null;
        this.currentNativeHandle = null;
        this.currentDragSourceNode = null;
        this.currentDragSourceNodeOffset = null;
        this.currentDragSourceNodeOffsetChanged = false;
        this.altKeyPressed = false;
        this.mouseMoveTimeoutTimer = null;
        this.asyncEndDragFrameId = null;
        this.dragOverTargetIds = null;
        this.actions = manager.getActions();
        this.monitor = manager.getMonitor();
        this.registry = manager.getRegistry();
        this.context = manager.getContext();
    }
    Object.defineProperty(HTML5Backend.prototype, "window", {
        // public for test
        get: function () {
            if (this.context && this.context.window) {
                return this.context.window;
            }
            else if (typeof window !== 'undefined') {
                return window;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    HTML5Backend.prototype.setup = function () {
        if (this.window === undefined) {
            return;
        }
        if (this.window.__isReactDndBackendSetUp) {
            throw new Error('Cannot have two HTML5 backends at the same time.');
        }
        this.window.__isReactDndBackendSetUp = true;
        this.addEventListeners(this.window);
    };
    HTML5Backend.prototype.teardown = function () {
        if (this.window === undefined) {
            return;
        }
        this.window.__isReactDndBackendSetUp = false;
        this.removeEventListeners(this.window);
        this.clearCurrentDragSourceNode();
        if (this.asyncEndDragFrameId) {
            this.window.cancelAnimationFrame(this.asyncEndDragFrameId);
        }
    };
    HTML5Backend.prototype.connectDragPreview = function (sourceId, node, options) {
        var _this = this;
        this.sourcePreviewNodeOptions[sourceId] = options;
        this.sourcePreviewNodes[sourceId] = node;
        return function () {
            delete _this.sourcePreviewNodes[sourceId];
            delete _this.sourcePreviewNodeOptions[sourceId];
        };
    };
    HTML5Backend.prototype.connectDragSource = function (sourceId, node, options) {
        var _this = this;
        this.sourceNodes[sourceId] = node;
        this.sourceNodeOptions[sourceId] = options;
        var handleDragStart = function (e) { return _this.handleDragStart(e, sourceId); };
        var handleSelectStart = function (e) { return _this.handleSelectStart(e); };
        node.setAttribute('draggable', true);
        node.addEventListener('dragstart', handleDragStart);
        node.addEventListener('selectstart', handleSelectStart);
        return function () {
            delete _this.sourceNodes[sourceId];
            delete _this.sourceNodeOptions[sourceId];
            node.removeEventListener('dragstart', handleDragStart);
            node.removeEventListener('selectstart', handleSelectStart);
            node.setAttribute('draggable', false);
        };
    };
    HTML5Backend.prototype.connectDropTarget = function (targetId, node) {
        var _this = this;
        var handleDragEnter = function (e) { return _this.handleDragEnter(e, targetId); };
        var handleDragOver = function (e) { return _this.handleDragOver(e, targetId); };
        var handleDrop = function (e) { return _this.handleDrop(e, targetId); };
        node.addEventListener('dragenter', handleDragEnter);
        node.addEventListener('dragover', handleDragOver);
        node.addEventListener('drop', handleDrop);
        return function () {
            node.removeEventListener('dragenter', handleDragEnter);
            node.removeEventListener('dragover', handleDragOver);
            node.removeEventListener('drop', handleDrop);
        };
    };
    HTML5Backend.prototype.addEventListeners = function (target) {
        // SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
        if (!target.addEventListener) {
            return;
        }
        target.addEventListener('dragstart', this.handleTopDragStart);
        target.addEventListener('dragstart', this.handleTopDragStartCapture, true);
        target.addEventListener('dragend', this.handleTopDragEndCapture, true);
        target.addEventListener('dragenter', this.handleTopDragEnter);
        target.addEventListener('dragenter', this.handleTopDragEnterCapture, true);
        target.addEventListener('dragleave', this.handleTopDragLeaveCapture, true);
        target.addEventListener('dragover', this.handleTopDragOver);
        target.addEventListener('dragover', this.handleTopDragOverCapture, true);
        target.addEventListener('drop', this.handleTopDrop);
        target.addEventListener('drop', this.handleTopDropCapture, true);
    };
    HTML5Backend.prototype.removeEventListeners = function (target) {
        // SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
        if (!target.removeEventListener) {
            return;
        }
        target.removeEventListener('dragstart', this.handleTopDragStart);
        target.removeEventListener('dragstart', this.handleTopDragStartCapture, true);
        target.removeEventListener('dragend', this.handleTopDragEndCapture, true);
        target.removeEventListener('dragenter', this.handleTopDragEnter);
        target.removeEventListener('dragenter', this.handleTopDragEnterCapture, true);
        target.removeEventListener('dragleave', this.handleTopDragLeaveCapture, true);
        target.removeEventListener('dragover', this.handleTopDragOver);
        target.removeEventListener('dragover', this.handleTopDragOverCapture, true);
        target.removeEventListener('drop', this.handleTopDrop);
        target.removeEventListener('drop', this.handleTopDropCapture, true);
    };
    HTML5Backend.prototype.getCurrentSourceNodeOptions = function () {
        var sourceId = this.monitor.getSourceId();
        var sourceNodeOptions = this.sourceNodeOptions[sourceId];
        return defaults_1.default(sourceNodeOptions || {}, {
            dropEffect: this.altKeyPressed ? 'copy' : 'move',
        });
    };
    HTML5Backend.prototype.getCurrentDropEffect = function () {
        if (this.isDraggingNativeItem()) {
            // It makes more sense to default to 'copy' for native resources
            return 'copy';
        }
        return this.getCurrentSourceNodeOptions().dropEffect;
    };
    HTML5Backend.prototype.getCurrentSourcePreviewNodeOptions = function () {
        var sourceId = this.monitor.getSourceId();
        var sourcePreviewNodeOptions = this.sourcePreviewNodeOptions[sourceId];
        return defaults_1.default(sourcePreviewNodeOptions || {}, {
            anchorX: 0.5,
            anchorY: 0.5,
            captureDraggingState: false,
        });
    };
    HTML5Backend.prototype.getSourceClientOffset = function (sourceId) {
        return OffsetUtils_1.getNodeClientOffset(this.sourceNodes[sourceId]);
    };
    HTML5Backend.prototype.isDraggingNativeItem = function () {
        var itemType = this.monitor.getItemType();
        return Object.keys(NativeTypes).some(function (key) { return NativeTypes[key] === itemType; });
    };
    HTML5Backend.prototype.beginDragNativeItem = function (type) {
        this.clearCurrentDragSourceNode();
        var SourceType = NativeDragSources_1.createNativeDragSource(type);
        this.currentNativeSource = new SourceType();
        this.currentNativeHandle = this.registry.addSource(type, this.currentNativeSource);
        this.actions.beginDrag([this.currentNativeHandle]);
    };
    HTML5Backend.prototype.asyncEndDragNativeItem = function () {
        if (this.window) {
            this.asyncEndDragFrameId = this.window.requestAnimationFrame(this.endDragNativeItem);
        }
    };
    HTML5Backend.prototype.endDragNativeItem = function () {
        if (!this.isDraggingNativeItem()) {
            return;
        }
        this.actions.endDrag();
        this.registry.removeSource(this.currentNativeHandle);
        this.currentNativeHandle = null;
        this.currentNativeSource = null;
    };
    HTML5Backend.prototype.isNodeInDocument = function (node) {
        // Check the node either in the main document or in the current context
        return ((!!document && document.body.contains(node)) ||
            (!!this.window && this.window.document.body.contains(node)));
    };
    HTML5Backend.prototype.endDragIfSourceWasRemovedFromDOM = function () {
        var node = this.currentDragSourceNode;
        if (this.isNodeInDocument(node)) {
            return;
        }
        if (this.clearCurrentDragSourceNode()) {
            this.actions.endDrag();
        }
    };
    HTML5Backend.prototype.setCurrentDragSourceNode = function (node) {
        var _this = this;
        this.clearCurrentDragSourceNode();
        this.currentDragSourceNode = node;
        this.currentDragSourceNodeOffset = OffsetUtils_1.getNodeClientOffset(node);
        this.currentDragSourceNodeOffsetChanged = false;
        // A timeout of > 0 is necessary to resolve Firefox issue referenced
        // See:
        //   * https://github.com/react-dnd/react-dnd/pull/928
        //   * https://github.com/react-dnd/react-dnd/issues/869
        var MOUSE_MOVE_TIMEOUT = 1000;
        // Receiving a mouse event in the middle of a dragging operation
        // means it has ended and the drag source node disappeared from DOM,
        // so the browser didn't dispatch the dragend event.
        //
        // We need to wait before we start listening for mousemove events.
        // This is needed because the drag preview needs to be drawn or else it fires an 'mousemove' event
        // immediately in some browsers.
        //
        // See:
        //   * https://github.com/react-dnd/react-dnd/pull/928
        //   * https://github.com/react-dnd/react-dnd/issues/869
        //
        this.mouseMoveTimeoutTimer = setTimeout(function () {
            _this.mouseMoveTimeoutId = null;
            return (_this.window &&
                _this.window.addEventListener('mousemove', _this.endDragIfSourceWasRemovedFromDOM, true));
        }, MOUSE_MOVE_TIMEOUT);
    };
    HTML5Backend.prototype.clearCurrentDragSourceNode = function () {
        if (this.currentDragSourceNode) {
            this.currentDragSourceNode = null;
            this.currentDragSourceNodeOffset = null;
            this.currentDragSourceNodeOffsetChanged = false;
            if (this.window) {
                this.window.clearTimeout(this.mouseMoveTimeoutTimer);
                this.window.removeEventListener('mousemove', this.endDragIfSourceWasRemovedFromDOM, true);
            }
            this.mouseMoveTimeoutTimer = null;
            return true;
        }
        return false;
    };
    HTML5Backend.prototype.checkIfCurrentDragSourceRectChanged = function () {
        var node = this.currentDragSourceNode;
        if (!node) {
            return false;
        }
        if (this.currentDragSourceNodeOffsetChanged) {
            return true;
        }
        this.currentDragSourceNodeOffsetChanged = !shallowEqual(OffsetUtils_1.getNodeClientOffset(node), this.currentDragSourceNodeOffset);
        return this.currentDragSourceNodeOffsetChanged;
    };
    HTML5Backend.prototype.handleTopDragStartCapture = function () {
        this.clearCurrentDragSourceNode();
        this.dragStartSourceIds = [];
    };
    HTML5Backend.prototype.handleDragStart = function (e, sourceId) {
        if (!this.dragStartSourceIds) {
            this.dragStartSourceIds = [];
        }
        this.dragStartSourceIds.unshift(sourceId);
    };
    HTML5Backend.prototype.handleTopDragStart = function (e) {
        var _this = this;
        var dragStartSourceIds = this.dragStartSourceIds;
        this.dragStartSourceIds = null;
        var clientOffset = OffsetUtils_1.getEventClientOffset(e);
        // Avoid crashing if we missed a drop event or our previous drag died
        if (this.monitor.isDragging()) {
            this.actions.endDrag();
        }
        // Don't publish the source just yet (see why below)
        this.actions.beginDrag(dragStartSourceIds || [], {
            publishSource: false,
            getSourceClientOffset: this.getSourceClientOffset,
            clientOffset: clientOffset,
        });
        var dataTransfer = e.dataTransfer;
        var nativeType = NativeDragSources_1.matchNativeItemType(dataTransfer);
        if (this.monitor.isDragging()) {
            if (typeof dataTransfer.setDragImage === 'function') {
                // Use custom drag image if user specifies it.
                // If child drag source refuses drag but parent agrees,
                // use parent's node as drag image. Neither works in IE though.
                var sourceId = this.monitor.getSourceId();
                var sourceNode = this.sourceNodes[sourceId];
                var dragPreview = this.sourcePreviewNodes[sourceId] || sourceNode;
                var _a = this.getCurrentSourcePreviewNodeOptions(), anchorX = _a.anchorX, anchorY = _a.anchorY, offsetX = _a.offsetX, offsetY = _a.offsetY;
                var anchorPoint = { anchorX: anchorX, anchorY: anchorY };
                var offsetPoint = { offsetX: offsetX, offsetY: offsetY };
                var dragPreviewOffset = OffsetUtils_1.getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint);
                dataTransfer.setDragImage(dragPreview, dragPreviewOffset.x, dragPreviewOffset.y);
            }
            try {
                // Firefox won't drag without setting data
                dataTransfer.setData('application/json', {});
            }
            catch (err) {
                // IE doesn't support MIME types in setData
            }
            // Store drag source node so we can check whether
            // it is removed from DOM and trigger endDrag manually.
            this.setCurrentDragSourceNode(e.target);
            // Now we are ready to publish the drag source.. or are we not?
            var captureDraggingState = this.getCurrentSourcePreviewNodeOptions().captureDraggingState;
            if (!captureDraggingState) {
                // Usually we want to publish it in the next tick so that browser
                // is able to screenshot the current (not yet dragging) state.
                //
                // It also neatly avoids a situation where render() returns null
                // in the same tick for the source element, and browser freaks out.
                setTimeout(function () { return _this.actions.publishDragSource(); }, 0);
            }
            else {
                // In some cases the user may want to override this behavior, e.g.
                // to work around IE not supporting custom drag previews.
                //
                // When using a custom drag layer, the only way to prevent
                // the default drag preview from drawing in IE is to screenshot
                // the dragging state in which the node itself has zero opacity
                // and height. In this case, though, returning null from render()
                // will abruptly end the dragging, which is not obvious.
                //
                // This is the reason such behavior is strictly opt-in.
                this.actions.publishDragSource();
            }
        }
        else if (nativeType) {
            // A native item (such as URL) dragged from inside the document
            this.beginDragNativeItem(nativeType);
        }
        else if (!dataTransfer.types &&
            (!e.target.hasAttribute || !e.target.hasAttribute('draggable'))) {
            // Looks like a Safari bug: dataTransfer.types is null, but there was no draggable.
            // Just let it drag. It's a native type (URL or text) and will be picked up in
            // dragenter handler.
            return; // eslint-disable-line no-useless-return
        }
        else {
            // If by this time no drag source reacted, tell browser not to drag.
            e.preventDefault();
        }
    };
    HTML5Backend.prototype.handleTopDragEndCapture = function () {
        if (this.clearCurrentDragSourceNode()) {
            // Firefox can dispatch this event in an infinite loop
            // if dragend handler does something like showing an alert.
            // Only proceed if we have not handled it already.
            this.actions.endDrag();
        }
    };
    HTML5Backend.prototype.handleTopDragEnterCapture = function (e) {
        this.dragEnterTargetIds = [];
        var isFirstEnter = this.enterLeaveCounter.enter(e.target);
        if (!isFirstEnter || this.monitor.isDragging()) {
            return;
        }
        var dataTransfer = e.dataTransfer;
        var nativeType = NativeDragSources_1.matchNativeItemType(dataTransfer);
        if (nativeType) {
            // A native item (such as file or URL) dragged from outside the document
            this.beginDragNativeItem(nativeType);
        }
    };
    HTML5Backend.prototype.handleDragEnter = function (e, targetId) {
        this.dragEnterTargetIds.unshift(targetId);
    };
    HTML5Backend.prototype.handleTopDragEnter = function (e) {
        var _this = this;
        var dragEnterTargetIds = this.dragEnterTargetIds;
        this.dragEnterTargetIds = [];
        if (!this.monitor.isDragging()) {
            // This is probably a native item type we don't understand.
            return;
        }
        this.altKeyPressed = e.altKey;
        if (!BrowserDetector_1.isFirefox()) {
            // Don't emit hover in `dragenter` on Firefox due to an edge case.
            // If the target changes position as the result of `dragenter`, Firefox
            // will still happily dispatch `dragover` despite target being no longer
            // there. The easy solution is to only fire `hover` in `dragover` on FF.
            this.actions.hover(dragEnterTargetIds, {
                clientOffset: OffsetUtils_1.getEventClientOffset(e),
            });
        }
        var canDrop = dragEnterTargetIds.some(function (targetId) {
            return _this.monitor.canDropOnTarget(targetId);
        });
        if (canDrop) {
            // IE requires this to fire dragover events
            e.preventDefault();
            e.dataTransfer.dropEffect = this.getCurrentDropEffect();
        }
    };
    HTML5Backend.prototype.handleTopDragOverCapture = function () {
        this.dragOverTargetIds = [];
    };
    HTML5Backend.prototype.handleDragOver = function (e, targetId) {
        if (this.dragOverTargetIds === null) {
            this.dragOverTargetIds = [];
        }
        this.dragOverTargetIds.unshift(targetId);
    };
    HTML5Backend.prototype.handleTopDragOver = function (e) {
        var _this = this;
        var dragOverTargetIds = this.dragOverTargetIds;
        this.dragOverTargetIds = [];
        if (!this.monitor.isDragging()) {
            // This is probably a native item type we don't understand.
            // Prevent default "drop and blow away the whole document" action.
            e.preventDefault();
            e.dataTransfer.dropEffect = 'none';
            return;
        }
        this.altKeyPressed = e.altKey;
        this.actions.hover(dragOverTargetIds || [], {
            clientOffset: OffsetUtils_1.getEventClientOffset(e),
        });
        var canDrop = (dragOverTargetIds || []).some(function (targetId) {
            return _this.monitor.canDropOnTarget(targetId);
        });
        if (canDrop) {
            // Show user-specified drop effect.
            e.preventDefault();
            e.dataTransfer.dropEffect = this.getCurrentDropEffect();
        }
        else if (this.isDraggingNativeItem()) {
            // Don't show a nice cursor but still prevent default
            // "drop and blow away the whole document" action.
            e.preventDefault();
            e.dataTransfer.dropEffect = 'none';
        }
        else if (this.checkIfCurrentDragSourceRectChanged()) {
            // Prevent animating to incorrect position.
            // Drop effect must be other than 'none' to prevent animation.
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    };
    HTML5Backend.prototype.handleTopDragLeaveCapture = function (e) {
        if (this.isDraggingNativeItem()) {
            e.preventDefault();
        }
        var isLastLeave = this.enterLeaveCounter.leave(e.target);
        if (!isLastLeave) {
            return;
        }
        if (this.isDraggingNativeItem()) {
            this.endDragNativeItem();
        }
    };
    HTML5Backend.prototype.handleTopDropCapture = function (e) {
        this.dropTargetIds = [];
        e.preventDefault();
        if (this.isDraggingNativeItem()) {
            this.currentNativeSource.mutateItemByReadingDataTransfer(e.dataTransfer);
        }
        this.enterLeaveCounter.reset();
    };
    HTML5Backend.prototype.handleDrop = function (e, targetId) {
        this.dropTargetIds.unshift(targetId);
    };
    HTML5Backend.prototype.handleTopDrop = function (e) {
        var dropTargetIds = this.dropTargetIds;
        this.dropTargetIds = [];
        this.actions.hover(dropTargetIds, {
            clientOffset: OffsetUtils_1.getEventClientOffset(e),
        });
        this.actions.drop({ dropEffect: this.getCurrentDropEffect() });
        if (this.isDraggingNativeItem()) {
            this.endDragNativeItem();
        }
        else {
            this.endDragIfSourceWasRemovedFromDOM();
        }
    };
    HTML5Backend.prototype.handleSelectStart = function (e) {
        var target = e.target;
        // Only IE requires us to explicitly say
        // we want drag drop operation to start
        if (typeof target.dragDrop !== 'function') {
            return;
        }
        // Inputs and textareas should be selectable
        if (target.tagName === 'INPUT' ||
            target.tagName === 'SELECT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable) {
            return;
        }
        // For other targets, ask IE
        // to enable drag and drop
        e.preventDefault();
        target.dragDrop();
    };
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "getSourceClientOffset", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "asyncEndDragNativeItem", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "endDragNativeItem", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "isNodeInDocument", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "endDragIfSourceWasRemovedFromDOM", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragStartCapture", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragStart", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragEndCapture", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragEnterCapture", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragEnter", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragOverCapture", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragOver", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDragLeaveCapture", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDropCapture", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleTopDrop", null);
    __decorate([
        autobind_decorator_1.default
    ], HTML5Backend.prototype, "handleSelectStart", null);
    return HTML5Backend;
}());
exports["default"] = HTML5Backend;
//# sourceMappingURL=HTML5Backend.js.map

/***/ },

/***/ 9770
/*!*********************************************!*\
  !*** ./node_modules/lodash/_arrayFilter.js ***!
  \*********************************************/
(module) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ },

/***/ 9790
/*!******************************************************!*\
  !*** ./node_modules/react-transition-group/index.js ***!
  \******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _CSSTransition = _interopRequireDefault(__webpack_require__(/*! ./CSSTransition */ 8514));

var _ReplaceTransition = _interopRequireDefault(__webpack_require__(/*! ./ReplaceTransition */ 1369));

var _TransitionGroup = _interopRequireDefault(__webpack_require__(/*! ./TransitionGroup */ 2312));

var _Transition = _interopRequireDefault(__webpack_require__(/*! ./Transition */ 495));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  Transition: _Transition.default,
  TransitionGroup: _TransitionGroup.default,
  ReplaceTransition: _ReplaceTransition.default,
  CSSTransition: _CSSTransition.default
};

/***/ },

/***/ 9795
/*!******************************************!*\
  !*** ./node_modules/asap/browser-raw.js ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js


/***/ },

/***/ 9817
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackHas.js ***!
  \******************************************/
(module) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ },

/***/ 9870
/*!*************************************!*\
  !*** ./node_modules/lodash/flow.js ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var createFlow = __webpack_require__(/*! ./_createFlow */ 6929);

/**
 * Creates a function that returns the result of invoking the given functions
 * with the `this` binding of the created function, where each successive
 * invocation is supplied the return value of the previous.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {...(Function|Function[])} [funcs] The functions to invoke.
 * @returns {Function} Returns the new composite function.
 * @see _.flowRight
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var addSquare = _.flow([_.add, square]);
 * addSquare(1, 2);
 * // => 9
 */
var flow = createFlow();

module.exports = flow;


/***/ },

/***/ 9905
/*!***************************************************!*\
  !*** ./node_modules/lodash/_arrayIncludesWith.js ***!
  \***************************************************/
(module) {

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;


/***/ },

/***/ 9935
/*!******************************************!*\
  !*** ./node_modules/lodash/stubFalse.js ***!
  \******************************************/
(module) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ },

/***/ 9950
/*!*****************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/util/Terminate.scss ***!
  \*****************************************************************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ 1601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.terminate{position:fixed;z-index:1050}.terminate .backdrop{display:block;position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.8)}.terminate>.symbol{font-size:8em;color:#fff;opacity:.85;width:100%;height:100%;position:fixed;display:flex;justify-content:center;align-items:center}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************************************************!*\
  !*** ./src/components/editor/editorRoot.js + 39 modules ***!
  \**********************************************************/

// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(1594);
var external_React_default = /*#__PURE__*/__webpack_require__.n(external_React_);
// EXTERNAL MODULE: external "ReactDOM"
var external_ReactDOM_ = __webpack_require__(5206);
var external_ReactDOM_default = /*#__PURE__*/__webpack_require__.n(external_ReactDOM_);
;// ./src/lib/l10n.js
let map = {};
function register(ids) {
  for (const id of ids) {
    map[id] = true;
  }
}
function mapToLocal() {
  map = getMessages(Object.keys(map));
}
const get = chrome.i18n.getMessage;
function getMessages(ids) {
  const result = {};
  for (const id of ids) {
    result[id] = chrome.i18n.getMessage(id);
  }
  return result;
}
function set(ids) {
  register(ids);
  mapToLocal();
}
function getLanguage() {
  return chrome.i18n.getUILanguage();
}
function localizeDateTime(date, options = {}) {
  return date.toLocaleDateString(getLanguage(), options);
}
;// ./src/lib/constants.js
/* constants */

// min height for large frame
const LARGE_FRAME = 600;
// frame constants
const FRAME_STATUS = 'mveloFrame';
// frame status
const FRAME_ATTACHED = 'att';
const FRAME_DETACHED = 'det';
// armor header type
const PGP_MESSAGE = 'msg';
const PGP_SIGNATURE = 'sig';
const PGP_PUBLIC_KEY = 'pub';
const PGP_PRIVATE_KEY = 'priv';
// key status
const PGP_KEYSTATUS_VALID = 3;
// display decrypted message
const DISPLAY_INLINE = 'inline';
const DISPLAY_POPUP = 'popup';
// editor type
const PLAIN_TEXT = 'plain';
// keyring
const KEYRING_DELIMITER = '|#|';
const MAIN_KEYRING_ID = (/* unused pure expression or super */ null && (`localhost${KEYRING_DELIMITER}mailvelope`));
const GNUPG_KEYRING_ID = (/* unused pure expression or super */ null && (`localhost${KEYRING_DELIMITER}gnupg`));
// colors for secure background
const SECURE_COLORS = ['#e9e9e9', '#c0c0c0', '#808080', '#ffce1e', '#ff0000', '#85154a', '#6f2b8b', '#b3d1e3', '#315bab', '#1c449b', '#4c759c', '#1e8e9f', '#93b536'];
// 50 MB file size limit
const MAX_FILE_UPLOAD_SIZE = 50 * 1024 * 1024;
// stable id if app runs in top frame
const APP_TOP_FRAME_ID = 'apptopframeid';
// status of PGP key or user
const KEY_STATUS = {
  invalid: 0,
  expired: 1,
  revoked: 2,
  valid: 3,
  no_self_cert: 4
};
;// ./src/res/common.json
const common_namespaceObject = /*#__PURE__*/JSON.parse('{"J":{"petrol":{"bg":"#caebdd","icon":"#85c9af"},"corn":{"bg":"#faebae","icon":"#e3d18b"},"salmon":{"bg":"#f7cab5","icon":"#e0a98e"},"lavender":{"bg":"#d9caeb","icon":"#baa7d9"},"sky":{"bg":"#cadaeb","icon":"#90b5da"}}}');
;// ./src/lib/svg-file-parser.js
async function parseSVG(url) {
  const extUrl = chrome.runtime.getURL(url);
  const svg = await loadFile(extUrl);
  const parser = new DOMParser();
  return parser.parseFromString(svg, 'image/svg+xml');
}
async function loadFile(url) {
  const response = await fetch(url);
  const data = await response.text();
  if (response.ok) {
    return data;
  } else {
    return Promise.reject({
      status: response.status,
      statusText: response.statusText,
      err: data
    });
  }
}
;// ./src/lib/util.js
/**
 * Copyright (C) 2019 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */




class MvError extends Error {
  constructor(msg, code = 'INTERNAL_ERROR') {
    super(msg);
    this.code = code;
  }
}
function sortAndDeDup(unordered, compFn) {
  const result = [];
  const sorted = unordered.sort(compFn);
  // remove duplicates
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0 || compFn && compFn(sorted[i - 1], sorted[i]) !== 0 || !compFn && sorted[i - 1] !== sorted[i]) {
      result.push(sorted[i]);
    }
  }
  return result;
}

/**
 * Remove duplicates from list, by default compares items as strings
 * @param  {Array} list - the list of items with duplicates
 * @param {Function} [compFn] compare function that gets element that should be added to result list plus the current result list
 *                            must return true if element should be added to the result list
 * @return {Array} - the list of items without duplicates
 */
function deDup(list = [], compFn = (element, array) => array.indexOf(element) === -1) {
  const result = [];
  for (const item of list) {
    if (compFn(item, result)) {
      result.push(item);
    }
  }
  return result;
}
async function filterAsync(array, asyncFilterFn) {
  const promises = array.map(async item => (await asyncFilterFn(item)) && item);
  const result = await Promise.all(promises);
  return result.filter(item => item);
}
async function someAsync(array, asyncSomeFn) {
  const promises = array.map(asyncSomeFn);
  const result = await Promise.all(promises);
  return result.some(item => item);
}
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function getUUID() {
  if (crypto.randomUUID) {
    return crypto.randomUUID().replaceAll('-', '');
  } else {
    let result = '';
    const buf = new Uint16Array(8);
    crypto.getRandomValues(buf);
    for (let i = 0; i < buf.length; i++) {
      result += buf[i].toString(16);
    }
    return result;
  }
}
function encodeHTML(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/\//g, '&#x2F;');
}
function decodeHTML(html) {
  return String(html).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "\'").replace(/&#x2F;/g, '\/');
}
function parseHTML(html) {
  const htmlDoc = new DOMParser().parseFromString(html, 'text/html');
  return htmlDoc.body.childNodes;
}
function decodeQuotedPrint(armored) {
  return armored.replace(/=3D=3D\s*$/m, '==').replace(/=3D\s*$/m, '=').replace(/=3D(\S{4})\s*$/m, '=$1');
}

/**
 * Encode UTF-8 string
 * @param  {String} str
 * @return {Uint8Array}
 */
function encodeUtf8(str) {
  const encoder = new TextEncoder('utf-8');
  return encoder.encode(str);
}

/**
 * Normalize PGP armored message
 * @param  {String} msg
 * @param  {Regex} typeRegex - filter message with this Regex
 * @return {String}
 */
function normalizeArmored(msg, typeRegex) {
  // filtering to get well defined PGP message format
  msg = msg.replace(/\r\n/g, '\n'); // unify new line characters
  msg = msg.replace(/\n\s+/g, '\n'); // compress sequence of whitespace and new line characters to one new line
  msg = msg.replace(/[^\S\r\n]/g, ' '); // unify white space characters (all \s without \r and \n)
  if (typeRegex) {
    msg = msg.match(typeRegex);
    if (msg) {
      msg = msg[0];
    } else {
      throw new MvError('Could not extract valid PGP message', 'INVALID_ARMORED_BLOCK');
    }
  }
  msg = msg.replace(/^(\s?>)+/gm, ''); // remove quotation
  msg = msg.replace(/^\s+/gm, ''); // remove leading whitespace
  msg = msg.replace(/:.*\n(?!.*:)/, '$&\n'); // insert new line after last armor header
  msg = msg.replace(/-----\n(?!.*:)/, '$&\n'); // insert new line if no header
  msg = decodeQuotedPrint(msg);
  return msg;
}
function html2text(html) {
  html = html.replace(/\n/g, ' '); // replace new line with space
  html = html.replace(/(<br>)/g, '\n'); // replace <br> with new line
  html = html.replace(/<\/(blockquote|div|dl|dt|dd|form|h1|h2|h3|h4|h5|h6|hr|ol|p|pre|table|tr|td|ul|li|section|header|footer)>/g, '\n'); // replace block closing tags </..> with new line
  html = html.replace(/<(.+?)>/g, ''); // remove tags
  html = html.replace(/&nbsp;/g, ' '); // replace non-breaking space with whitespace
  html = html.replace(/\n{3,}/g, '\n\n'); // compress new line
  return decodeHTML(html);
}

/**
 * This function will return the byte size of any UTF-8 string you pass to it.
 * @param {string} str
 * @returns {number}
 */
function byteCount(str) {
  return encodeURI(str).split(/%..|./).length - 1;
}
function ab2str(buf) {
  const ab = new Uint8Array(buf);
  return Uint8Array2str(ab);
}
function Uint8Array2str(ab) {
  let str = '';
  const CHUNK_SIZE = Math.pow(2, 15);
  let offset;
  let len;
  let subab;
  for (offset = 0; offset < ab.length; offset += CHUNK_SIZE) {
    len = Math.min(CHUNK_SIZE, ab.length - offset);
    subab = ab.subarray(offset, offset + len);
    str += String.fromCharCode.apply(null, subab);
  }
  return str;
}
function str2ab(str) {
  const bufView = str2Uint8Array(str);
  return bufView.buffer;
}
function str2Uint8Array(str) {
  const bufView = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}
function str2bool(value) {
  if (value && typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true;
    }
    if (value.toLowerCase() === 'false') {
      return false;
    }
  }
  return value;
}
function ab2hex(ab) {
  return Array.from(new Uint8Array(ab)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function base64EncodeUrl(str) {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}
function base64DecodeUrl(str) {
  str = `${str}===`.slice(0, str.length + str.length % 4);
  return str.replace(/-/g, '+').replace(/_/g, '/');
}
function dataURL2str(dataURL) {
  const base64 = dataURL2base64(dataURL);
  return atob(base64);
}
function dataURL2base64(dataURL) {
  return dataURL.split(';base64,')[1];
}
function generateSecurityBackground({
  width,
  height,
  scaling = 1,
  angle = 0,
  colorId = 0
}) {
  const iconWidth = width * scaling;
  const iconHeight = height * scaling;
  const iconColor = SECURE_COLORS[colorId];
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" id="secBgnd" version="1.1" width="${iconWidth}px" height="${iconHeight}px" viewBox="0 0 27 27"><path transform="rotate(${angle} 14 14)" style="fill: ${iconColor};" d="m 13.963649,25.901754 c -4.6900005,0 -8.5000005,-3.78 -8.5000005,-8.44 0,-1.64 0.47,-3.17 1.29,-4.47 V 9.0417546 c 0,-3.9399992 3.23,-7.1499992 7.2000005,-7.1499992 3.97,0 7.2,3.21 7.2,7.1499992 v 3.9499994 c 0.82,1.3 1.3,2.83 1.3,4.48 0,4.65 -3.8,8.43 -8.49,8.43 z m -1.35,-7.99 v 3.33 h 0 c 0,0.02 0,0.03 0,0.05 0,0.74 0.61,1.34 1.35,1.34 0.75,0 1.35,-0.6 1.35,-1.34 0,-0.02 0,-0.03 0,-0.05 h 0 v -3.33 c 0.63,-0.43 1.04,-1.15 1.04,-1.97 0,-1.32 -1.07,-2.38 -2.4,-2.38 -1.32,0 -2.4,1.07 -2.4,2.38 0.01,0.82 0.43,1.54 1.06,1.97 z m 6.29,-8.8699994 c 0,-2.7099992 -2.22,-4.9099992 -4.95,-4.9099992 -2.73,0 -4.9500005,2.2 -4.9500005,4.9099992 V 10.611754 C 10.393649,9.6217544 12.103649,9.0317546 13.953649,9.0317546 c 1.85,0 3.55,0.5899998 4.94,1.5799994 l 0.01,-1.5699994 z" /></svg>`;
}
async function getSecurityBackground(port) {
  const background = await port.send('get-security-background');
  const image = background.bgIcon ? (await generateSecurityBGSVG(background)).outerHTML : generateSecurityBackground(background);
  const color = background.bgColor ? common_namespaceObject.J[background.bgColor].bg : background.color;
  return {
    image: `url(data:image/svg+xml;base64,${btoa(image)})`,
    color
  };
}
async function generateSecurityBGSVG({
  bgIcon,
  bgColor
}) {
  const svgTemplateUrl = 'img/security/template.svg';
  const {
    documentElement: svgTemplate
  } = await parseSVG(svgTemplateUrl);
  const tileWidth = 640;
  svgTemplate.setAttribute('width', tileWidth);
  svgTemplate.getElementById('template').setAttribute('fill', common_namespaceObject.J[bgColor].icon);
  const svgBgIconUrl = `img/security/${bgIcon}.svg`;
  const {
    documentElement: svgBgIcon
  } = await parseSVG(svgBgIconUrl);
  const paths = svgBgIcon.getElementsByTagName('path');
  for (const path of paths) {
    path.style.fill = common_namespaceObject.J[bgColor].icon;
  }
  const placeholders = svgTemplate.querySelectorAll('.icon');
  for (const placeholderElem of placeholders) {
    const gElem = placeholderElem.querySelector('g:last-child');
    gElem.firstElementChild.remove();
    const clonedSvgBgIcon = svgBgIcon.cloneNode(true);
    while (clonedSvgBgIcon.childNodes.length > 0) {
      gElem.appendChild(clonedSvgBgIcon.childNodes[0]);
    }
  }
  return svgTemplate;
}
function matchPattern2RegEx(matchPattern) {
  return new RegExp(`^${matchPattern2RegExString(matchPattern)}$`);
}
function matchPattern2RegExString(matchPattern) {
  return matchPattern.replace(/\./g, '\\.').replace(/^\*\\\./, '(\\w+(-\\w+)*\\.)*');
}
function mapError(error = {}) {
  return {
    message: error.message || 'Unexpected error.',
    code: error.code || 'INTERNAL_ERROR'
  };
}
class PromiseQueue {
  constructor() {
    this.queue = [];
  }
  push(thisArg, method, args) {
    const {
      promise,
      resolve,
      reject
    } = Promise.withResolvers();
    this.queue.push({
      promise,
      resolve,
      reject,
      thisArg,
      method,
      args
    });
    if (this.queue.length === 1) {
      this._next();
    }
    return promise;
  }
  _next() {
    if (this.queue.length === 0) {
      return;
    }
    const nextEntry = this.queue[0];
    setTimeout(() => {
      nextEntry.thisArg[nextEntry.method].apply(nextEntry.thisArg, nextEntry.args).then(result => {
        nextEntry.resolve(result);
      }).catch(error => {
        nextEntry.reject(error);
      }).then(() => {
        this.queue.shift();
        this._next();
      });
    }, 0);
  }
}

/**
 * Waterfall of async processes
 * @param  {Function} process - has to return Promise, result as array
 * @param  {Array} list - each item is processed
 * @return {Promise} - resolved when all processes finished with end result as array
 */
/* eslint-disable arrow-body-style */
function sequential(process, list) {
  return list.reduce((acc, item) => {
    return acc.then(result => {
      return process(item).then(processResult => {
        result.push(...processResult);
        return result;
      });
    });
  }, Promise.resolve([]));
}
/* eslint-enable arrow-body-style */

/**
 * Validate an email address.
 * @param  {String} address   The email address to validate
 * @return {Boolean}          True if valid, false if not
 */
function checkEmail(address) {
  const pattern = /^[+a-zA-Z0-9_.!#$%&'*\/=?^`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,63}$/;
  return pattern.test(address);
}

/**
 * Normalize parameter to Array. falsy -> []
 * @param  {Any}  param
 * @return {Array}
 */
function toArray(param) {
  if (!param) {
    return [];
  }
  if (!Array.isArray(param)) {
    return [param];
  }
  return param;
}

/**
 * Validate an url
 * @param  {String} url       The URL to validate
 * @return {Boolean}          True if valid, false if not
 */
function checkUrl(url) {
  const pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gi;
  return pattern.test(url);
}
function addDocumentTitle(text) {
  const title = document.createElement('title');
  title.appendChild(document.createTextNode(text));
  document.head.appendChild(title);
}
function formatFpr(fpr) {
  return fpr.toUpperCase().match(/.{1,4}/g).join(' ');
}
function isVisible(element) {
  return Boolean(element && (element.offsetWidth || element.offsetHeight || element.getClientRects().length));
}
function firstParent(element, selector) {
  while (element) {
    if (element.nodeType === Node.ELEMENT_NODE && element.matches(selector)) {
      return element;
    }
    element = element.parentNode;
  }
}
const brands = navigator && navigator.userAgentData && navigator.userAgentData.brands;
const brand = !brands ? {
  other: true
} : {
  chrome: brands.some(({
    brand
  }) => brand === 'Google Chrome'),
  edge: brands.some(({
    brand
  }) => brand === 'Microsoft Edge'),
  chromium: brands.some(({
    brand
  }) => brand === 'Chromium')
};
function parseViewName(viewName) {
  const pair = viewName.split('-');
  if (pair.length !== 2) {
    throw new Error('Invalid view name.');
  }
  return {
    type: pair[0],
    id: pair[1]
  };
}
// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(5556);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
;// ./node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

;// ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js + 3 modules
var defineProperty = __webpack_require__(4705);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(2485);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/react-transition-group/index.js
var react_transition_group = __webpack_require__(9790);
;// ./node_modules/reactstrap/es/utils.js
 // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/js/src/modal.js#L436-L443

function getScrollbarWidth() {
  var scrollDiv = document.createElement('div'); // .modal-scrollbar-measure styles // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/scss/_modal.scss#L106-L113

  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';
  scrollDiv.style.width = '50px';
  scrollDiv.style.height = '50px';
  scrollDiv.style.overflow = 'scroll';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}
function setScrollbarWidth(padding) {
  document.body.style.paddingRight = padding > 0 ? padding + "px" : null;
}
function isBodyOverflowing() {
  return document.body.clientWidth < window.innerWidth;
}
function getOriginalBodyPadding() {
  var style = window.getComputedStyle(document.body, null);
  return parseInt(style && style.getPropertyValue('padding-right') || 0, 10);
}
function conditionallyUpdateScrollbar() {
  var scrollbarWidth = getScrollbarWidth(); // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/js/src/modal.js#L433

  var fixedContent = document.querySelectorAll('.fixed-top, .fixed-bottom, .is-fixed, .sticky-top')[0];
  var bodyPadding = fixedContent ? parseInt(fixedContent.style.paddingRight || 0, 10) : 0;

  if (isBodyOverflowing()) {
    setScrollbarWidth(bodyPadding + scrollbarWidth);
  }
}
var globalCssModule;
function setGlobalCssModule(cssModule) {
  globalCssModule = cssModule;
}
function mapToCssModules(className, cssModule) {
  if (className === void 0) {
    className = '';
  }

  if (cssModule === void 0) {
    cssModule = globalCssModule;
  }

  if (!cssModule) return className;
  return className.split(' ').map(function (c) {
    return cssModule[c] || c;
  }).join(' ');
}
/**
 * Returns a new object with the key/value pairs from `obj` that are not in the array `omitKeys`.
 */

function omit(obj, omitKeys) {
  var result = {};
  Object.keys(obj).forEach(function (key) {
    if (omitKeys.indexOf(key) === -1) {
      result[key] = obj[key];
    }
  });
  return result;
}
/**
 * Returns a filtered copy of an object with only the specified keys.
 */

function pick(obj, keys) {
  var pickKeys = Array.isArray(keys) ? keys : [keys];
  var length = pickKeys.length;
  var key;
  var result = {};

  while (length > 0) {
    length -= 1;
    key = pickKeys[length];
    result[key] = obj[key];
  }

  return result;
}
var warned = {};
function warnOnce(message) {
  if (!warned[message]) {
    /* istanbul ignore else */
    if (typeof console !== 'undefined') {
      console.error(message); // eslint-disable-line no-console
    }

    warned[message] = true;
  }
}
function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] !== null && typeof props[propName] !== 'undefined') {
      warnOnce("\"" + propName + "\" property of \"" + componentName + "\" has been deprecated.\n" + explanation);
    }

    for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }

    return propType.apply(void 0, [props, propName, componentName].concat(rest));
  };
} // Shim Element if needed (e.g. in Node environment)

var Element = typeof window === 'object' && window.Element || function () {};

function DOMElement(props, propName, componentName) {
  if (!(props[propName] instanceof Element)) {
    return new Error('Invalid prop `' + propName + '` supplied to `' + componentName + '`. Expected prop to be an instance of Element. Validation failed.');
  }
}
var targetPropType = prop_types_default().oneOfType([(prop_types_default()).string, (prop_types_default()).func, DOMElement, prop_types_default().shape({
  current: (prop_types_default()).any
})]);
var tagPropType = prop_types_default().oneOfType([(prop_types_default()).func, (prop_types_default()).string, prop_types_default().shape({
  $$typeof: (prop_types_default()).symbol,
  render: (prop_types_default()).func
}), prop_types_default().arrayOf(prop_types_default().oneOfType([(prop_types_default()).func, (prop_types_default()).string, prop_types_default().shape({
  $$typeof: (prop_types_default()).symbol,
  render: (prop_types_default()).func
})]))]);
/* eslint key-spacing: ["error", { afterColon: true, align: "value" }] */
// These are all setup to match what is in the bootstrap _variables.scss
// https://github.com/twbs/bootstrap/blob/v4-dev/scss/_variables.scss

var TransitionTimeouts = {
  Fade: 150,
  // $transition-fade
  Collapse: 350,
  // $transition-collapse
  Modal: 300,
  // $modal-transition
  Carousel: 600 // $carousel-transition

}; // Duplicated Transition.propType keys to ensure that Reactstrap builds
// for distribution properly exclude these keys for nested child HTML attributes
// since `react-transition-group` removes propTypes in production builds.

var TransitionPropTypeKeys = ['in', 'mountOnEnter', 'unmountOnExit', 'appear', 'enter', 'exit', 'timeout', 'onEnter', 'onEntering', 'onEntered', 'onExit', 'onExiting', 'onExited'];
var TransitionStatuses = {
  ENTERING: 'entering',
  ENTERED: 'entered',
  EXITING: 'exiting',
  EXITED: 'exited'
};
var keyCodes = {
  esc: 27,
  space: 32,
  enter: 13,
  tab: 9,
  up: 38,
  down: 40,
  home: 36,
  end: 35,
  n: 78,
  p: 80
};
var PopperPlacements = (/* unused pure expression or super */ null && (['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start']));
var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
function isReactRefObj(target) {
  if (target && typeof target === 'object') {
    return 'current' in target;
  }

  return false;
}

function getTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }

  return Object.prototype.toString.call(value);
}

function toNumber(value) {
  var type = typeof value;
  var NAN = 0 / 0;

  if (type === 'number') {
    return value;
  }

  if (type === 'symbol' || type === 'object' && getTag(value) === '[object Symbol]') {
    return NAN;
  }

  if (isObject(value)) {
    var other = typeof value.valueOf === 'function' ? value.valueOf() : value;
    value = isObject(other) ? "" + other : other;
  }

  if (type !== 'string') {
    return value === 0 ? value : +value;
  }

  value = value.replace(/^\s+|\s+$/g, '');
  var isBinary = /^0b[01]+$/i.test(value);
  return isBinary || /^0o[0-7]+$/i.test(value) ? parseInt(value.slice(2), isBinary ? 2 : 8) : /^[-+]0x[0-9a-f]+$/i.test(value) ? NAN : +value;
}
function isObject(value) {
  var type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }

  var tag = getTag(value);
  return tag === '[object Function]' || tag === '[object AsyncFunction]' || tag === '[object GeneratorFunction]' || tag === '[object Proxy]';
}
function findDOMElements(target) {
  if (isReactRefObj(target)) {
    return target.current;
  }

  if (isFunction(target)) {
    return target();
  }

  if (typeof target === 'string' && canUseDOM) {
    var selection = document.querySelectorAll(target);

    if (!selection.length) {
      selection = document.querySelectorAll("#" + target);
    }

    if (!selection.length) {
      throw new Error("The target '" + target + "' could not be identified in the dom, tip: check spelling");
    }

    return selection;
  }

  return target;
}
function isArrayOrNodeList(els) {
  if (els === null) {
    return false;
  }

  return Array.isArray(els) || canUseDOM && typeof els.length === 'number';
}
function getTarget(target, allElements) {
  var els = findDOMElements(target);

  if (allElements) {
    if (isArrayOrNodeList(els)) {
      return els;
    }

    if (els === null) {
      return [];
    }

    return [els];
  } else {
    if (isArrayOrNodeList(els)) {
      return els[0];
    }

    return els;
  }
}
var defaultToggleEvents = (/* unused pure expression or super */ null && (['touchstart', 'click']));
function addMultipleEventListeners(_els, handler, _events, useCapture) {
  var els = _els;

  if (!isArrayOrNodeList(els)) {
    els = [els];
  }

  var events = _events;

  if (typeof events === 'string') {
    events = events.split(/\s+/);
  }

  if (!isArrayOrNodeList(els) || typeof handler !== 'function' || !Array.isArray(events)) {
    throw new Error("\n      The first argument of this function must be DOM node or an array on DOM nodes or NodeList.\n      The second must be a function.\n      The third is a string or an array of strings that represents DOM events\n    ");
  }

  Array.prototype.forEach.call(events, function (event) {
    Array.prototype.forEach.call(els, function (el) {
      el.addEventListener(event, handler, useCapture);
    });
  });
  return function removeEvents() {
    Array.prototype.forEach.call(events, function (event) {
      Array.prototype.forEach.call(els, function (el) {
        el.removeEventListener(event, handler, useCapture);
      });
    });
  };
}
var focusableElements = (/* unused pure expression or super */ null && (['a[href]', 'area[href]', 'input:not([disabled]):not([type=hidden])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'object', 'embed', '[tabindex]:not(.modal)', 'audio[controls]', 'video[controls]', '[contenteditable]:not([contenteditable="false"])']));
;// ./node_modules/reactstrap/es/Fade.js



var _excluded = ["tag", "baseClass", "baseClassActive", "className", "cssModule", "children", "innerRef"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0,defineProperty/* default */.A)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }







var propTypes = _objectSpread(_objectSpread({}, react_transition_group.Transition.propTypes), {}, {
  children: prop_types_default().oneOfType([prop_types_default().arrayOf((prop_types_default()).node), (prop_types_default()).node]),
  tag: tagPropType,
  baseClass: (prop_types_default()).string,
  baseClassActive: (prop_types_default()).string,
  className: (prop_types_default()).string,
  cssModule: (prop_types_default()).object,
  innerRef: prop_types_default().oneOfType([(prop_types_default()).object, (prop_types_default()).string, (prop_types_default()).func])
});

var defaultProps = _objectSpread(_objectSpread({}, react_transition_group.Transition.defaultProps), {}, {
  tag: 'div',
  baseClass: 'fade',
  baseClassActive: 'show',
  timeout: TransitionTimeouts.Fade,
  appear: true,
  enter: true,
  exit: true,
  in: true
});

function Fade(props) {
  var Tag = props.tag,
      baseClass = props.baseClass,
      baseClassActive = props.baseClassActive,
      className = props.className,
      cssModule = props.cssModule,
      children = props.children,
      innerRef = props.innerRef,
      otherProps = _objectWithoutPropertiesLoose(props, _excluded);

  var transitionProps = pick(otherProps, TransitionPropTypeKeys);
  var childProps = omit(otherProps, TransitionPropTypeKeys);
  return /*#__PURE__*/external_React_default().createElement(react_transition_group.Transition, transitionProps, function (status) {
    var isActive = status === 'entered';
    var classes = mapToCssModules(classnames_default()(className, baseClass, isActive && baseClassActive), cssModule);
    return /*#__PURE__*/external_React_default().createElement(Tag, _extends({
      className: classes
    }, childProps, {
      ref: innerRef
    }), children);
  });
}

Fade.propTypes = propTypes;
Fade.defaultProps = defaultProps;
/* harmony default export */ const es_Fade = (Fade);
;// ./src/lib/EventHandler.js
/**
 * Copyright (C) 2016-2019 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */



/**
 * Event handler is an abstraction on top of Port to support methods 'on', 'emit' and 'send'.
 * @param {Port} port - port object received from runtime.connect()
 * @param {Map} handlers - handler map of parent event handler
 */
class EventHandler {
  #reply;
  #replyCount = 0;
  #uninstallListener = [];
  #uninstallInterval;
  #portName;
  #activePortMessages = true;
  #connectListener = [];
  #disconnectListener = [];
  constructor(port, handlers) {
    if (port) {
      this.initPort(port);
    }
    this._handlers = handlers || new Map();
    this._handlerObject = null;
  }

  /**
   * Open port to background script
   * @param  {String} sender identifier of sender (type + id)
   * @return {EventHandler}        initialized EventHandler
   */
  static connect(sender, handlerObject) {
    const eventHandler = new EventHandler(chrome.runtime.connect({
      name: sender
    }));
    eventHandler._handlerObject = handlerObject;
    chrome.runtime.onMessage.addListener(eventHandler.handleRuntimeMessage.bind(eventHandler));
    setTimeout(() => eventHandler.triggerConnectListener(), 0);
    return eventHandler;
  }
  activatePortMessages() {
    this.#activePortMessages = true;
  }
  deactivatePortMessages() {
    this.#activePortMessages = false;
  }
  #checkConnection() {
    if (this._port) {
      return;
    }
    const port = chrome.runtime.connect({
      name: this.#portName
    });
    this.initPort(port);
    this.triggerConnectListener();
  }
  handleRuntimeMessage(msg) {
    switch (msg.event) {
      case 'reconnect':
        this.#checkConnection();
        break;
    }
  }
  initPort(port) {
    this._port = port;
    this._port.onMessage.addListener(this.handlePortMessage.bind(this));
    this.#portName = port.name;
    if (this._port.onDisconnect) {
      this._port.onDisconnect.addListener(() => this.handleDisconnect());
      for (const listener of this.#disconnectListener) {
        this._port.onDisconnect.addListener(listener);
      }
    }
  }
  handleDisconnect() {
    this.clearPort();
    this.#reply?.forEach(({
      reject
    }) => reject({
      message: 'The Mailvelope service worker was shutdown after 30s of inactivity. Please try again.',
      code: 'INTERNAL_ERROR'
    }));
    this.#reply = null;
    this.#replyCount = 0;
  }
  clearPort() {
    this._port = null;
  }

  /**
   * Disconnect port
   */
  disconnect() {
    if (this._port) {
      this._port.disconnect();
    }
  }

  /**
   * We can detect an uninstall event if the field chrome.runtime.id is cleared
   */
  #checkUninstall() {
    if (chrome.runtime?.id) {
      return;
    }
    for (const listener of this.#uninstallListener) {
      listener();
    }
    clearInterval(this.#uninstallInterval);
  }
  get onDisconnect() {
    const obj = {};
    obj.addListener = listener => {
      this._port.onDisconnect.addListener(listener);
      this.#disconnectListener.push(listener);
    };
    return obj;
  }
  get onConnect() {
    const obj = {};
    obj.addListener = listener => this.#connectListener.push(listener);
    return obj;
  }
  triggerConnectListener() {
    this.#connectListener.forEach(listener => listener());
  }
  get onUninstall() {
    const obj = {};
    obj.addListener = listener => {
      this.#uninstallListener.push(listener);
      if (!this.#uninstallInterval) {
        this.#uninstallInterval = setInterval(() => this.#checkUninstall(), 2000);
      }
    };
    return obj;
  }

  /**
   * Generic port message handler that can be attached via port.onMessage.addListener().
   * Once set up, events can be handled with on('event', function(options) {})
   * @param  {String} options.event   The event descriptor
   * @param  {Object} options         Contains message attributes and data
   */
  handlePortMessage(options = {}) {
    if (!this.#activePortMessages) {
      return;
    }
    if (this._handlers.has(options.event)) {
      const handler = this._handlers.get(options.event);
      if (options._reply) {
        // sender expects reply
        Promise.resolve().then(() => handler.call(this, options)).then(result => this.emit('_reply', {
          result,
          _reply: options._reply
        })).catch(error => this.emit('_reply', {
          error: mapError(error),
          _reply: options._reply
        }));
      } else {
        // normal one way communication
        handler.call(this, options);
      }
    } else if (options.event === '_reply') {
      // we have received a reply
      const replyHandler = this.#reply.get(options._reply);
      this.#reply.delete(options._reply);
      if (options.error) {
        replyHandler.reject(options.error);
      } else {
        replyHandler.resolve(options.result);
      }
    } else {
      console.log('Unknown event', options);
    }
  }

  /**
   * The new event handling style to asign a function to an event.
   * @param  {String} event       The event descriptor
   * @param  {Function} handler   The event handler
   */
  on(event, handler) {
    if (!event || typeof event !== 'string' || event === '_reply' || typeof handler !== 'function') {
      throw new Error('Invalid event handler!');
    }
    this._handlers.set(event, handler.bind(this._handlerObject || this));
  }

  /**
   * Helper to emit events via postMessage using a port.
   * @param  {String} event     The event descriptor
   * @param  {Object} options   (optional) Data to be sent in the event
   */
  emit(event, options = {}) {
    if (!event || typeof event !== 'string') {
      throw new Error('Invalid event!');
    }
    this.#checkConnection();
    options.event = event;
    this._port.postMessage(options);
  }
  trigger(event, options = {}) {
    if (!event || typeof event !== 'string') {
      throw new Error('Invalid event!');
    }
    options.event = event;
    if (!this._handlers.has(options.event)) {
      throw new Error('Unknown event!');
    }
    const handler = this._handlers.get(options.event);
    handler.call(this, options);
  }

  /**
   * Like emit but receiver can send response
   * @param  {String} event     The event descriptor
   * @param  {Object} options   (optional) Data to be sent in the event
   * @param  {Object} port      (optional) The port to be used. If
   *                            not specified, the main port is used.
   * @return {Promise}
   */
  send(event, options = {}) {
    return new Promise((resolve, reject) => {
      if (!event || typeof event !== 'string') {
        return reject(new Error('Invalid event!'));
      }
      this.#checkConnection();
      if (!this.#reply) {
        this.#reply = new Map();
      }
      options.event = event;
      options._reply = ++this.#replyCount;
      this.#reply.set(options._reply, {
        resolve,
        reject
      });
      this._port.postMessage(options);
    });
  }
}
;// ./src/components/editor/components/PlainText.js
/**
 * Copyright (C) 2017 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */




class PlainText extends (external_React_default()).PureComponent {
  constructor(props) {
    super(props);
    this.sandbox = null;
    this.textarea = null;
  }
  componentDidUpdate(prevProps) {
    // if default value is set after rendering, set manually
    if (this.textarea && prevProps.defaultValue !== this.props.defaultValue) {
      this.textarea.value = this.props.defaultValue;
      this.textarea.selectionStart = 0;
      this.textarea.selectionEnd = 0;
    }
  }
  getValue() {
    return this.textarea.value;
  }
  createPlainText() {
    const textarea = /*#__PURE__*/external_React_default().createElement("textarea", {
      defaultValue: this.props.defaultValue,
      className: "form-control",
      rows: 12,
      autoFocus: true,
      onChange: event => this.props.onChange(event.target.value),
      onBlur: this.props.onBlur,
      onMouseUp: this.props.onMouseUp,
      ref: node => this.textarea = node,
      style: {
        width: '100%',
        height: '100%',
        marginBottom: 0,
        color: 'black',
        resize: 'none',
        lineHeight: 1.5
      }
    });
    const sandboxDoc = this.sandbox.contentDocument;
    const content = sandboxDoc.querySelector('#root');
    external_ReactDOM_default().render(textarea, content);
    this.props.onLoad && this.props.onLoad();
  }
  render() {
    const sandboxContent = `
      <!DOCTYPE html>
      <html style="height: 100%">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <link rel="stylesheet" href="../../main.css">
        </head>
        <body style="overflow: hidden; margin: 0; height: 100%; background-color: transparent">
         <div id="root" style="height: 100%; padding: 0.2rem">
         </div>
        </body>
      </html>
    `;
    return /*#__PURE__*/external_React_default().createElement("iframe", {
      sandbox: "allow-same-origin allow-scripts",
      srcDoc: sandboxContent,
      frameBorder: 0,
      style: {
        display: 'block',
        height: '100%',
        overflowY: 'hidden'
      },
      ref: node => this.sandbox = node,
      onLoad: () => this.createPlainText()
    });
  }
}
PlainText.propTypes = {
  defaultValue: (prop_types_default()).string,
  onChange: (prop_types_default()).func.isRequired,
  onBlur: (prop_types_default()).func,
  onMouseUp: (prop_types_default()).func,
  onLoad: (prop_types_default()).func
};
;// ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}

;// ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}

;// ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js

function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}

;// ./node_modules/reactstrap/es/Collapse.js





var Collapse_excluded = ["tag", "isOpen", "className", "navbar", "cssModule", "children", "innerRef"];

var _transitionStatusToCl;

function Collapse_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function Collapse_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { Collapse_ownKeys(Object(source), true).forEach(function (key) { (0,defineProperty/* default */.A)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { Collapse_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }







var Collapse_propTypes = Collapse_objectSpread(Collapse_objectSpread({}, react_transition_group.Transition.propTypes), {}, {
  isOpen: (prop_types_default()).bool,
  children: prop_types_default().oneOfType([prop_types_default().arrayOf((prop_types_default()).node), (prop_types_default()).node]),
  tag: tagPropType,
  className: (prop_types_default()).node,
  navbar: (prop_types_default()).bool,
  cssModule: (prop_types_default()).object,
  innerRef: prop_types_default().oneOfType([(prop_types_default()).func, (prop_types_default()).string, (prop_types_default()).object])
});

var Collapse_defaultProps = Collapse_objectSpread(Collapse_objectSpread({}, react_transition_group.Transition.defaultProps), {}, {
  isOpen: false,
  appear: false,
  enter: true,
  exit: true,
  tag: 'div',
  timeout: TransitionTimeouts.Collapse
});

var transitionStatusToClassHash = (_transitionStatusToCl = {}, _transitionStatusToCl[TransitionStatuses.ENTERING] = 'collapsing', _transitionStatusToCl[TransitionStatuses.ENTERED] = 'collapse show', _transitionStatusToCl[TransitionStatuses.EXITING] = 'collapsing', _transitionStatusToCl[TransitionStatuses.EXITED] = 'collapse', _transitionStatusToCl);

function getTransitionClass(status) {
  return transitionStatusToClassHash[status] || 'collapse';
}

function getHeight(node) {
  return node.scrollHeight;
}

var Collapse = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Collapse, _Component);

  function Collapse(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.state = {
      height: null
    };
    ['onEntering', 'onEntered', 'onExit', 'onExiting', 'onExited'].forEach(function (name) {
      _this[name] = _this[name].bind(_assertThisInitialized(_this));
    });
    return _this;
  }

  var _proto = Collapse.prototype;

  _proto.onEntering = function onEntering(node, isAppearing) {
    this.setState({
      height: getHeight(node)
    });
    this.props.onEntering(node, isAppearing);
  };

  _proto.onEntered = function onEntered(node, isAppearing) {
    this.setState({
      height: null
    });
    this.props.onEntered(node, isAppearing);
  };

  _proto.onExit = function onExit(node) {
    this.setState({
      height: getHeight(node)
    });
    this.props.onExit(node);
  };

  _proto.onExiting = function onExiting(node) {
    // getting this variable triggers a reflow
    var _unused = node.offsetHeight; // eslint-disable-line no-unused-vars

    this.setState({
      height: 0
    });
    this.props.onExiting(node);
  };

  _proto.onExited = function onExited(node) {
    this.setState({
      height: null
    });
    this.props.onExited(node);
  };

  _proto.render = function render() {
    var _this2 = this;

    var _this$props = this.props,
        Tag = _this$props.tag,
        isOpen = _this$props.isOpen,
        className = _this$props.className,
        navbar = _this$props.navbar,
        cssModule = _this$props.cssModule,
        children = _this$props.children,
        innerRef = _this$props.innerRef,
        otherProps = _objectWithoutPropertiesLoose(_this$props, Collapse_excluded);

    var height = this.state.height;
    var transitionProps = pick(otherProps, TransitionPropTypeKeys);
    var childProps = omit(otherProps, TransitionPropTypeKeys);
    return /*#__PURE__*/external_React_default().createElement(react_transition_group.Transition, _extends({}, transitionProps, {
      in: isOpen,
      onEntering: this.onEntering,
      onEntered: this.onEntered,
      onExit: this.onExit,
      onExiting: this.onExiting,
      onExited: this.onExited
    }), function (status) {
      var collapseClass = getTransitionClass(status);
      var classes = mapToCssModules(classnames_default()(className, collapseClass, navbar && 'navbar-collapse'), cssModule);
      var style = height === null ? null : {
        height: height
      };
      return /*#__PURE__*/external_React_default().createElement(Tag, _extends({}, childProps, {
        style: Collapse_objectSpread(Collapse_objectSpread({}, childProps.style), style),
        className: classes,
        ref: _this2.props.innerRef
      }), children);
    });
  };

  return Collapse;
}(external_React_.Component);

Collapse.propTypes = Collapse_propTypes;
Collapse.defaultProps = Collapse_defaultProps;
/* harmony default export */ const es_Collapse = (Collapse);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(5072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(7825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(7659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(5056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(1113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/editor/components/EditorModalFooter.scss
var EditorModalFooter = __webpack_require__(9213);
;// ./src/components/editor/components/EditorModalFooter.scss

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(EditorModalFooter/* default */.A, options);




       /* harmony default export */ const components_EditorModalFooter = (EditorModalFooter/* default */.A && EditorModalFooter/* default */.A.locals ? EditorModalFooter/* default */.A.locals : undefined);

;// ./src/components/editor/components/EditorModalFooter.js
/**
 * Copyright (C) 2016-2019 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */






register(['editor_encrypt_button', 'editor_extra_key_checkbox', 'editor_extra_key_help', 'editor_key_auto_sign', 'editor_key_auto_sign_link', 'editor_key_no_sign_option', 'editor_sign_button', 'form_cancel', 'form_submit', 'learn_more_link', 'options_home', 'sign_dialog_header']);
class EditorModalFooter_EditorModalFooter extends (external_React_default()).Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      collapse: true
    };
  }
  toggle() {
    this.setState(state => ({
      collapse: !state.collapse
    }));
  }
  render() {
    return /*#__PURE__*/external_React_default().createElement("div", {
      className: "d-flex flex-column w-100"
    }, /*#__PURE__*/external_React_default().createElement(es_Collapse, {
      id: "sign-msg-option",
      isOpen: !this.state.collapse
    }, /*#__PURE__*/external_React_default().createElement("form", {
      className: "mb-3"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "form-group row mb-3"
    }, /*#__PURE__*/external_React_default().createElement("label", {
      htmlFor: "signingKey",
      className: "col-sm-4 col-form-label"
    }, map.sign_dialog_header), /*#__PURE__*/external_React_default().createElement("div", {
      className: "col-sm-8"
    }, /*#__PURE__*/external_React_default().createElement("select", {
      id: "signingKey",
      className: "custom-select form-control",
      value: this.props.signMsg ? this.props.signKey : 'nosign',
      onChange: event => this.props.onChangeSignKey(event.target.value)
    }, /*#__PURE__*/external_React_default().createElement("option", {
      value: "nosign"
    }, map.editor_key_no_sign_option), this.props.privKeys.map(key => /*#__PURE__*/external_React_default().createElement("option", {
      value: key.fingerprint,
      key: key.fingerprint
    }, `${key.userId} - ${key.keyId}`))), /*#__PURE__*/external_React_default().createElement("small", {
      className: "form-text text-muted"
    }, /*#__PURE__*/external_React_default().createElement("span", null, map.editor_key_auto_sign), " ", /*#__PURE__*/external_React_default().createElement("a", {
      role: "button",
      href: "#",
      onClick: this.props.onClickSignSetting
    }, map.editor_key_auto_sign_link)))), /*#__PURE__*/external_React_default().createElement("div", {
      className: "form-group row mb-2"
    }, /*#__PURE__*/external_React_default().createElement("label", {
      htmlFor: "extraKeyInput",
      className: "col-sm-4 col-form-label"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "custom-control custom-checkbox"
    }, /*#__PURE__*/external_React_default().createElement("input", {
      className: "custom-control-input",
      type: "checkbox",
      id: "extraKeyCheck",
      name: "extraKey",
      checked: this.props.extraKey,
      onChange: this.props.onExtraKey
    }), /*#__PURE__*/external_React_default().createElement("label", {
      className: "custom-control-label",
      htmlFor: "extraKeyCheck"
    }, /*#__PURE__*/external_React_default().createElement("span", null, map.editor_extra_key_checkbox)))), this.props.extraKey && /*#__PURE__*/external_React_default().createElement("div", {
      id: "extraKeyInput",
      className: "col-sm-8"
    }, this.props.extraKeyInput, /*#__PURE__*/external_React_default().createElement("small", {
      className: "form-text text-muted"
    }, /*#__PURE__*/external_React_default().createElement("span", null, map.editor_extra_key_help), ". ", /*#__PURE__*/external_React_default().createElement("a", {
      href: "https://www.mailvelope.com/faq#editor_extra_key",
      target: "_blank",
      rel: "noopener noreferrer"
    }, map.learn_more_link)))))), /*#__PURE__*/external_React_default().createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/external_React_default().createElement("button", {
      type: "button",
      onClick: this.toggle,
      "aria-controls": "sign-msg-option",
      "data-target": "#sign-msg-option",
      className: `btn btn-secondary mr-auto ${this.state.collapse ? 'collapsed' : ''}`
    }, /*#__PURE__*/external_React_default().createElement("span", {
      className: "icon",
      "aria-hidden": "true"
    }), "\xA0", /*#__PURE__*/external_React_default().createElement("span", null, map.options_home)), /*#__PURE__*/external_React_default().createElement("div", {
      className: "btn-bar"
    }, /*#__PURE__*/external_React_default().createElement("button", {
      type: "button",
      onClick: this.props.onSignOnly,
      className: "btn btn-secondary",
      disabled: this.props.signOnlyDisabled
    }, /*#__PURE__*/external_React_default().createElement("span", null, map.editor_sign_button)), /*#__PURE__*/external_React_default().createElement("button", {
      type: "button",
      onClick: this.props.onCancel,
      className: "btn btn-secondary"
    }, /*#__PURE__*/external_React_default().createElement("span", null, map.form_cancel)), /*#__PURE__*/external_React_default().createElement("button", {
      type: "button",
      onClick: this.props.onOk,
      className: "btn btn-primary",
      disabled: this.props.encryptDisabled
    }, /*#__PURE__*/external_React_default().createElement("span", null, this.props.integration ? map.form_submit : map.editor_encrypt_button)))));
  }
}
EditorModalFooter_EditorModalFooter.propTypes = {
  encryptDisabled: (prop_types_default()).bool,
  // encrypt action disabled
  signOnlyDisabled: (prop_types_default()).bool,
  // sign only action disabled
  extraKey: (prop_types_default()).bool,
  // extra key input enabled
  extraKeyInput: (prop_types_default()).element,
  // extra keys input control
  integration: (prop_types_default()).bool,
  // integration active indicator
  onCancel: (prop_types_default()).func,
  // click on cancel button
  onChangeSignKey: (prop_types_default()).func,
  // user selects new key
  onClickSignSetting: (prop_types_default()).func,
  // click on navigation link
  onExtraKey: (prop_types_default()).func,
  // click on extra key checkbox
  onOk: (prop_types_default()).func,
  // click on encrypt button
  onSignOnly: (prop_types_default()).func,
  // click on sign only button
  privKeys: (prop_types_default()).array,
  // list of private keys for signing
  signKey: (prop_types_default()).string,
  // sign key id
  signMsg: (prop_types_default()).bool // sign message indicator
};
// EXTERNAL MODULE: ./node_modules/react-tag-input/dist-modules/components/ReactTags.js
var ReactTags = __webpack_require__(2768);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/editor/components/RecipientInput.scss
var RecipientInput = __webpack_require__(2004);
;// ./src/components/editor/components/RecipientInput.scss

      
      
      
      
      
      
      
      
      

var RecipientInput_options = {};

RecipientInput_options.styleTagTransform = (styleTagTransform_default());
RecipientInput_options.setAttributes = (setAttributesWithoutAttributes_default());
RecipientInput_options.insert = insertBySelector_default().bind(null, "head");
RecipientInput_options.domAPI = (styleDomAPI_default());
RecipientInput_options.insertStyleElement = (insertStyleElement_default());

var RecipientInput_update = injectStylesIntoStyleTag_default()(RecipientInput/* default */.A, RecipientInput_options);




       /* harmony default export */ const components_RecipientInput = (RecipientInput/* default */.A && RecipientInput/* default */.A.locals ? RecipientInput/* default */.A.locals : undefined);

;// ./src/components/editor/components/RecipientInput.js
/**
 * Copyright (C) 2016 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */



// `WithContext` as `ReactTags` is taken from the official example




register(['editor_key_has_extra_msg', 'editor_key_not_found', 'editor_key_not_found_msg']);

/**
 * Checks if all recipients have a public key
 * @param {Tag[]} tags - Array of tags
 * @param {Key[]} keys - Array of public keys
 * @param {Boolean} extraKey - Flag indicating whether extra key input is enabled
 * @returns {Boolean} true if any recipient has no key
 */
function hasAnyRecipientNoKey(tags, keys) {
  return tags.some(t => !findRecipientKey(keys, t.id));
}

/**
 * Creates a bootstrap badge class name
 * @param {Boolean} isSuccess - Flag indicating whether the recipient has a key
 * @param {Boolean} hasExtraKey - Flag indicating whether extra key input is enabled
 * @returns {String} CSS class name for the tag
 */
function getTagClassName(isSuccess, hasExtraKey) {
  return `badge-${isSuccess ? 'success' : hasExtraKey ? 'info' : 'danger'}`;
}

/**
 * Converts a recipient object to a tag object.
 * @param {Recipient} recipient - Recipient object
 * @param {Boolean} hasExtraKey - Flag indicating whether extra key input is enabled
 * @returns {Tag}
 */
function recipientToTag(recipient, hasExtraKey) {
  return {
    id: recipient.email,
    text: recipient.displayId || recipient.email,
    // Calc a CSS class for the tag object
    className: getTagClassName(recipient.key, hasExtraKey)
  };
}

/**
   * Finds the recipient's corresponding public key.
   * @param {Key[]} keys - array of keys to search for match
   * @param {String} email - recipient's email
   */
function findRecipientKey(keys, email) {
  return keys.find(key => key.email && key.email.toLowerCase() === email.toLowerCase());
}

/**
 * Component that inputs recipient email
 * @param {Props} props - Component properties
 * @returns {React.JSX.Element}
 */
function RecipientInput_RecipientInput({
  extraKey,
  hideErrorMsg,
  keys,
  recipients,
  onChangeRecipients
}) {
  const idRef = (0,external_React_.useRef)(getUUID());

  /**
   * Converts recipient objects into tags format, assigning keys if not present
   * @param {Array<Object>} recipients - Array of recipient objects containing email addresses
   * @param {Array<Key>} keys - Array of key objects to search through
   * @param {boolean} [extraKey] - Whether there is extra key present
   * @return {Array<Tag>} Array of recipient objects in tag format
   */
  const recipientsToTags = (recipients, keys, extraKey) => recipients.map(r => {
    if (!r.key) {
      r.key = findRecipientKey(keys, r.email);
    }
    return recipientToTag(r, extraKey);
  }) || [];
  const tags = (0,external_React_.useMemo)(() => recipientsToTags(recipients, keys, extraKey), [recipients, keys, extraKey]);

  // this is a callback function because we need to update it with new tags before rerender happened
  const hasError = (0,external_React_.useCallback)(tags => hasAnyRecipientNoKey(tags, keys), [keys]);

  /**
   * Converts a tag into recipient object
   * Also performs a key search in a key array for a matching key.
   * If the key is not found, marks it as one for the `auto-locate` procedure
   * @param  {Tag} tag - Tag to convert
   * @returns {Recipient} - Recipient object with a key attached if found
   */
  const tagToRecipient = (0,external_React_.useCallback)(tag => {
    if (!tag || !tag.id) {
      return;
    }
    const recipient = {
      email: tag.id,
      displayId: tag.id
    };
    const key = findRecipientKey(keys, recipient.email);
    if (key) {
      recipient.key = key;
      recipient.fingerprint = key.fingerprint;
    }
    if (!recipient.key && !recipient.checkServer) {
      // No local key found, do a search with the autoLocate module
      recipient.checkServer = true;
    }
    return recipient;
  }, [keys]);

  /**
   * Updates recipients for the parent component
   * Has to be called once on init to update error statuses of the parent component
   */
  const updateParentRecipients = (0,external_React_.useCallback)(tags => onChangeRecipients(tags.map(t => tagToRecipient(t)), hasError(tags)), [hasError, onChangeRecipients, tagToRecipient]);
  const onDelete = (0,external_React_.useCallback)(tagIndex => {
    updateParentRecipients(tags.filter((_, i) => i !== tagIndex));
  }, [tags, updateParentRecipients]);
  const onAddition = (0,external_React_.useCallback)(newTag => {
    if (checkEmail(newTag.id)) {
      updateParentRecipients([...tags, newTag]);
      // After updating the tags, refocus the input field using the constant id
      // This is the only way because <ReactTags> doesn't give access to it's children, nor gives an API to set focus
      setTimeout(() => {
        const inputElem = document.querySelector(`[id="${idRef.current}"] .tag-input-field`);
        if (inputElem) {
          inputElem.focus();
        }
      }, 0);
    }
  }, [idRef, tags, updateParentRecipients]);
  const onFilterSuggestions = (textInputValue, possibleSuggestionsArray) => {
    const lowerCaseQuery = textInputValue.toLowerCase();
    return possibleSuggestionsArray.filter(suggestion => suggestion.text.toLowerCase().includes(lowerCaseQuery)).slice(0, 10);
  };
  const suggestions = keys.filter(key => !tags.find(tag => tag.id === key.email)).map(key => ({
    id: key.email,
    text: `${key.userId} - ${key.keyId}`
  }));
  const renderSuggestion = ({
    text
  }, query) => {
    query = query.trim();
    let html = text.replaceAll(query, `<mark>${query}</mark>`);
    html = encodeHTML(html);
    html = html.replaceAll('&lt;mark&gt;', '<mark>').replaceAll('&lt;&#x2F;mark&gt;', '</mark>'); // decode mark tag
    return /*#__PURE__*/external_React_default().createElement("span", {
      dangerouslySetInnerHTML: {
        __html: html
      }
    });
  };
  return /*#__PURE__*/external_React_default().createElement("div", {
    id: idRef.current,
    className: "mb-0"
  }, /*#__PURE__*/external_React_default().createElement(ReactTags.WithContext, {
    tags: tags,
    suggestions: suggestions,
    renderSuggestion: renderSuggestion,
    handleDelete: onDelete,
    handleAddition: onAddition,
    handleFilterSuggestions: onFilterSuggestions,
    placeholder: null,
    allowDragDrop: false,
    minQueryLength: 1,
    separators: ['Enter', 'Tab', 'Space'],
    classNames: {
      tags: 'recipients-input mb-0 form-control',
      tagInput: 'tag-input-wrapper flex-grow-1',
      tagInputField: 'tag-input-field m-0 p-0',
      selected: 'tag-selected-list d-flex flex-wrap',
      tag: 'tag badge',
      remove: 'tag-remove',
      suggestions: 'suggestions d-block dropdown-menu',
      activeSuggestion: 'active-suggestion dropdown-item:hover'
    }
  }), !hideErrorMsg && hasError(tags) && !extraKey && /*#__PURE__*/external_React_default().createElement("div", {
    className: "alert alert-danger mb-0",
    role: "alert"
  }, /*#__PURE__*/external_React_default().createElement("strong", null, map.editor_key_not_found), " ", /*#__PURE__*/external_React_default().createElement("span", null, map.editor_key_not_found_msg)), extraKey && /*#__PURE__*/external_React_default().createElement("div", {
    className: "alert alert-info mb-0",
    role: "alert"
  }, /*#__PURE__*/external_React_default().createElement("span", null, map.editor_key_has_extra_msg)));
}

/**
 * @typedef {Object} Props
 * @property {Boolean} extraKey - Flag indicating whether extra key input is enabled
 * @property {Boolean} hideErrorMsg - Flag indicating whether error message should be hidden
 * @property {Key[]} keys - Array of public keys
 * @property {Function} onAutoLocate - Callback function for auto-locating keys
 * @property {Function} onChangeRecipients - Callback function for recipient changes
 * @property {Recipient[]} recipients - Array of recipients
 */
RecipientInput_RecipientInput.propTypes = {
  extraKey: (prop_types_default()).bool,
  hideErrorMsg: (prop_types_default()).bool,
  keys: (prop_types_default()).array,
  onAutoLocate: (prop_types_default()).func,
  onChangeRecipients: (prop_types_default()).func,
  recipients: (prop_types_default()).array
};

/**
 * @typedef {Object} Recipient
 * @property {String} email Email address of the recipient
 * @property {String} displayId Display name of the recipient
 * @property {String} fingerprint Fingerprint of the recipient's public key
 * @property {Object} key Public key of the recipient
 */

/**
 * @typedef {Object} Key
 * @property {String} userId User ID of the key owner (name or email)
 * @property {String} keyId Key ID of the key
 * @property {String} email Email address of the key owner
 * @property {String} fingerprint Fingerprint (hash) of the key
 */

/**
 * @typedef {Object} Tag
 * Represents id/value combination for the _ReactTags_ component
 * @property {String} id Email address of the recipient
 * @property {String} text Display text of the recipient
 * @property {String} className CSS class for the label
 */
;// ./src/components/editor/components/BlurWarning.js
/**
 * Copyright (C) 2017-2019 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */



register(['editor_blur_warn']);
class BlurWarning extends (external_React_default()).Component {
  constructor() {
    super();
    this.state = {
      showBlurWarning: false
    };
    // timeoutID for period in which the blur warning alert is visible
    this.blurWarnActive = null;
    // timeoutID for period in which blur events are monitored
    this.blurWarnPeriod = null;
    // timeoutID for period in which blur events are non-critical
    this.blurValid = null;
    // observe window for getting focus
    window.addEventListener('focus', () => this.startBlurValid());
  }
  startBlurWarnInterval() {
    if (this.blurWarnPeriod) {
      return;
    }
    this.blurWarnPeriod = setTimeout(() => this.blurWarnPeriod = null, 2000);
  }

  /*
   blur warning displayed if blur occurs:
   - inside blur warning period (2s after input)
   - not within 40ms after keydown event (text editor)
   - not within 40ms before focus event (window, modal)
  */
  onBlur() {
    if (this.blurWarnPeriod && !this.blurValid) {
      setTimeout(() => this.showBlurWarning(), 40);
    }
  }
  showBlurWarning() {
    if (this.blurValid) {
      return;
    }
    if (this.blurWarnActive) {
      clearTimeout(this.blurWarnActive);
    }
    this.setState({
      showBlurWarning: true
    });
    this.blurWarnActive = setTimeout(() => this.setState({
      showBlurWarning: false
    }), 800);
  }
  startBlurValid() {
    if (this.blurValid) {
      // clear timeout
      clearTimeout(this.blurValid);
    }
    // restart
    this.blurValid = setTimeout(() => this.blurValid = null, 40);
  }
  render() {
    if (!this.state.showBlurWarning) {
      return null;
    }
    return /*#__PURE__*/external_React_default().createElement("div", {
      className: "alert alert-warning fade show",
      role: "alert",
      style: {
        position: 'absolute',
        top: '300px',
        left: '50%',
        marginLeft: '-240px',
        zIndex: 1050
      }
    }, /*#__PURE__*/external_React_default().createElement("h3", null, map.editor_blur_warn));
  }
}
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./src/components/util/SecurityBG.css
var SecurityBG = __webpack_require__(3673);
;// ./src/components/util/SecurityBG.css

      
      
      
      
      
      
      
      
      

var SecurityBG_options = {};

SecurityBG_options.styleTagTransform = (styleTagTransform_default());
SecurityBG_options.setAttributes = (setAttributesWithoutAttributes_default());
SecurityBG_options.insert = insertBySelector_default().bind(null, "head");
SecurityBG_options.domAPI = (styleDomAPI_default());
SecurityBG_options.insertStyleElement = (insertStyleElement_default());

var SecurityBG_update = injectStylesIntoStyleTag_default()(SecurityBG/* default */.A, SecurityBG_options);




       /* harmony default export */ const util_SecurityBG = (SecurityBG/* default */.A && SecurityBG/* default */.A.locals ? SecurityBG/* default */.A.locals : undefined);

;// ./src/components/util/SecurityBG.js




class SecurityBG_SecurityBG extends (external_React_default()).Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'none',
      color: 'none'
    };
    props.port.on('update-security-background', () => this.setSecurityBG());
  }
  componentDidMount() {
    this.setSecurityBG();
  }
  async setSecurityBG() {
    const {
      image,
      color
    } = await getSecurityBackground(this.props.port);
    this.setState({
      image,
      color
    });
  }
  render() {
    return /*#__PURE__*/external_React_default().createElement("div", {
      className: `securityBG ${this.props.className || ''}`,
      style: {
        backgroundImage: this.state.image,
        backgroundColor: this.state.color
      }
    }, this.props.children);
  }
}
SecurityBG_SecurityBG.propTypes = {
  className: (prop_types_default()).string,
  port: (prop_types_default()).object.isRequired,
  children: (prop_types_default()).node.isRequired
};
;// ./src/components/util/Alert.js
/**
 * Copyright (C) 2017 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */




/**
 * Alert
 */
function Alert({
  className,
  id,
  header,
  children: message,
  type
}) {
  return /*#__PURE__*/external_React_default().createElement("div", {
    id: id,
    className: `alert alert-${type} fade show ${className || ''}`,
    role: "alert"
  }, header && /*#__PURE__*/external_React_default().createElement("strong", null, `${header} `), message);
}
Alert.propTypes = {
  className: (prop_types_default()).string,
  id: (prop_types_default()).string,
  header: (prop_types_default()).string,
  children: (prop_types_default()).node.isRequired,
  type: prop_types_default().oneOf(['success', 'info', 'warning', 'danger'])
};
Alert.defaultProps = {
  type: 'info'
};
;// ./src/lib/file.js
/**
 * Copyright (C) 2016 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */




/**
 * @param {File} file
 * @param {Number} file.size
 * @returns {boolean}
 */
function isOversize(file) {
  return file.size >= MAX_FILE_UPLOAD_SIZE;
}

/**
 * @param {File} file
 * @param {Number} file.lastModified
 * @param {Date} file.lastModifiedDate
 * @param {String} file.name
 * @param {Number} file.size
 * @param {String} file.type
 * @param {String} file.webkitRelativePath
 * @param {Funtion} onLoadEnd
 * @returns {Promise<Object, Error>}
 */
function readUploadFile(file, onLoadEnd) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      resolve({
        content: this.result,
        id: getUUID(),
        name: file.name,
        size: file.size,
        type: file.type
      });
    };
    fileReader.onloadend = onLoadEnd;
    fileReader.onabort = function (evt) {
      reject(evt);
    };
    fileReader.readAsDataURL(file);
  });
}
function extractFileNameWithoutExt(fileName) {
  const indexOfDot = fileName.lastIndexOf('.');
  if (indexOfDot > 0) {
    // case: regular
    return fileName.substring(0, indexOfDot);
  } else {
    return fileName;
  }
}
function extractFileExtension(fileName) {
  const lastindexDot = fileName.lastIndexOf('.');
  if (lastindexDot <= 0) {
    // no extension
    return '';
  } else {
    return fileName.substring(lastindexDot + 1, fileName.length).toLowerCase().trim();
  }
}
class FileUpload {
  constructor() {
    // flag to monitor upload-in-progress status
    this.numUploadsInProgress = 0;
    // buffer for actions after upload finished
    this.actions = null;
  }
  readFile(file) {
    this.numUploadsInProgress++;
    return readUploadFile(file, this.onLoadEnd).catch(error => {
      this.onLoadEnd();
      throw error;
    });
  }
  inProgress() {
    return this.actions !== null;
  }
  registerAction(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Wrong parameter type, register only functions as actions');
    }
    this.action = fn;
  }
  onLoadEnd() {
    this.numUploadsInProgress--;
    if (this.numUploadsInProgress === 0 && this.actions) {
      this.action();
      this.action = null;
    }
  }
}
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/util/FilePanel.scss
var FilePanel = __webpack_require__(5465);
;// ./src/components/util/FilePanel.scss

      
      
      
      
      
      
      
      
      

var FilePanel_options = {};

FilePanel_options.styleTagTransform = (styleTagTransform_default());
FilePanel_options.setAttributes = (setAttributesWithoutAttributes_default());
FilePanel_options.insert = insertBySelector_default().bind(null, "head");
FilePanel_options.domAPI = (styleDomAPI_default());
FilePanel_options.insertStyleElement = (insertStyleElement_default());

var FilePanel_update = injectStylesIntoStyleTag_default()(FilePanel/* default */.A, FilePanel_options);




       /* harmony default export */ const util_FilePanel = (FilePanel/* default */.A && FilePanel/* default */.A.locals ? FilePanel/* default */.A.locals : undefined);

;// ./src/components/util/FilePanel.js
/**
 * Copyright (C) 2017-2019 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */







register(['decrypt_open_viewer_btn_title', 'editor_remove_upload', 'file_invalid_signed', 'file_not_signed', 'file_signed', 'key_export_dialog_copy_to_clipboard']);
class FileUploadPanel extends (external_React_default()).Component {
  componentDidUpdate(prevProps) {
    if (this.props.files !== prevProps.files) {
      this.panel.scrollIntoView(false);
    }
  }
  render() {
    return /*#__PURE__*/external_React_default().createElement("div", {
      className: "file-panel d-flex flex-wrap align-items-center",
      ref: node => this.panel = node
    }, this.props.files.map(file => /*#__PURE__*/external_React_default().createElement(FileUploadElement, {
      key: file.id,
      file: file,
      onRemove: this.props.onRemoveFile
    })));
  }
}
FileUploadPanel.propTypes = {
  files: (prop_types_default()).array,
  onRemoveFile: (prop_types_default()).func
};
function FileUploadElement({
  file,
  onRemove
}) {
  const fileExt = extractFileExtension(file.name);
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: "file-element",
    id: file.id,
    title: file.name
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "file-header"
  }, (fileExt === 'asc' || fileExt === 'gpg') && /*#__PURE__*/external_React_default().createElement("img", {
    src: "../../img/Mailvelope/logo_signet.svg",
    width: "28",
    height: "28"
  }), fileExt && /*#__PURE__*/external_React_default().createElement("span", {
    className: "file-extension"
  }, fileExt), /*#__PURE__*/external_React_default().createElement("span", {
    className: "file-name"
  }, extractFileNameWithoutExt(file.name)), onRemove && /*#__PURE__*/external_React_default().createElement("span", {
    title: map.editor_remove_upload,
    className: "icon icon-close",
    onClick: () => onRemove(file.id)
  })));
}
FileUploadElement.propTypes = {
  file: (prop_types_default()).object,
  // {id, name}
  secureIcon: (prop_types_default()).bool,
  onRemove: (prop_types_default()).func
};
function FileDownloadPanel(props) {
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: `file-panel ${props.className || 'd-flex flex-wrap align-items-center'}`
  }, props.files.map(file => /*#__PURE__*/external_React_default().createElement(FileDownloadElement, {
    key: file.id,
    file: file,
    onClick: props.onClickFile,
    onCopyToClipboard: props.onCopyToClipboard
  })));
}
FileDownloadPanel.propTypes = {
  className: (prop_types_default()).string,
  files: (prop_types_default()).array,
  // {id, name}
  onClickFile: (prop_types_default()).func,
  onCopyToClipboard: (prop_types_default()).func
};
function FileDownloadElement({
  file,
  onClick,
  onCopyToClipboard
}) {
  const fileExt = extractFileExtension(file.name);
  const fileName = extractFileNameWithoutExt(file.name);
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: "file-element"
  }, /*#__PURE__*/external_React_default().createElement("a", {
    className: "file-header",
    onClick: onClick,
    title: file.name,
    download: file.name,
    href: file.objectURL || '#'
  }, (fileExt === 'asc' || fileExt === 'gpg' || fileExt === 'pgp') && /*#__PURE__*/external_React_default().createElement("img", {
    src: "../../img/Mailvelope/logo_signet.svg",
    width: "28",
    height: "28"
  }), /*#__PURE__*/external_React_default().createElement("span", {
    className: "file-extension"
  }, fileExt), /*#__PURE__*/external_React_default().createElement("span", {
    className: "file-name"
  }, fileName), file.objectURL && /*#__PURE__*/external_React_default().createElement("span", {
    className: "icon icon-download"
  }), file.onShowPopup && /*#__PURE__*/external_React_default().createElement("button", {
    type: "button",
    className: "icon-btn ml-1",
    title: map.decrypt_open_viewer_btn_title,
    onClick: e => {
      e.preventDefault();
      file.onShowPopup();
    }
  }, /*#__PURE__*/external_React_default().createElement("img", {
    src: "../../img/Mailvelope/logo_signet.svg",
    width: "14",
    height: "14"
  })), file.content && /*#__PURE__*/external_React_default().createElement("button", {
    type: "button",
    className: "icon-btn ml-1",
    title: map.key_export_dialog_copy_to_clipboard,
    onClick: e => {
      e.preventDefault();
      onCopyToClipboard(file.content);
    }
  }, /*#__PURE__*/external_React_default().createElement("span", {
    className: "icon icon-copy"
  }))), file.content && /*#__PURE__*/external_React_default().createElement("textarea", {
    className: "form-control",
    value: file.content,
    rows: 6,
    spellCheck: "false",
    autoComplete: "off",
    readOnly: true
  }), file.signer && /*#__PURE__*/external_React_default().createElement(Alert, {
    className: "mt-2 mb-0 align-self-start",
    type: file.signer.type
  }, file.signer.label));
}
FileDownloadElement.propTypes = {
  file: (prop_types_default()).object,
  // {id, name, objectURL}
  onClick: (prop_types_default()).func,
  onCopyToClipboard: (prop_types_default()).func
};
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/util/FileUpload.scss
var util_FileUpload = __webpack_require__(380);
;// ./src/components/util/FileUpload.scss

      
      
      
      
      
      
      
      
      

var FileUpload_options = {};

FileUpload_options.styleTagTransform = (styleTagTransform_default());
FileUpload_options.setAttributes = (setAttributesWithoutAttributes_default());
FileUpload_options.insert = insertBySelector_default().bind(null, "head");
FileUpload_options.domAPI = (styleDomAPI_default());
FileUpload_options.insertStyleElement = (insertStyleElement_default());

var FileUpload_update = injectStylesIntoStyleTag_default()(util_FileUpload/* default */.A, FileUpload_options);




       /* harmony default export */ const components_util_FileUpload = (util_FileUpload/* default */.A && util_FileUpload/* default */.A.locals ? util_FileUpload/* default */.A.locals : undefined);

;// ./src/components/util/FileUpload.js
/**
 * Copyright (C) 2019 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */






register(['upload_help', 'upload_attachment', 'upload_drop']);
class FileUpload_FileUpload extends (external_React_default()).Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false
    };
    this.handleClickUpload = this.handleClickUpload.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }
  componentDidMount() {
    this.dragCounter = 0;
  }
  handleClickUpload() {
    this.fileInput.click();
    if (this.props.onClickUpload) {
      this.props.onClickUpload();
    }
  }
  handleDragEnter(e) {
    e.preventDefault();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({
        dragging: true
      });
    }
  }
  handleDragLeave(e) {
    e.preventDefault();
    this.dragCounter--;
    if (this.dragCounter > 0) {
      return;
    }
    this.setState({
      dragging: false
    });
  }
  handleDrop(e) {
    e.preventDefault();
    this.setState({
      dragging: false
    });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.onChangeFileInput(e.dataTransfer.files);
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  }
  render() {
    return /*#__PURE__*/external_React_default().createElement("div", {
      className: "fileUpload w-100",
      onDragEnter: this.handleDragEnter,
      onDragLeave: this.handleDragLeave,
      onDragOver: e => e.preventDefault(),
      onDrop: this.handleDrop
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "area d-flex flex-column justify-content-center align-items-center overflow-auto"
    }, this.props.files.length > 0 && /*#__PURE__*/external_React_default().createElement("div", {
      className: "align-items-start align-self-stretch"
    }, /*#__PURE__*/external_React_default().createElement(FileUploadPanel, {
      files: this.props.files,
      onRemoveFile: this.props.onRemoveFile
    })), /*#__PURE__*/external_React_default().createElement("div", {
      className: "d-flex justify-content-center align-items-center align-self-stretch"
    }, /*#__PURE__*/external_React_default().createElement("span", {
      className: "text-muted font-italic mr-3"
    }, map.upload_help), /*#__PURE__*/external_React_default().createElement("button", {
      type: "button",
      onClick: this.handleClickUpload,
      className: "btn btn-sm btn-secondary"
    }, /*#__PURE__*/external_React_default().createElement("span", null, map.upload_attachment)), /*#__PURE__*/external_React_default().createElement("input", {
      ref: node => this.fileInput = node,
      type: "file",
      accept: this.props.filter ? this.props.filter.join(',') : '*',
      className: "add-file-input d-none",
      multiple: "multiple",
      onChange: e => this.props.onChangeFileInput(e.target.files)
    }))), /*#__PURE__*/external_React_default().createElement("div", {
      className: `overlay d-flex justify-content-center align-items-center ${this.state.dragging ? 'active' : ''}`
    }, /*#__PURE__*/external_React_default().createElement("span", {
      className: "text-muted font-italic"
    }, map.upload_drop)));
  }
}
FileUpload_FileUpload.propTypes = {
  filter: (prop_types_default()).array,
  // [.asc, .gpg]
  files: (prop_types_default()).array,
  // {id, name}
  onRemoveFile: (prop_types_default()).func,
  onClickUpload: (prop_types_default()).func,
  onChangeFileInput: (prop_types_default()).func
};
;// ./node_modules/reactstrap/es/Toast.js



var Toast_excluded = ["className", "cssModule", "tag", "isOpen", "children", "transition", "fade", "innerRef"];

function Toast_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function Toast_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { Toast_ownKeys(Object(source), true).forEach(function (key) { (0,defineProperty/* default */.A)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { Toast_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }






var Toast_propTypes = {
  children: (prop_types_default()).node,
  className: (prop_types_default()).string,
  cssModule: (prop_types_default()).object,
  fade: (prop_types_default()).bool,
  isOpen: (prop_types_default()).bool,
  tag: tagPropType,
  transition: prop_types_default().shape(es_Fade.propTypes),
  innerRef: prop_types_default().oneOfType([(prop_types_default()).object, (prop_types_default()).string, (prop_types_default()).func])
};
var Toast_defaultProps = {
  isOpen: true,
  tag: 'div',
  fade: true,
  transition: Toast_objectSpread(Toast_objectSpread({}, es_Fade.defaultProps), {}, {
    unmountOnExit: true
  })
};

function Toast(props) {
  var className = props.className,
      cssModule = props.cssModule,
      Tag = props.tag,
      isOpen = props.isOpen,
      children = props.children,
      transition = props.transition,
      fade = props.fade,
      innerRef = props.innerRef,
      attributes = _objectWithoutPropertiesLoose(props, Toast_excluded);

  var classes = mapToCssModules(classnames_default()(className, 'toast'), cssModule);

  var toastTransition = Toast_objectSpread(Toast_objectSpread(Toast_objectSpread({}, es_Fade.defaultProps), transition), {}, {
    baseClass: fade ? transition.baseClass : '',
    timeout: fade ? transition.timeout : 0
  });

  return /*#__PURE__*/external_React_default().createElement(es_Fade, _extends({}, attributes, toastTransition, {
    tag: Tag,
    className: classes,
    in: isOpen,
    role: "alert",
    innerRef: innerRef
  }), children);
}

Toast.propTypes = Toast_propTypes;
Toast.defaultProps = Toast_defaultProps;
/* harmony default export */ const es_Toast = (Toast);
;// ./node_modules/reactstrap/es/ToastHeader.js


var ToastHeader_excluded = ["className", "cssModule", "children", "toggle", "tag", "wrapTag", "closeAriaLabel", "charCode", "close", "tagClassName", "icon"];




var ToastHeader_propTypes = {
  tag: tagPropType,
  icon: prop_types_default().oneOfType([(prop_types_default()).string, (prop_types_default()).node]),
  wrapTag: tagPropType,
  toggle: (prop_types_default()).func,
  className: (prop_types_default()).string,
  cssModule: (prop_types_default()).object,
  children: (prop_types_default()).node,
  closeAriaLabel: (prop_types_default()).string,
  charCode: prop_types_default().oneOfType([(prop_types_default()).string, (prop_types_default()).number]),
  close: (prop_types_default()).object
};
var ToastHeader_defaultProps = {
  tag: 'strong',
  wrapTag: 'div',
  tagClassName: 'mr-auto',
  closeAriaLabel: 'Close',
  charCode: 215
};

var ToastHeader = function ToastHeader(props) {
  var closeButton;
  var icon;

  var className = props.className,
      cssModule = props.cssModule,
      children = props.children,
      toggle = props.toggle,
      Tag = props.tag,
      WrapTag = props.wrapTag,
      closeAriaLabel = props.closeAriaLabel,
      charCode = props.charCode,
      close = props.close,
      tagClassName = props.tagClassName,
      iconProp = props.icon,
      attributes = _objectWithoutPropertiesLoose(props, ToastHeader_excluded);

  var classes = mapToCssModules(classnames_default()(className, 'toast-header'), cssModule);

  if (!close && toggle) {
    var closeIcon = typeof charCode === 'number' ? String.fromCharCode(charCode) : charCode;
    closeButton = /*#__PURE__*/external_React_default().createElement("button", {
      type: "button",
      onClick: toggle,
      className: mapToCssModules('close', cssModule),
      "aria-label": closeAriaLabel
    }, /*#__PURE__*/external_React_default().createElement("span", {
      "aria-hidden": "true"
    }, closeIcon));
  }

  if (typeof iconProp === "string") {
    icon = /*#__PURE__*/external_React_default().createElement("svg", {
      className: mapToCssModules("rounded text-" + iconProp),
      width: "20",
      height: "20",
      xmlns: "http://www.w3.org/2000/svg",
      preserveAspectRatio: "xMidYMid slice",
      focusable: "false",
      role: "img"
    }, /*#__PURE__*/external_React_default().createElement("rect", {
      fill: "currentColor",
      width: "100%",
      height: "100%"
    }));
  } else if (iconProp) {
    icon = iconProp;
  }

  return /*#__PURE__*/external_React_default().createElement(WrapTag, _extends({}, attributes, {
    className: classes
  }), icon, /*#__PURE__*/external_React_default().createElement(Tag, {
    className: mapToCssModules(classnames_default()(tagClassName, {
      "ml-2": icon != null
    }), cssModule)
  }, children), close || closeButton);
};

ToastHeader.propTypes = ToastHeader_propTypes;
ToastHeader.defaultProps = ToastHeader_defaultProps;
/* harmony default export */ const es_ToastHeader = (ToastHeader);
;// ./node_modules/reactstrap/es/ToastBody.js


var ToastBody_excluded = ["className", "cssModule", "innerRef", "tag"];




var ToastBody_propTypes = {
  tag: tagPropType,
  className: (prop_types_default()).string,
  cssModule: (prop_types_default()).object,
  innerRef: prop_types_default().oneOfType([(prop_types_default()).object, (prop_types_default()).string, (prop_types_default()).func])
};
var ToastBody_defaultProps = {
  tag: 'div'
};

var ToastBody = function ToastBody(props) {
  var className = props.className,
      cssModule = props.cssModule,
      innerRef = props.innerRef,
      Tag = props.tag,
      attributes = _objectWithoutPropertiesLoose(props, ToastBody_excluded);

  var classes = mapToCssModules(classnames_default()(className, 'toast-body'), cssModule);
  return /*#__PURE__*/external_React_default().createElement(Tag, _extends({}, attributes, {
    className: classes,
    ref: innerRef
  }));
};

ToastBody.propTypes = ToastBody_propTypes;
ToastBody.defaultProps = ToastBody_defaultProps;
/* harmony default export */ const es_ToastBody = (ToastBody);
;// ./src/components/util/Toast.js
/**
 * Copyright (C) 2019 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */





/**
 * Alert
 */
function Toast_Toast({
  className,
  isOpen,
  transition,
  toggle,
  header,
  type,
  children: message
}) {
  return /*#__PURE__*/external_React_default().createElement(es_Toast, {
    className: `${className || ''} ${type || ''}`,
    isOpen: isOpen,
    transition: transition
  }, header && /*#__PURE__*/external_React_default().createElement(es_ToastHeader, {
    toggle: toggle,
    icon: type && /*#__PURE__*/external_React_default().createElement("span", {
      "aria-hidden": "true",
      className: `icon-svg icon-svg-${type === 'success' ? 'positive' : 'negative'} flex-shrink-0`
    })
  }, header), /*#__PURE__*/external_React_default().createElement(es_ToastBody, {
    className: `d-flex align-items-center ${toggle && !header ? 'dismissable' : ''}`
  }, toggle && !header && type && /*#__PURE__*/external_React_default().createElement("span", {
    "aria-hidden": "true",
    className: `icon-svg icon-svg-${type === 'success' ? 'positive' : 'negative'} flex-shrink-0`
  }), message, " ", toggle && !header && /*#__PURE__*/external_React_default().createElement("button", {
    type: "button",
    onClick: toggle,
    className: "close ml-auto",
    "aria-label": "Close"
  }, /*#__PURE__*/external_React_default().createElement("span", {
    "aria-hidden": "true",
    className: "icon icon-close flex-shrink-0 ml-3"
  }))));
}
Toast_Toast.propTypes = {
  className: (prop_types_default()).string,
  isOpen: (prop_types_default()).bool,
  transition: prop_types_default().shape(es_Fade.propTypes),
  toggle: (prop_types_default()).func,
  header: (prop_types_default()).string,
  type: prop_types_default().oneOf(['success', 'error']),
  children: (prop_types_default()).node.isRequired
};
Toast_Toast.defaultProps = {
  isOpen: true
};
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/util/Spinner.scss
var Spinner = __webpack_require__(4348);
;// ./src/components/util/Spinner.scss

      
      
      
      
      
      
      
      
      

var Spinner_options = {};

Spinner_options.styleTagTransform = (styleTagTransform_default());
Spinner_options.setAttributes = (setAttributesWithoutAttributes_default());
Spinner_options.insert = insertBySelector_default().bind(null, "head");
Spinner_options.domAPI = (styleDomAPI_default());
Spinner_options.insertStyleElement = (insertStyleElement_default());

var Spinner_update = injectStylesIntoStyleTag_default()(Spinner/* default */.A, Spinner_options);




       /* harmony default export */ const util_Spinner = (Spinner/* default */.A && Spinner/* default */.A.locals ? Spinner/* default */.A.locals : undefined);

;// ./src/components/util/Spinner.js



class Spinner_Spinner extends (external_React_default()).Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: this.props.delay ? true : false
    };
    this.timer = 0;
  }
  componentDidMount() {
    if (this.props.delay) {
      // show spinner after delay
      this.timer = setTimeout(() => this.setState({
        hide: false
      }), this.props.delay);
    }
  }
  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  render() {
    return /*#__PURE__*/external_React_default().createElement("div", {
      className: `m-spinner-${this.props.fullscreen ? 'fullscreen' : 'inline'} ${this.state.hide ? 'hide' : ''}`,
      style: this.props.style,
      role: "status"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "symbol"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "bounce1"
    }), /*#__PURE__*/external_React_default().createElement("div", {
      className: "bounce2"
    })));
  }
}
Spinner_Spinner.propTypes = {
  style: (prop_types_default()).object,
  delay: (prop_types_default()).number,
  fullscreen: (prop_types_default()).bool
};
Spinner_Spinner.defaultProps = {
  delay: 400,
  fullscreen: false
};
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/util/Terminate.scss
var Terminate = __webpack_require__(9950);
;// ./src/components/util/Terminate.scss

      
      
      
      
      
      
      
      
      

var Terminate_options = {};

Terminate_options.styleTagTransform = (styleTagTransform_default());
Terminate_options.setAttributes = (setAttributesWithoutAttributes_default());
Terminate_options.insert = insertBySelector_default().bind(null, "head");
Terminate_options.domAPI = (styleDomAPI_default());
Terminate_options.insertStyleElement = (insertStyleElement_default());

var Terminate_update = injectStylesIntoStyleTag_default()(Terminate/* default */.A, Terminate_options);




       /* harmony default export */ const util_Terminate = (Terminate/* default */.A && Terminate/* default */.A.locals ? Terminate/* default */.A.locals : undefined);

;// ./src/components/util/Terminate.js
/**
 * Copyright (C) 2019 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */



function Terminate_Terminate() {
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: "terminate"
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: "backdrop"
  }), /*#__PURE__*/external_React_default().createElement("div", {
    className: "symbol"
  }, /*#__PURE__*/external_React_default().createElement("span", {
    className: "icon icon-bolt"
  })));
}
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/components/editor/editor.scss
var editor = __webpack_require__(5949);
;// ./src/components/editor/editor.scss

      
      
      
      
      
      
      
      
      

var editor_options = {};

editor_options.styleTagTransform = (styleTagTransform_default());
editor_options.setAttributes = (setAttributesWithoutAttributes_default());
editor_options.insert = insertBySelector_default().bind(null, "head");
editor_options.domAPI = (styleDomAPI_default());
editor_options.insertStyleElement = (insertStyleElement_default());

var editor_update = injectStylesIntoStyleTag_default()(editor/* default */.A, editor_options);




       /* harmony default export */ const editor_editor = (editor/* default */.A && editor/* default */.A.locals ? editor/* default */.A.locals : undefined);

;// ./src/components/editor/editor.js
/**
 * Copyright (C) 2012-2019 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */

/**
 * @fileOverview This file implements the interface for encrypting and
 * signing user data in an sandboxed environment that is secured from
 * the webmail interface.
 */




















// register language strings
register(['editor_error_header', 'editor_header', 'editor_label_attachments', 'editor_label_copy_recipient', 'editor_label_message', 'editor_label_recipient', 'editor_label_subject', 'form_ok', 'upload_quota_exceeded_warning', 'upload_quota_warning_headline', 'waiting_dialog_decryption_failed']);
class Editor extends (external_React_default()).Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultKey: false,
      defaultPlainText: '',
      embedded: false,
      extraKey: false,
      extraKeys: [],
      extraKeysError: false,
      files: [],
      hasUserInput: false,
      integration: false,
      notification: null,
      plainText: '',
      privKeys: [],
      publicKeys: [],
      pwdDialog: null,
      recipients: [],
      recipientsError: false,
      recipientsCc: [],
      recipientsCcError: false,
      showNotification: false,
      showRecipientsCc: false,
      signKey: '',
      signMsg: false,
      subject: '',
      terminate: false,
      waiting: true
    };
    this.encryptTimeout = null;
    this.port = EventHandler.connect(`editor-${this.props.id}`, this);
    // flag to control time slice for input logging
    this.logTextareaInput = true;
    this.registerEventListeners();
    // ref to blur warning
    this.blurWarning = null;
  }
  componentDidMount() {
    this.port.emit('editor-mount');
  }
  registerEventListeners() {
    this.port.on('set-text', ({
      text
    }) => this.setState({
      defaultPlainText: text,
      plainText: text
    }));
    this.port.on('set-init-data', this.onSetInitData);
    this.port.on('set-mode', this.onSetMode);
    this.port.on('set-attachment', this.onSetAttachment);
    this.port.on('decrypt-in-progress', this.showSpinner);
    this.port.on('encrypt-in-progress', this.onEncryptInProgress);
    this.port.on('send-mail-in-progress', this.showSpinner);
    this.port.on('decrypt-end', this.hideSpinner);
    this.port.on('encrypt-end', this.hideSpinner);
    this.port.on('encrypt-failed', this.hideSpinner);
    this.port.on('decrypt-failed', this.onDecryptFailed);
    this.port.on('show-pwd-dialog', this.onShowPwdDialog);
    this.port.on('hide-pwd-dialog', this.onHidePwdDialog);
    this.port.on('get-plaintext', this.getPlaintext);
    this.port.on('error-message', this.onErrorMessage);
    this.port.on('hide-notification', this.hideNotification);
    this.port.on('show-notification', this.showNotification);
    this.port.on('terminate', this.onTerminate);
    this.port.on('public-key-userids', this.onPublicKeyUserids);
    this.port.on('key-update', this.onKeyUpdate);
    this.port.onDisconnect.addListener(() => this.onDisconnect());
  }
  onSetInitData({
    text = '',
    signMsg,
    subject,
    defaultKeyFpr,
    privKeys = []
  }) {
    this.setState({
      defaultPlainText: text,
      plainText: text,
      subject,
      files: [],
      signMsg: Boolean(signMsg),
      signKey: defaultKeyFpr,
      defaultKey: Boolean(defaultKeyFpr),
      privKeys
    });
  }
  onSetMode({
    event,
    ...modes
  }) {
    if (Object.entries(modes).some(entry => entry[1])) {
      this.fileUpload = new FileUpload();
    }
    this.setState({
      ...modes
    });
  }
  onTerminate() {
    this.setState({
      terminate: true
    }, () => this.port.disconnect());
  }
  onDisconnect() {
    if (this.state.pwdDialog || this.state.embedded) {
      setTimeout(() => {
        this.setState({
          pwdDialog: null,
          waiting: false,
          encryptDisabled: false
        });
      }, 1200);
    }
  }
  handlePlainTextLoad() {
    // emit event to backend that editor has initialized
    this.setState({
      waiting: false
    }, () => this.port.emit('editor-load'));
  }

  /**
   * Remember the available public keys for later and set the recipients proposal gotten from the webmail ui to the editor
   * @param {Array} options.keys         A list of all available public keys from the local keychain
   * @param {Array} options.recipients   recipients gather from the webmail ui
   */
  onPublicKeyUserids({
    keys,
    to,
    cc
  }) {
    // initiate key lookup if they aren't found locally
    // we do it in the editor (not in the controller), because we'd like the UI to be dynamically updated
    this.keyLookup([...to, ...cc]);
    this.setState(prevState => {
      // when received recipients, reset Encrypt button status
      const encryptDisabled = prevState.recipientsError || prevState.recipientsCcError || !to.length;
      return {
        publicKeys: keys,
        encryptDisabled,
        recipients: to,
        recipientsCc: cc,
        showRecipientsCc: cc.length > 0
      };
    });
  }

  /**
   * Event that is triggered after update of the public keyring (e.g. when the key server responded)
   * @param {Array} options.keys   A list of all available public keys from the local keychain
   */
  onKeyUpdate({
    keys
  }) {
    this.setState({
      publicKeys: keys
    });
  }
  onEncryptInProgress() {
    if (!this.encryptTimeout) {
      this.encryptTimeout = setTimeout(() => {
        this.showSpinner();
      }, 300);
    }
  }
  showSpinner() {
    this.setState(prevState => ({
      waiting: !prevState.showNotification
    }));
  }
  hideSpinner() {
    clearTimeout(this.encryptTimeout);
    this.encryptTimeout = null;
    this.setState({
      waiting: false
    });
  }

  /**
   * send log entry for user input
   * @param {string} type
   */
  logUserInput(type) {
    this.setState({
      hasUserInput: true
    });
    this.port.emit('editor-user-input', {
      source: 'security_log_editor',
      type
    });
  }

  /**
   * Is called when the user clicks the cancel button.
   */
  handleCancel() {
    this.logUserInput('security_log_dialog_cancel');
    this.port.emit('editor-close', {
      cancel: true
    });
  }

  /**
   * Is called when the user clicks the sign button.
   */
  handleSign() {
    this.logUserInput('security_log_dialog_sign');
    this.port.emit('sign-only', {
      signKeyFpr: this.state.signKey
    });
  }

  /**
   * Is called when the user clicks the encrypt button.
   */
  handleOk() {
    this.logUserInput('security_log_dialog_encrypt');
    this.setState({
      encryptDisabled: true
    }, () => this.sendPlainText('encrypt'));
  }
  getPlaintext(msg) {
    if (this.fileUpload && this.fileUpload.inProgress()) {
      this.fileUpload.registerAction(() => this.getPlaintext(msg));
      return;
    }
    // don't use key cache when sign & encrypt of message and user has not touched the editor
    // otherwise any predefinedText could be signed with the client-API
    const noCache = this.state.embedded && !msg.draft && !this.state.hasUserInput;
    this.sendPlainText(msg.action, noCache, msg.draft);
  }

  /**
   * Send the plaintext body to the background script for either signing or encryption.
   * @param  {String} action   Either 'sign' or 'encrypt'
   */
  sendPlainText(action, noCache, draft) {
    this.port.emit('editor-plaintext', {
      message: this.state.plainText,
      subject: this.state.subject,
      keysTo: this.state.recipients.map(r => r.key || {
        email: r.email
      }),
      // return email if key not available (action: 'sign')
      keysCc: this.state.recipientsCc.map(r => r.key || {
        email: r.email
      }),
      // return email if key not available (action: 'sign')
      keysEx: this.state.extraKeys.map(r => r.key || {
        email: r.email
      }),
      // return email if key not available (action: 'sign')
      attachments: this.state.files,
      action,
      signMsg: this.state.signMsg || draft,
      // draft is always signed
      signKeyFpr: this.state.signKey,
      noCache
    });
  }
  handleTextChange(value) {
    this.setState({
      plainText: value
    });
    this.blurWarning && this.blurWarning.startBlurWarnInterval();
    this.logTextInput();
  }
  logTextInput() {
    if (this.logTextareaInput) {
      this.logUserInput('security_log_textarea_input');
      // limit textarea log to 1 event per second
      this.logTextareaInput = false;
      window.setTimeout(() => {
        this.logTextareaInput = true;
      }, 1000);
    }
  }
  handleTextMouseUp(event) {
    const textElement = event.currentTarget;
    if (textElement.selectionStart === textElement.selectionEnd) {
      this.logUserInput('security_log_textarea_click');
    } else {
      this.logUserInput('security_log_textarea_select');
    }
  }
  showNotification({
    title: header = '',
    message,
    type,
    autoHide = true,
    hideDelay = 4000,
    closeOnHide = false,
    dismissable = true
  }) {
    this.setState({
      notification: {
        header,
        message,
        type,
        autoHide,
        hideDelay,
        closeOnHide,
        dismissable
      },
      waiting: false,
      pwdDialog: null,
      showNotification: true
    });
  }
  onDecryptFailed(msg) {
    const error = {
      title: map.waiting_dialog_decryption_failed,
      message: msg.error ? msg.error.message : map.waiting_dialog_decryption_failed,
      type: 'error'
    };
    this.showNotification(error);
  }
  onErrorMessage(msg) {
    if (msg.error.code === 'PWD_DIALOG_CANCEL') {
      this.setState({
        encryptDisabled: false
      });
      return;
    }
    msg.error.type = 'error';
    msg.error.title = msg.error.title || map.editor_error_header;
    this.showNotification(msg.error);
  }
  onShowPwdDialog(msg) {
    this.setState({
      pwdDialog: msg,
      waiting: false,
      notification: null
    });
  }
  onHidePwdDialog() {
    this.setState({
      pwdDialog: null
    });
  }
  handleAddAttachment(files) {
    files = Array.from(files);
    const filesSize = files.reduce((total, file) => total + file.size, 0);
    const uploadedSize = this.state.files.reduce((total, file) => total + file.size, 0);
    const currentAttachmentsSize = uploadedSize + filesSize;
    if (currentAttachmentsSize > this.props.maxFileUploadSize) {
      const error = {
        title: map.upload_quota_warning_headline,
        message: `${map.upload_quota_exceeded_warning} ${Math.floor(this.props.maxFileUploadSize / (1024 * 1024))}MB.`
      };
      this.showNotification(error);
      return;
    }
    files.forEach(file => this.addAttachment(file));
  }
  addAttachment(file) {
    if (isOversize(file)) {
      throw new Error('File is too big');
    }
    this.fileUpload.readFile(file).then(file => this.setState(prevState => ({
      files: [...prevState.files, file]
    }))).catch(error => console.log(error));
  }
  onSetAttachment({
    attachment
  }) {
    const buffer = str2ab(attachment.content);
    const blob = new Blob([buffer], {
      type: attachment.mimeType
    });
    const file = new File([blob], attachment.filename, {
      type: attachment.mimeType
    });
    this.addAttachment(file);
  }
  handleRemoveFile(id) {
    this.logUserInput('security_log_remove_attachment');
    this.setState(prevState => ({
      files: prevState.files.filter(file => file.id !== id)
    }));
  }
  handleChangeSignKey(value) {
    if (value === 'nosign') {
      this.setState({
        signMsg: false
      });
    } else {
      this.setState({
        signKey: value,
        signMsg: true
      });
    }
  }
  handleCheck(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.checked
    });
  }
  keyLookup(recipients) {
    recipients.forEach(recipient => {
      if (recipient.checkServer) {
        this.port.emit('key-lookup', {
          recipient
        });
        recipient.checkServer = false;
      }
    });
  }
  hideNotification(timeout = 0, closeEditor = false) {
    setTimeout(() => {
      if (closeEditor) {
        this.port.emit('editor-close');
      } else {
        this.setState({
          showNotification: false,
          notification: null
        });
      }
    }, timeout);
  }

  /**
   * Compute whether the encrypt button should be disabled.
   */
  isEncryptDisabled() {
    const {
      plainText,
      recipients,
      recipientsError,
      recipientsCcError,
      extraKey,
      extraKeys,
      extraKeysError
    } = this.state;
    // If extraKey is checked, require at least one valid extra key and no error
    if (extraKey) {
      return !plainText || !extraKeys.length || extraKeysError;
    }
    // Otherwise, use the original logic for main recipients
    return !plainText || recipientsError || !recipients.length || recipientsCcError;
  }
  handleChangeRecipients(recipients, recipientsError) {
    this.keyLookup(recipients);
    this.setState({
      recipients,
      recipientsError
    });
  }

  // For CC recipients we allow the field to be empty, still handling the error
  handleChangeRecipientsCc(recipientsCc, recipientsCcError) {
    this.keyLookup(recipientsCc);
    this.setState({
      recipientsCc,
      recipientsCcError
    });
  }
  handleChangeExtraKeyInput(extraKeys, extraKeysError) {
    this.setState({
      extraKeys,
      extraKeysError
    });
  }
  onNotificationEnteredTransition() {
    if (this.blurWarning) {
      this.blurWarning.startBlurValid();
    }
    if (this.state.notification.autoHide) {
      this.hideNotification(this.state.notification.hideDelay, this.state.notification.closeOnHide);
    }
  }
  render() {
    const hasExtraKey = Boolean(this.state.extraKey && this.state.extraKeys.length && !this.state.extraKeysError);
    return /*#__PURE__*/external_React_default().createElement(SecurityBG_SecurityBG, {
      className: `editor ${this.state.embedded ? 'embedded' : ''}`,
      port: this.port
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "modal d-block"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "modal-dialog h-100 mw-100 m-0"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "modal-content shadow-lg overflow-auto border-0 h-100"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "modal-body"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "editor d-flex flex-column align-content-center h-100"
    }, !this.state.embedded && /*#__PURE__*/external_React_default().createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "d-flex"
    }, /*#__PURE__*/external_React_default().createElement("label", {
      className: "mr-auto"
    }, map.editor_label_recipient), !this.state.showRecipientsCc && this.state.integration && /*#__PURE__*/external_React_default().createElement("label", null, /*#__PURE__*/external_React_default().createElement("a", {
      href: "#",
      role: "button",
      className: "text-reset",
      onClick: () => this.setState({
        showRecipientsCc: true
      })
    }, map.editor_label_copy_recipient))), /*#__PURE__*/external_React_default().createElement(RecipientInput_RecipientInput, {
      keys: this.state.publicKeys,
      recipients: this.state.recipients,
      onChangeRecipients: (recipients, recipientsError) => this.handleChangeRecipients(recipients, recipientsError),
      extraKey: hasExtraKey
    })), this.state.showRecipientsCc && /*#__PURE__*/external_React_default().createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/external_React_default().createElement("label", {
      className: "mr-auto"
    }, map.editor_label_copy_recipient), /*#__PURE__*/external_React_default().createElement(RecipientInput_RecipientInput, {
      keys: this.state.publicKeys,
      recipients: this.state.recipientsCc,
      onChangeRecipients: (recipients, recipientsError) => this.handleChangeRecipientsCc(recipients, recipientsError),
      extraKey: hasExtraKey
    })), this.state.integration && /*#__PURE__*/external_React_default().createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/external_React_default().createElement("label", null, map.editor_label_subject), /*#__PURE__*/external_React_default().createElement("input", {
      type: "text",
      value: this.state.subject,
      className: "form-control",
      id: "subject",
      onChange: e => this.setState({
        subject: e.target.value
      })
    })), /*#__PURE__*/external_React_default().createElement("div", {
      className: "editor-body d-flex flex-column flex-grow-1"
    }, /*#__PURE__*/external_React_default().createElement("label", null, map.editor_label_message), /*#__PURE__*/external_React_default().createElement("div", {
      className: "flex-grow-1",
      style: {
        margin: '-0.2rem'
      }
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: "plain-text w-100 h-100"
    }, /*#__PURE__*/external_React_default().createElement(PlainText, {
      defaultValue: this.state.defaultPlainText,
      onChange: value => this.handleTextChange(value),
      onBlur: () => this.blurWarning && this.blurWarning.onBlur(),
      onMouseUp: element => this.handleTextMouseUp(element),
      onLoad: () => this.handlePlainTextLoad()
    })))), (this.state.embedded || this.state.integration) && /*#__PURE__*/external_React_default().createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/external_React_default().createElement("label", null, map.editor_label_attachments), /*#__PURE__*/external_React_default().createElement(FileUpload_FileUpload, {
      files: this.state.files,
      onClickUpload: () => this.logUserInput('security_log_add_attachment'),
      onRemoveFile: id => this.handleRemoveFile(id),
      onChangeFileInput: files => this.handleAddAttachment(files)
    })))), !this.state.embedded && /*#__PURE__*/external_React_default().createElement("div", {
      className: "modal-footer px-4 pb-4 pt-2 flex-shrink-0"
    }, /*#__PURE__*/external_React_default().createElement(EditorModalFooter_EditorModalFooter, {
      signMsg: this.state.signMsg,
      signKey: this.state.signKey,
      signOnlyDisabled: !this.state.signMsg || !this.state.privKeys.length || this.state.files.length || this.state.plainText === '' || !this.state.recipients.length,
      extraKey: this.state.extraKey,
      extraKeyInput: /*#__PURE__*/external_React_default().createElement(RecipientInput_RecipientInput, {
        keys: this.state.publicKeys,
        recipients: this.state.extraKeys,
        hideErrorMsg: true,
        onChangeRecipients: (recipients, recipientsError) => this.handleChangeExtraKeyInput(recipients, recipientsError)
      }),
      integration: this.state.integration,
      onCancel: () => this.handleCancel(),
      onChangeSignKey: value => this.handleChangeSignKey(value),
      onClickSignSetting: () => this.port.emit('open-app', {
        fragment: '/settings/general'
      }),
      onExtraKey: event => this.handleCheck(event),
      onOk: () => this.handleOk(),
      onSignOnly: () => this.handleSign(),
      privKeys: this.state.privKeys,
      encryptDisabled: this.isEncryptDisabled()
    }))))), !this.state.embedded && /*#__PURE__*/external_React_default().createElement(BlurWarning, {
      ref: node => this.blurWarning = node
    }), this.state.pwdDialog && /*#__PURE__*/external_React_default().createElement("iframe", {
      className: "editor-popup-pwd-dialog modal-content",
      src: `../enter-password/passwordDialog.html?id=${this.state.pwdDialog.id}`,
      frameBorder: 0
    }), this.state.notification && /*#__PURE__*/external_React_default().createElement("div", {
      className: "toastWrapper"
    }, /*#__PURE__*/external_React_default().createElement(Toast_Toast, {
      isOpen: this.state.showNotification,
      header: this.state.notification.header,
      toggle: this.state.notification.dismissable ? () => this.hideNotification() : undefined,
      type: this.state.notification.type,
      transition: {
        timeout: 150,
        unmountOnExit: true,
        onEntered: () => this.onNotificationEnteredTransition()
      }
    }, this.state.notification.message)), /*#__PURE__*/external_React_default().createElement(es_Fade, {
      in: this.state.pwdDialog !== null || this.state.showNotification && !this.state.notification.dismissable,
      unmountOnExit: true,
      className: "modal-backdrop"
    }), this.state.waiting && /*#__PURE__*/external_React_default().createElement(Spinner_Spinner, {
      fullscreen: true,
      delay: 0
    }), this.state.terminate && /*#__PURE__*/external_React_default().createElement(Terminate_Terminate, null));
  }
}
Editor.propTypes = {
  id: (prop_types_default()).string,
  maxFileUploadSize: (prop_types_default()).number
};
Editor.defaultProps = {
  maxFileUploadSize: MAX_FILE_UPLOAD_SIZE
};
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./src/components/editor/editorRoot.css
var editorRoot = __webpack_require__(6216);
;// ./src/components/editor/editorRoot.css

      
      
      
      
      
      
      
      
      

var editorRoot_options = {};

editorRoot_options.styleTagTransform = (styleTagTransform_default());
editorRoot_options.setAttributes = (setAttributesWithoutAttributes_default());
editorRoot_options.insert = insertBySelector_default().bind(null, "head");
editorRoot_options.domAPI = (styleDomAPI_default());
editorRoot_options.insertStyleElement = (insertStyleElement_default());

var editorRoot_update = injectStylesIntoStyleTag_default()(editorRoot/* default */.A, editorRoot_options);




       /* harmony default export */ const editor_editorRoot = (editorRoot/* default */.A && editorRoot/* default */.A.locals ? editorRoot/* default */.A.locals : undefined);

;// ./src/components/editor/editorRoot.js
/**
 * Copyright (C) 2017 Mailvelope GmbH
 * Licensed under the GNU Affero General Public License version 3
 */








document.addEventListener('DOMContentLoaded', init);
register(['editor_header']);
mapToLocal();
function init() {
  const query = new URLSearchParams(document.location.search);
  // component id
  const id = query.get('id') || '';
  // attachment max file size
  const quota = parseInt(query.get('quota'));
  let maxFileUploadSize = MAX_FILE_UPLOAD_SIZE;
  if (quota && quota < maxFileUploadSize) {
    maxFileUploadSize = quota;
  }
  addDocumentTitle(`Mailvelope - ${map.editor_header}`);
  const root = document.createElement('div');
  external_ReactDOM_default().render(/*#__PURE__*/external_React_default().createElement(Editor, {
    id: id,
    maxFileUploadSize: maxFileUploadSize
  }), document.body.appendChild(root));
}
})();

/******/ })()
;