"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./components/cover-image.tsx":
/*!************************************!*\
  !*** ./components/cover-image.tsx ***!
  \************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ \"./node_modules/classnames/index.js\");\n/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ \"./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/image */ \"./node_modules/next/image.js\");\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nconst CoverImage = (param)=>{\n    let { title, src, slug } = param;\n    const image = /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"center\", {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_image__WEBPACK_IMPORTED_MODULE_3___default()), {\n            src: src,\n            alt: \"Cover Image for \".concat(title),\n            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(\"shadow-sm w-full\", {\n                \"hover:shadow-lg transition-shadow duration-200\": slug\n            }),\n            style: {\n                \"borderRadius\": \"10px 10px 10px 10px\"\n            },\n            width: max(1300, \"1000px\"),\n            height: 630,\n            style: {\n                maxWidth: \"1000px\"\n            },\n            unoptimized: true\n        }, void 0, false, {\n            fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/cover-image.tsx\",\n            lineNumber: 14,\n            columnNumber: 5\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/cover-image.tsx\",\n        lineNumber: 13,\n        columnNumber: 3\n    }, undefined);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"sm:mx-0\",\n        children: slug ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {\n            as: \"/posts/\".concat(slug),\n            href: \"/posts/[slug]\",\n            \"aria-label\": title,\n            children: image\n        }, void 0, false, {\n            fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/cover-image.tsx\",\n            lineNumber: 31,\n            columnNumber: 9\n        }, undefined) : image\n    }, void 0, false, {\n        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/cover-image.tsx\",\n        lineNumber: 29,\n        columnNumber: 5\n    }, undefined);\n};\n_c = CoverImage;\n/* harmony default export */ __webpack_exports__[\"default\"] = (CoverImage);\nvar _c;\n$RefreshReg$(_c, \"CoverImage\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL2NvdmVyLWltYWdlLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQTJCO0FBQ0M7QUFDRTtBQVE5QixNQUFNRyxhQUFhO1FBQUMsRUFBRUMsS0FBSyxFQUFFQyxHQUFHLEVBQUVDLElBQUksRUFBUztJQUM3QyxNQUFNQyxzQkFDTiw4REFBQ0M7a0JBQ0MsNEVBQUNOLG1EQUFLQTtZQUNKRyxLQUFLQTtZQUNMSSxLQUFLLG1CQUF5QixPQUFOTDtZQUN4Qk0sV0FBV1YsaURBQUVBLENBQUMsb0JBQW9CO2dCQUNoQyxrREFBa0RNO1lBQ3BEO1lBQ0FLLE9BQU87Z0JBQUMsZ0JBQWdCO1lBQXFCO1lBQzdDQyxPQUFPQyxJQUFJLE1BQUs7WUFDaEJDLFFBQVE7WUFDUkgsT0FBTztnQkFBQ0ksVUFBUztZQUFRO1lBQ3pCQyxhQUFhOzs7Ozs7Ozs7OztJQUlqQixxQkFDRSw4REFBQ0M7UUFBSVAsV0FBVTtrQkFDWkoscUJBQ0MsOERBQUNMLGtEQUFJQTtZQUFDaUIsSUFBSSxVQUFlLE9BQUxaO1lBQVFhLE1BQUs7WUFBZ0JDLGNBQVloQjtzQkFDMURHOzs7Ozt3QkFHSEE7Ozs7OztBQUlSO0tBNUJNSjtBQThCTiwrREFBZUEsVUFBVUEsRUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL2NvdmVyLWltYWdlLnRzeD8wZmRjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbiBmcm9tICdjbGFzc25hbWVzJ1xuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJ1xuaW1wb3J0IEltYWdlIGZyb20gJ25leHQvaW1hZ2UnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIHRpdGxlOiBzdHJpbmdcbiAgc3JjOiBzdHJpbmdcbiAgc2x1Zz86IHN0cmluZ1xufVxuXG5jb25zdCBDb3ZlckltYWdlID0gKHsgdGl0bGUsIHNyYywgc2x1ZyB9OiBQcm9wcykgPT4ge1xuICBjb25zdCBpbWFnZSA9IChcbiAgPGNlbnRlcj5cbiAgICA8SW1hZ2VcbiAgICAgIHNyYz17c3JjfVxuICAgICAgYWx0PXtgQ292ZXIgSW1hZ2UgZm9yICR7dGl0bGV9YH1cbiAgICAgIGNsYXNzTmFtZT17Y24oJ3NoYWRvdy1zbSB3LWZ1bGwnLCB7XG4gICAgICAgICdob3ZlcjpzaGFkb3ctbGcgdHJhbnNpdGlvbi1zaGFkb3cgZHVyYXRpb24tMjAwJzogc2x1ZyxcbiAgICAgIH0pfVxuICAgICAgc3R5bGU9e3snYm9yZGVyUmFkaXVzJzogJzEwcHggMTBweCAxMHB4IDEwcHgnfX1cbiAgICAgIHdpZHRoPXttYXgoMTMwMCwnMTAwMHB4Jyl9XG4gICAgICBoZWlnaHQ9ezYzMH1cbiAgICAgIHN0eWxlPXt7bWF4V2lkdGg6JzEwMDBweCd9fVxuICAgICAgdW5vcHRpbWl6ZWQ9e3RydWV9XG4gICAgLz5cbiAgICA8L2NlbnRlcj5cbiAgKVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic206bXgtMFwiPlxuICAgICAge3NsdWcgPyAoXG4gICAgICAgIDxMaW5rIGFzPXtgL3Bvc3RzLyR7c2x1Z31gfSBocmVmPVwiL3Bvc3RzL1tzbHVnXVwiIGFyaWEtbGFiZWw9e3RpdGxlfT5cbiAgICAgICAgICB7aW1hZ2V9XG4gICAgICAgIDwvTGluaz5cbiAgICAgICkgOiAoXG4gICAgICAgIGltYWdlXG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvdmVySW1hZ2VcbiJdLCJuYW1lcyI6WyJjbiIsIkxpbmsiLCJJbWFnZSIsIkNvdmVySW1hZ2UiLCJ0aXRsZSIsInNyYyIsInNsdWciLCJpbWFnZSIsImNlbnRlciIsImFsdCIsImNsYXNzTmFtZSIsInN0eWxlIiwid2lkdGgiLCJtYXgiLCJoZWlnaHQiLCJtYXhXaWR0aCIsInVub3B0aW1pemVkIiwiZGl2IiwiYXMiLCJocmVmIiwiYXJpYS1sYWJlbCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/cover-image.tsx\n"));

/***/ })

});