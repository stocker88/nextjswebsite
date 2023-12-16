/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/index.css */ \"./styles/index.css\");\n/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_index_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _stockerSession__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../stockerSession */ \"./stockerSession.tsx\");\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_stockerSession__WEBPACK_IMPORTED_MODULE_2__.SessionProvider, {\n        children: [\n            \" \",\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n                lineNumber: 6,\n                columnNumber: 30\n            }, this),\n            \" \"\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n        lineNumber: 6,\n        columnNumber: 10\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQzRCO0FBQ3dCO0FBRXJDLFNBQVNDLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDOUQscUJBQU8sOERBQUNILDREQUFlQTs7WUFBQzswQkFBRyw4REFBQ0U7Z0JBQVcsR0FBR0MsU0FBUzs7Ozs7O1lBQUs7Ozs7Ozs7QUFDMUQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnXG5pbXBvcnQgJy4uL3N0eWxlcy9pbmRleC5jc3MnXG5pbXBvcnQgeyBTZXNzaW9uUHJvdmlkZXIgfSBmcm9tICcuLi9zdG9ja2VyU2Vzc2lvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgcmV0dXJuIDxTZXNzaW9uUHJvdmlkZXI+IHsgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPn0gPC9TZXNzaW9uUHJvdmlkZXI+XG59XG4iXSwibmFtZXMiOlsiU2Vzc2lvblByb3ZpZGVyIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./stockerSession.tsx":
/*!****************************!*\
  !*** ./stockerSession.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SessionProvider: () => (/* binding */ SessionProvider),\n/* harmony export */   useSession: () => (/* binding */ useSession)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst SessionContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);\nconst SessionProvider = ({ children })=>{\n    const [sessionData, setSessionData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        email: \"\",\n        sessionId: \"\"\n    });\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(SessionContext.Provider, {\n        value: {\n            sessionData,\n            setSessionData\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/stockerSession.tsx\",\n        lineNumber: 20,\n        columnNumber: 5\n    }, undefined);\n};\nconst useSession = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(SessionContext);\n    if (!context) {\n        throw new Error(\"useSession must be used within a SessionProvider\");\n    }\n    return context;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdG9ja2VyU2Vzc2lvbi50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFtRTtBQWFuRSxNQUFNSSwrQkFBaUJILG9EQUFhQSxDQUE2QjtBQUUxRCxNQUFNSSxrQkFBMkQsQ0FBQyxFQUFFQyxRQUFRLEVBQUU7SUFDbkYsTUFBTSxDQUFDQyxhQUFhQyxlQUFlLEdBQUdOLCtDQUFRQSxDQUFjO1FBQUVPLE9BQU87UUFBSUMsV0FBVztJQUFHO0lBRXZGLHFCQUNFLDhEQUFDTixlQUFlTyxRQUFRO1FBQUNDLE9BQU87WUFBRUw7WUFBYUM7UUFBZTtrQkFDM0RGOzs7Ozs7QUFHUCxFQUFFO0FBRUssTUFBTU8sYUFBYTtJQUN4QixNQUFNQyxVQUFVWCxpREFBVUEsQ0FBQ0M7SUFDM0IsSUFBSSxDQUFDVSxTQUFTO1FBQ1osTUFBTSxJQUFJQyxNQUFNO0lBQ2xCO0lBQ0EsT0FBT0Q7QUFDVCxFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3RvY2tlclNlc3Npb24udHN4PzEzNDIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuXG5pbnRlcmZhY2UgU2Vzc2lvbkRhdGEge1xuICBlbWFpbDogc3RyaW5nO1xuICBzZXNzaW9uSWQ6IHN0cmluZztcbiAgLy8gLi4uIG90aGVyIHByb3BlcnRpZXNcbn1cblxuaW50ZXJmYWNlIFNlc3Npb25Db250ZXh0UHJvcHMge1xuICBzZXNzaW9uRGF0YTogU2Vzc2lvbkRhdGE7XG4gIHNldFNlc3Npb25EYXRhOiBSZWFjdC5EaXNwYXRjaDxSZWFjdC5TZXRTdGF0ZUFjdGlvbjxTZXNzaW9uRGF0YT4+O1xufVxuXG5jb25zdCBTZXNzaW9uQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8U2Vzc2lvbkNvbnRleHRQcm9wcyB8IG51bGw+KG51bGwpO1xuXG5leHBvcnQgY29uc3QgU2Vzc2lvblByb3ZpZGVyOiBSZWFjdC5GQzx7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUgfT4gPSAoeyBjaGlsZHJlbiB9KSA9PiB7XG4gIGNvbnN0IFtzZXNzaW9uRGF0YSwgc2V0U2Vzc2lvbkRhdGFdID0gdXNlU3RhdGU8U2Vzc2lvbkRhdGE+KHsgZW1haWw6ICcnLCBzZXNzaW9uSWQ6ICcnIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPFNlc3Npb25Db250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHNlc3Npb25EYXRhLCBzZXRTZXNzaW9uRGF0YSB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1Nlc3Npb25Db250ZXh0LlByb3ZpZGVyPlxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IHVzZVNlc3Npb24gPSAoKTogeyBzZXNzaW9uRGF0YTogU2Vzc2lvbkRhdGE7IHNldFNlc3Npb25EYXRhOiBSZWFjdC5EaXNwYXRjaDxSZWFjdC5TZXRTdGF0ZUFjdGlvbjxTZXNzaW9uRGF0YT4+IH0gPT4gIHtcbiAgY29uc3QgY29udGV4dCA9IHVzZUNvbnRleHQoU2Vzc2lvbkNvbnRleHQpO1xuICBpZiAoIWNvbnRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVNlc3Npb24gbXVzdCBiZSB1c2VkIHdpdGhpbiBhIFNlc3Npb25Qcm92aWRlcicpO1xuICB9XG4gIHJldHVybiBjb250ZXh0O1xufTtcbiJdLCJuYW1lcyI6WyJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VTdGF0ZSIsInVzZUNvbnRleHQiLCJTZXNzaW9uQ29udGV4dCIsIlNlc3Npb25Qcm92aWRlciIsImNoaWxkcmVuIiwic2Vzc2lvbkRhdGEiLCJzZXRTZXNzaW9uRGF0YSIsImVtYWlsIiwic2Vzc2lvbklkIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZVNlc3Npb24iLCJjb250ZXh0IiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./stockerSession.tsx\n");

/***/ }),

/***/ "./styles/index.css":
/*!**************************!*\
  !*** ./styles/index.css ***!
  \**************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();