"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/_app",{

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ MyApp; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/index.css */ \"./styles/index.css\");\n/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_index_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _stockerSession__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../stockerSession */ \"./stockerSession.tsx\");\n/* harmony import */ var react_starfield__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-starfield */ \"./node_modules/react-starfield/dist/index.js\");\n/* harmony import */ var react_starfield__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_starfield__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _contexts_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contexts/store */ \"./contexts/store.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);\n\nvar _s = $RefreshSig$();\n\n\n\n\n\nfunction MyApp(param) {\n    let { Component, pageProps } = param;\n    _s();\n    const [myVariable, setMyVariable] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(1);\n    const [myColor, setMyColor] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(\"black\");\n    const updateVariable = (newValue)=>{\n        setMyVariable(newValue);\n    };\n    const updateColors = (newValue)=>{\n        setMyColor(newValue);\n    };\n    // Subscribe to the custom event\n    (0,_contexts_store__WEBPACK_IMPORTED_MODULE_4__.subscribeToEvent)(\"updateVariable\", updateVariable);\n    (0,_contexts_store__WEBPACK_IMPORTED_MODULE_4__.subscribeToEvent)(\"updateColors\", updateColors);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"App\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            style: {\n                width: \"100%\",\n                height: \"100%\"\n            },\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((react_starfield__WEBPACK_IMPORTED_MODULE_3___default()), {\n                    starCount: 150 * myVariable,\n                    starColor: [\n                        255,\n                        255,\n                        255\n                    ],\n                    speedFactor: 0.1 * myVariable,\n                    backgroundColor: myColor\n                }, void 0, false, {\n                    fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n                    lineNumber: 26,\n                    columnNumber: 4\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_stockerSession__WEBPACK_IMPORTED_MODULE_2__.SessionProvider, {\n                    children: [\n                        \" \",\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                            ...pageProps\n                        }, void 0, false, {\n                            fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n                            lineNumber: 32,\n                            columnNumber: 24\n                        }, this),\n                        \" \"\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n                    lineNumber: 32,\n                    columnNumber: 4\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n            lineNumber: 25,\n            columnNumber: 1\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n        lineNumber: 24,\n        columnNumber: 8\n    }, this);\n}\n_s(MyApp, \"9UYXVebxPSyMxbc85qiikRQSwmU=\");\n_c = MyApp;\nvar _c;\n$RefreshReg$(_c, \"MyApp\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQzRCO0FBQ3dCO0FBQ1o7QUFDdUI7QUFDWDtBQUVyQyxTQUFTSSxNQUFNLEtBQWtDO1FBQWxDLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZLEdBQWxDOztJQUU5QixNQUFNLENBQUNDLFlBQVlDLGNBQWMsR0FBR0wsK0NBQVFBLENBQUM7SUFDN0MsTUFBTSxDQUFDTSxTQUFTQyxXQUFXLEdBQUdQLCtDQUFRQSxDQUFDO0lBRXZDLE1BQU1RLGlCQUFpQixDQUFDQztRQUN4QkosY0FBY0k7SUFDZDtJQUNBLE1BQU1DLGVBQWUsQ0FBQ0Q7UUFDdEJGLFdBQVdFO0lBQ1g7SUFFQSxnQ0FBZ0M7SUFDaENWLGlFQUFnQkEsQ0FBQyxrQkFBa0JTO0lBQ25DVCxpRUFBZ0JBLENBQUMsZ0JBQWdCVztJQUVqQyxxQkFBTyw4REFBQ0M7UUFBSUMsV0FBVTtrQkFDdEIsNEVBQUNEO1lBQUlFLE9BQU87Z0JBQUVDLE9BQU87Z0JBQVFDLFFBQVE7WUFBTTs7OEJBQ3hDLDhEQUFDakIsd0RBQVNBO29CQUNSa0IsV0FBVyxNQUFLWjtvQkFDaEJhLFdBQVc7d0JBQUM7d0JBQUs7d0JBQUs7cUJBQUk7b0JBQzFCQyxhQUFhLE1BQUtkO29CQUNsQmUsaUJBQWlCYjs7Ozs7OzhCQUVuQiw4REFBQ1QsNERBQWVBOzt3QkFBQztzQ0FBRyw4REFBQ0s7NEJBQVcsR0FBR0MsU0FBUzs7Ozs7O3dCQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJcEQ7R0E1QndCRjtLQUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnXG5pbXBvcnQgJy4uL3N0eWxlcy9pbmRleC5jc3MnXG5pbXBvcnQgeyBTZXNzaW9uUHJvdmlkZXIgfSBmcm9tICcuLi9zdG9ja2VyU2Vzc2lvbic7XG5pbXBvcnQgU3RhcmZpZWxkIGZyb20gJ3JlYWN0LXN0YXJmaWVsZCc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb0V2ZW50LCBlbWl0RXZlbnQgfSBmcm9tICcuLi9jb250ZXh0cy9zdG9yZSdcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuXG5jb25zdCBbbXlWYXJpYWJsZSwgc2V0TXlWYXJpYWJsZV0gPSB1c2VTdGF0ZSgxKTtcbmNvbnN0IFtteUNvbG9yLCBzZXRNeUNvbG9yXSA9IHVzZVN0YXRlKFwiYmxhY2tcIik7XG5cbmNvbnN0IHVwZGF0ZVZhcmlhYmxlID0gKG5ld1ZhbHVlKSA9PiB7XG5zZXRNeVZhcmlhYmxlKG5ld1ZhbHVlKTtcbn07XG5jb25zdCB1cGRhdGVDb2xvcnMgPSAobmV3VmFsdWUpID0+IHtcbnNldE15Q29sb3IobmV3VmFsdWUpO1xufTtcblxuLy8gU3Vic2NyaWJlIHRvIHRoZSBjdXN0b20gZXZlbnRcbnN1YnNjcmliZVRvRXZlbnQoJ3VwZGF0ZVZhcmlhYmxlJywgdXBkYXRlVmFyaWFibGUpO1xuc3Vic2NyaWJlVG9FdmVudCgndXBkYXRlQ29sb3JzJywgdXBkYXRlQ29sb3JzKTtcblxucmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiQXBwXCI+XG48ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnfX0+XG4gICA8U3RhcmZpZWxkXG4gICAgIHN0YXJDb3VudD17MTUwKihteVZhcmlhYmxlKX1cbiAgICAgc3RhckNvbG9yPXtbMjU1LCAyNTUsIDI1NV19XG4gICAgIHNwZWVkRmFjdG9yPXswLjEqKG15VmFyaWFibGUpfVxuICAgICBiYWNrZ3JvdW5kQ29sb3I9e215Q29sb3J9XG4gICAvPlxuICAgPFNlc3Npb25Qcm92aWRlcj4geyA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+fSA8L1Nlc3Npb25Qcm92aWRlcj5cbiA8L2Rpdj5cbiA8L2Rpdj5cblxufVxuIl0sIm5hbWVzIjpbIlNlc3Npb25Qcm92aWRlciIsIlN0YXJmaWVsZCIsInN1YnNjcmliZVRvRXZlbnQiLCJ1c2VTdGF0ZSIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwibXlWYXJpYWJsZSIsInNldE15VmFyaWFibGUiLCJteUNvbG9yIiwic2V0TXlDb2xvciIsInVwZGF0ZVZhcmlhYmxlIiwibmV3VmFsdWUiLCJ1cGRhdGVDb2xvcnMiLCJkaXYiLCJjbGFzc05hbWUiLCJzdHlsZSIsIndpZHRoIiwiaGVpZ2h0Iiwic3RhckNvdW50Iiwic3RhckNvbG9yIiwic3BlZWRGYWN0b3IiLCJiYWNrZ3JvdW5kQ29sb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n"));

/***/ })

});