"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.withBlockWrapper = void 0;
var classnames_1 = require("classnames");
var direction_1 = require("direction");
var EditorContext_1 = require("BlockEditor/Contexts/EditorContext");
var UiContext_1 = require("BlockEditor/Contexts/UiContext");
var getAncestors_1 = require("BlockEditor/Lib/getAncestors");
var styles = require("./styles.module.scss");
var c = function (styles, classes) { return classes ? classes.map(function (c) { return styles[c]; }).join(' ') : ''; };
/**
 * This component wraps all the Content Blocks and provides a great deal of block editing functionality to them.
 */
var BlockWrapper = function (_a) {
    var _b;
    var _c, _d;
    var Comp = _a.Comp, _e = _a.config, config = _e === void 0 ? {} : _e, children = _a.children, rest = __rest(_a, ["Comp", "config", "children"]);
    var editorState = (0, EditorContext_1["default"])().editorState;
    var _f = (0, UiContext_1["default"])(), dragInfo = _f.dragInfo, blockRefs = _f.blockRefs, externalStyles = _f.externalStyles, dir = _f.dir, blockLevelSelectionInfo = _f.blockLevelSelectionInfo, debugMode = _f.debugMode;
    var outOfSyncBlock = ((children === null || children === void 0 ? void 0 : children.props) || rest).block;
    var blockKey = outOfSyncBlock.getKey();
    var blockMap = editorState.getCurrentContent().getBlockMap();
    var syncedBlock = blockMap.get(blockKey);
    var text = syncedBlock.getText();
    var direction = (0, direction_1.direction)(text);
    var depth = syncedBlock.getDepth();
    if ((0, getAncestors_1["default"])(blockMap, blockKey).some(function (b) { return b.getData().get('_collapsed'); }))
        return null;
    var textAlign = syncedBlock.getData().get('_align');
    return React.createElement("div", __assign({ ref: function (elem) { return blockRefs.current[blockKey] = elem; }, "data-block-key": blockKey, className: (0, classnames_1["default"])(styles.blockWrapper, c(externalStyles, (_c = config.styles) === null || _c === void 0 ? void 0 : _c.wrapper), (_b = {},
            _b[styles.dragging] = dragInfo.dragging &&
                dragInfo.isDraggingByHandle &&
                dragInfo.block.getKey() === blockKey,
            _b[externalStyles.blockLevelSelected] = blockLevelSelectionInfo.selectedBlockKeys.some(function (k) { return k === blockKey; }),
            _b)), 
        // @ts-ignore
        style: { '--depth': depth }, draggable: dragInfo.isDraggingByHandle }, (debugMode ? { title: blockKey } : {})),
        React.createElement("div", { className: c(externalStyles, (_d = config.styles) === null || _d === void 0 ? void 0 : _d.contentWrapper), dir: direction === 'neutral' ? dir : direction, style: __assign({}, (textAlign ? { textAlign: textAlign } : null)) },
            React.createElement(Comp, __assign({ className: externalStyles.blockElement, children: children }, (config.sendAdditionalProps ? {
                editorState: editorState,
                block: syncedBlock
            } : {})))));
};
exports["default"] = BlockWrapper;
/**
 * An HOC to help wrap custom component inside a `BlockWrapper` and style them properly.
 */
var withBlockWrapper = function (Comp, config) { return function (props) {
    return React.createElement(BlockWrapper, __assign({ Comp: Comp, config: config }, props));
}; };
exports.withBlockWrapper = withBlockWrapper;
