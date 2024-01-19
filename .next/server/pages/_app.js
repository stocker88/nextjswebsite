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

/***/ "./contexts/store.js":
/*!***************************!*\
  !*** ./contexts/store.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   emitEvent: () => (/* binding */ emitEvent),\n/* harmony export */   subscribeToEvent: () => (/* binding */ subscribeToEvent)\n/* harmony export */ });\n// eventHandler.js\nconst eventHandlers = {};\nconst subscribeToEvent = (eventName, callback)=>{\n    if (!eventHandlers[eventName]) {\n        eventHandlers[eventName] = [];\n    }\n    eventHandlers[eventName].push(callback);\n};\nconst emitEvent = (eventName, data)=>{\n    const handlers = eventHandlers[eventName];\n    if (handlers) {\n        handlers.forEach((handler)=>handler(data));\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0cy9zdG9yZS5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtCQUFrQjtBQUNsQixNQUFNQSxnQkFBZ0IsQ0FBQztBQUVoQixNQUFNQyxtQkFBbUIsQ0FBQ0MsV0FBV0M7SUFDMUMsSUFBSSxDQUFDSCxhQUFhLENBQUNFLFVBQVUsRUFBRTtRQUM3QkYsYUFBYSxDQUFDRSxVQUFVLEdBQUcsRUFBRTtJQUMvQjtJQUNBRixhQUFhLENBQUNFLFVBQVUsQ0FBQ0UsSUFBSSxDQUFDRDtBQUNoQyxFQUFFO0FBRUssTUFBTUUsWUFBWSxDQUFDSCxXQUFXSTtJQUNuQyxNQUFNQyxXQUFXUCxhQUFhLENBQUNFLFVBQVU7SUFDekMsSUFBSUssVUFBVTtRQUNaQSxTQUFTQyxPQUFPLENBQUMsQ0FBQ0MsVUFBWUEsUUFBUUg7SUFDeEM7QUFDRixFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vY29udGV4dHMvc3RvcmUuanM/NTc5MCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBldmVudEhhbmRsZXIuanNcbmNvbnN0IGV2ZW50SGFuZGxlcnMgPSB7fTtcblxuZXhwb3J0IGNvbnN0IHN1YnNjcmliZVRvRXZlbnQgPSAoZXZlbnROYW1lLCBjYWxsYmFjaykgPT4ge1xuICBpZiAoIWV2ZW50SGFuZGxlcnNbZXZlbnROYW1lXSkge1xuICAgIGV2ZW50SGFuZGxlcnNbZXZlbnROYW1lXSA9IFtdO1xuICB9XG4gIGV2ZW50SGFuZGxlcnNbZXZlbnROYW1lXS5wdXNoKGNhbGxiYWNrKTtcbn07XG5cbmV4cG9ydCBjb25zdCBlbWl0RXZlbnQgPSAoZXZlbnROYW1lLCBkYXRhKSA9PiB7XG4gIGNvbnN0IGhhbmRsZXJzID0gZXZlbnRIYW5kbGVyc1tldmVudE5hbWVdO1xuICBpZiAoaGFuZGxlcnMpIHtcbiAgICBoYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiBoYW5kbGVyKGRhdGEpKTtcbiAgfVxufTtcbiJdLCJuYW1lcyI6WyJldmVudEhhbmRsZXJzIiwic3Vic2NyaWJlVG9FdmVudCIsImV2ZW50TmFtZSIsImNhbGxiYWNrIiwicHVzaCIsImVtaXRFdmVudCIsImRhdGEiLCJoYW5kbGVycyIsImZvckVhY2giLCJoYW5kbGVyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./contexts/store.js\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/index.css */ \"./styles/index.css\");\n/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_index_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _stockerSession__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../stockerSession */ \"./stockerSession.tsx\");\n/* harmony import */ var react_starfield__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-starfield */ \"react-starfield\");\n/* harmony import */ var react_starfield__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_starfield__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _contexts_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contexts/store */ \"./contexts/store.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    const [myVariable, setMyVariable] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(1);\n    const [myColor, setMyColor] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(\"black\");\n    const updateVariable = (newValue)=>{\n        setMyVariable(newValue);\n    };\n    const updateColors = (newValue)=>{\n        setMyColor(newValue);\n    };\n    // Subscribe to the custom event\n    (0,_contexts_store__WEBPACK_IMPORTED_MODULE_4__.subscribeToEvent)(\"updateVariable\", updateVariable);\n    (0,_contexts_store__WEBPACK_IMPORTED_MODULE_4__.subscribeToEvent)(\"updateColors\", updateColors);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"App\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((react_starfield__WEBPACK_IMPORTED_MODULE_3___default()), {\n                starCount: 1000 * myVariable,\n                starColor: [\n                    255,\n                    255,\n                    255\n                ],\n                speedFactor: 0.17 * myVariable,\n                backgroundColor: myColor\n            }, void 0, false, {\n                fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n                lineNumber: 25,\n                columnNumber: 16\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_stockerSession__WEBPACK_IMPORTED_MODULE_2__.SessionProvider, {\n                children: [\n                    \" \",\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                        ...pageProps\n                    }, void 0, false, {\n                        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n                        lineNumber: 31,\n                        columnNumber: 36\n                    }, this),\n                    \" \"\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n                lineNumber: 31,\n                columnNumber: 16\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n        lineNumber: 24,\n        columnNumber: 10\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDNEI7QUFDd0I7QUFDWjtBQUN1QjtBQUNuQjtBQUU3QixTQUFTSSxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBRWhFLE1BQU0sQ0FBQ0MsWUFBWUMsY0FBYyxHQUFHTCwrQ0FBUUEsQ0FBQztJQUM3QyxNQUFNLENBQUNNLFNBQVNDLFdBQVcsR0FBR1AsK0NBQVFBLENBQUM7SUFFckMsTUFBTVEsaUJBQWlCLENBQUNDO1FBQ3RCSixjQUFjSTtJQUNoQjtJQUNBLE1BQU1DLGVBQWUsQ0FBQ0Q7UUFDcEJGLFdBQVdFO0lBQ2I7SUFFQSxnQ0FBZ0M7SUFDaENWLGlFQUFnQkEsQ0FBQyxrQkFBa0JTO0lBQ25DVCxpRUFBZ0JBLENBQUMsZ0JBQWdCVztJQUVqQyxxQkFBTyw4REFBQ0M7UUFBSUMsV0FBVTs7MEJBQ1QsOERBQUNkLHdEQUFTQTtnQkFDUmUsV0FBVyxPQUFNVDtnQkFDakJVLFdBQVc7b0JBQUM7b0JBQUs7b0JBQUs7aUJBQUk7Z0JBQzFCQyxhQUFhLE9BQU1YO2dCQUNuQlksaUJBQWlCVjs7Ozs7OzBCQUVuQiw4REFBQ1QsNERBQWVBOztvQkFBQztrQ0FBRyw4REFBQ0s7d0JBQVcsR0FBR0MsU0FBUzs7Ozs7O29CQUFLOzs7Ozs7Ozs7Ozs7O0FBRWhFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJ1xuaW1wb3J0ICcuLi9zdHlsZXMvaW5kZXguY3NzJ1xuaW1wb3J0IHsgU2Vzc2lvblByb3ZpZGVyIH0gZnJvbSAnLi4vc3RvY2tlclNlc3Npb24nO1xuaW1wb3J0IFN0YXJmaWVsZCBmcm9tICdyZWFjdC1zdGFyZmllbGQnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9FdmVudCwgZW1pdEV2ZW50IH0gZnJvbSAnLi4vY29udGV4dHMvc3RvcmUnXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XG5cbmNvbnN0IFtteVZhcmlhYmxlLCBzZXRNeVZhcmlhYmxlXSA9IHVzZVN0YXRlKDEpO1xuY29uc3QgW215Q29sb3IsIHNldE15Q29sb3JdID0gdXNlU3RhdGUoXCJibGFja1wiKTtcblxuICBjb25zdCB1cGRhdGVWYXJpYWJsZSA9IChuZXdWYWx1ZSkgPT4ge1xuICAgIHNldE15VmFyaWFibGUobmV3VmFsdWUpO1xuICB9O1xuICBjb25zdCB1cGRhdGVDb2xvcnMgPSAobmV3VmFsdWUpID0+IHtcbiAgICBzZXRNeUNvbG9yKG5ld1ZhbHVlKTtcbiAgfTtcblxuICAvLyBTdWJzY3JpYmUgdG8gdGhlIGN1c3RvbSBldmVudFxuICBzdWJzY3JpYmVUb0V2ZW50KCd1cGRhdGVWYXJpYWJsZScsIHVwZGF0ZVZhcmlhYmxlKTtcbiAgc3Vic2NyaWJlVG9FdmVudCgndXBkYXRlQ29sb3JzJywgdXBkYXRlQ29sb3JzKTtcblxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJBcHBcIj5cbiAgICAgICAgICAgICAgIDxTdGFyZmllbGRcbiAgICAgICAgICAgICAgICAgc3RhckNvdW50PXsxMDAwKihteVZhcmlhYmxlKX1cbiAgICAgICAgICAgICAgICAgc3RhckNvbG9yPXtbMjU1LCAyNTUsIDI1NV19XG4gICAgICAgICAgICAgICAgIHNwZWVkRmFjdG9yPXswLjE3KihteVZhcmlhYmxlKX1cbiAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yPXtteUNvbG9yfVxuICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgIDxTZXNzaW9uUHJvdmlkZXI+IHsgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPn0gPC9TZXNzaW9uUHJvdmlkZXI+XG4gICAgICAgICAgICAgPC9kaXY+XG59XG4iXSwibmFtZXMiOlsiU2Vzc2lvblByb3ZpZGVyIiwiU3RhcmZpZWxkIiwic3Vic2NyaWJlVG9FdmVudCIsInVzZVN0YXRlIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJteVZhcmlhYmxlIiwic2V0TXlWYXJpYWJsZSIsIm15Q29sb3IiLCJzZXRNeUNvbG9yIiwidXBkYXRlVmFyaWFibGUiLCJuZXdWYWx1ZSIsInVwZGF0ZUNvbG9ycyIsImRpdiIsImNsYXNzTmFtZSIsInN0YXJDb3VudCIsInN0YXJDb2xvciIsInNwZWVkRmFjdG9yIiwiYmFja2dyb3VuZENvbG9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

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

/***/ "react-starfield":
/*!**********************************!*\
  !*** external "react-starfield" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-starfield");

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