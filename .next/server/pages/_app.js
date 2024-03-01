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
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/index.css */ \"./styles/index.css\");\n/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_index_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _stockerSession__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../stockerSession */ \"./stockerSession.tsx\");\n/* harmony import */ var react_starfield__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-starfield */ \"react-starfield\");\n/* harmony import */ var react_starfield__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_starfield__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _contexts_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../contexts/store */ \"./contexts/store.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _react_spring_parallax__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @react-spring/parallax */ \"@react-spring/parallax\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_react_spring_parallax__WEBPACK_IMPORTED_MODULE_6__]);\n_react_spring_parallax__WEBPACK_IMPORTED_MODULE_6__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    const [myVariable, setMyVariable] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(1);\n    const [myColor, setMyColor] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(\"black\");\n    const parallax = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(null);\n    const [numPages, setNumPages] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(1);\n    (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(()=>{\n        const calculateNumPages = ()=>{\n            const contentHeight = document.body.scrollHeight;\n            const viewportHeight = window.innerHeight;\n            const calculatedPages = Math.ceil(contentHeight / viewportHeight);\n            setNumPages(calculatedPages);\n        };\n        calculateNumPages();\n        // Re-calculate numPages when the window is resized\n        window.addEventListener(\"resize\", calculateNumPages);\n        return ()=>{\n            window.removeEventListener(\"resize\", calculateNumPages);\n        };\n    }, []);\n    const updateVariable = (newValue)=>{\n        setMyVariable(newValue);\n    };\n    const updateColors = (newValue)=>{\n        setMyColor(newValue);\n    };\n    // Subscribe to the custom event\n    (0,_contexts_store__WEBPACK_IMPORTED_MODULE_4__.subscribeToEvent)(\"updateVariable\", updateVariable);\n    (0,_contexts_store__WEBPACK_IMPORTED_MODULE_4__.subscribeToEvent)(\"updateColors\", updateColors);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"App\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            style: {\n                width: \"100%\",\n                height: \"100%\"\n            },\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_spring_parallax__WEBPACK_IMPORTED_MODULE_6__.Parallax, {\n                ref: parallax,\n                pages: numPages,\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((react_starfield__WEBPACK_IMPORTED_MODULE_3___default()), {\n                        starCount: 150 * myVariable,\n                        starColor: [\n                            255,\n                            255,\n                            255\n                        ],\n                        speedFactor: 0.1 * myVariable,\n                        backgroundColor: myColor\n                    }, void 0, false, {\n                        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n                        lineNumber: 45,\n                        columnNumber: 8\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_stockerSession__WEBPACK_IMPORTED_MODULE_2__.SessionProvider, {\n                        children: [\n                            \" \",\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                                ...pageProps\n                            }, void 0, false, {\n                                fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n                                lineNumber: 51,\n                                columnNumber: 28\n                            }, this),\n                            \" \"\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n                        lineNumber: 51,\n                        columnNumber: 8\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n                lineNumber: 44,\n                columnNumber: 7\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n            lineNumber: 43,\n            columnNumber: 3\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/pages/_app.tsx\",\n        lineNumber: 42,\n        columnNumber: 10\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQzRCO0FBQ3dCO0FBQ1o7QUFDdUI7QUFDWDtBQUN1QjtBQUM1RCxTQUFTTyxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQ2hFLE1BQU0sQ0FBQ0MsWUFBWUMsY0FBYyxHQUFHUiwrQ0FBUUEsQ0FBQztJQUM3QyxNQUFNLENBQUNTLFNBQVNDLFdBQVcsR0FBR1YsK0NBQVFBLENBQUM7SUFDdkMsTUFBTVcsV0FBV1QsNkNBQU1BLENBQVk7SUFDbkMsTUFBTSxDQUFDVSxVQUFVQyxZQUFZLEdBQUdiLCtDQUFRQSxDQUFTO0lBQ2pEQyxnREFBU0EsQ0FBQztRQUNSLE1BQU1hLG9CQUFvQjtZQUN4QixNQUFNQyxnQkFBZ0JDLFNBQVNDLElBQUksQ0FBQ0MsWUFBWTtZQUNoRCxNQUFNQyxpQkFBaUJDLE9BQU9DLFdBQVc7WUFDekMsTUFBTUMsa0JBQWtCQyxLQUFLQyxJQUFJLENBQUNULGdCQUFnQkk7WUFDbEROLFlBQVlTO1FBQ2Q7UUFFQVI7UUFFQSxtREFBbUQ7UUFDbkRNLE9BQU9LLGdCQUFnQixDQUFDLFVBQVVYO1FBRWxDLE9BQU87WUFDTE0sT0FBT00sbUJBQW1CLENBQUMsVUFBVVo7UUFDdkM7SUFDRixHQUFHLEVBQUU7SUFFSCxNQUFNYSxpQkFBaUIsQ0FBQ0M7UUFDdEJwQixjQUFjb0I7SUFDaEI7SUFDQSxNQUFNQyxlQUFlLENBQUNEO1FBQ3BCbEIsV0FBV2tCO0lBQ2I7SUFFQSxnQ0FBZ0M7SUFDaEM3QixpRUFBZ0JBLENBQUMsa0JBQWtCNEI7SUFDbkM1QixpRUFBZ0JBLENBQUMsZ0JBQWdCOEI7SUFFakMscUJBQU8sOERBQUNDO1FBQUlDLFdBQVU7a0JBQ3RCLDRFQUFDRDtZQUFJRSxPQUFPO2dCQUFFQyxPQUFPO2dCQUFRQyxRQUFRO1lBQU07c0JBQ3ZDLDRFQUFDL0IsNERBQVFBO2dCQUFDZ0MsS0FBS3hCO2dCQUFVeUIsT0FBT3hCOztrQ0FDL0IsOERBQUNkLHdEQUFTQTt3QkFDUnVDLFdBQVcsTUFBSzlCO3dCQUNoQitCLFdBQVc7NEJBQUM7NEJBQUs7NEJBQUs7eUJBQUk7d0JBQzFCQyxhQUFhLE1BQUtoQzt3QkFDbEJpQyxpQkFBaUIvQjs7Ozs7O2tDQUVuQiw4REFBQ1osNERBQWVBOzs0QkFBQzswQ0FBRyw4REFBQ1E7Z0NBQVcsR0FBR0MsU0FBUzs7Ozs7OzRCQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUt4RCIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCdcbmltcG9ydCAnLi4vc3R5bGVzL2luZGV4LmNzcydcbmltcG9ydCB7IFNlc3Npb25Qcm92aWRlciB9IGZyb20gJy4uL3N0b2NrZXJTZXNzaW9uJztcbmltcG9ydCBTdGFyZmllbGQgZnJvbSAncmVhY3Qtc3RhcmZpZWxkJztcbmltcG9ydCB7IHN1YnNjcmliZVRvRXZlbnQsIGVtaXRFdmVudCB9IGZyb20gJy4uL2NvbnRleHRzL3N0b3JlJ1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgUGFyYWxsYXgsIFBhcmFsbGF4TGF5ZXIsIElQYXJhbGxheCB9IGZyb20gJ0ByZWFjdC1zcHJpbmcvcGFyYWxsYXgnXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XG5jb25zdCBbbXlWYXJpYWJsZSwgc2V0TXlWYXJpYWJsZV0gPSB1c2VTdGF0ZSgxKTtcbmNvbnN0IFtteUNvbG9yLCBzZXRNeUNvbG9yXSA9IHVzZVN0YXRlKFwiYmxhY2tcIik7XG5jb25zdCBwYXJhbGxheCA9IHVzZVJlZjxJUGFyYWxsYXg+KG51bGwhKVxuY29uc3QgW251bVBhZ2VzLCBzZXROdW1QYWdlc10gPSB1c2VTdGF0ZTxudW1iZXI+KDEpO1xudXNlRWZmZWN0KCgpID0+IHtcbiAgY29uc3QgY2FsY3VsYXRlTnVtUGFnZXMgPSAoKSA9PiB7XG4gICAgY29uc3QgY29udGVudEhlaWdodCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0O1xuICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNvbnN0IGNhbGN1bGF0ZWRQYWdlcyA9IE1hdGguY2VpbChjb250ZW50SGVpZ2h0IC8gdmlld3BvcnRIZWlnaHQpO1xuICAgIHNldE51bVBhZ2VzKGNhbGN1bGF0ZWRQYWdlcyk7XG4gIH07XG5cbiAgY2FsY3VsYXRlTnVtUGFnZXMoKTtcblxuICAvLyBSZS1jYWxjdWxhdGUgbnVtUGFnZXMgd2hlbiB0aGUgd2luZG93IGlzIHJlc2l6ZWRcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNhbGN1bGF0ZU51bVBhZ2VzKTtcblxuICByZXR1cm4gKCkgPT4ge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjYWxjdWxhdGVOdW1QYWdlcyk7XG4gIH07XG59LCBbXSk7XG5cbiAgY29uc3QgdXBkYXRlVmFyaWFibGUgPSAobmV3VmFsdWUpID0+IHtcbiAgICBzZXRNeVZhcmlhYmxlKG5ld1ZhbHVlKTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlQ29sb3JzID0gKG5ld1ZhbHVlKSA9PiB7XG4gICAgc2V0TXlDb2xvcihuZXdWYWx1ZSk7XG4gIH07XG5cbiAgLy8gU3Vic2NyaWJlIHRvIHRoZSBjdXN0b20gZXZlbnRcbiAgc3Vic2NyaWJlVG9FdmVudCgndXBkYXRlVmFyaWFibGUnLCB1cGRhdGVWYXJpYWJsZSk7XG4gIHN1YnNjcmliZVRvRXZlbnQoJ3VwZGF0ZUNvbG9ycycsIHVwZGF0ZUNvbG9ycyk7XG5cbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiQXBwXCI+XG4gIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJSd9fT5cbiAgICAgIDxQYXJhbGxheCByZWY9e3BhcmFsbGF4fSBwYWdlcz17bnVtUGFnZXN9PlxuICAgICAgIDxTdGFyZmllbGRcbiAgICAgICAgIHN0YXJDb3VudD17MTUwKihteVZhcmlhYmxlKX1cbiAgICAgICAgIHN0YXJDb2xvcj17WzI1NSwgMjU1LCAyNTVdfVxuICAgICAgICAgc3BlZWRGYWN0b3I9ezAuMSoobXlWYXJpYWJsZSl9XG4gICAgICAgICBiYWNrZ3JvdW5kQ29sb3I9e215Q29sb3J9XG4gICAgICAgLz5cbiAgICAgICA8U2Vzc2lvblByb3ZpZGVyPiB7IDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz59IDwvU2Vzc2lvblByb3ZpZGVyPlxuICAgICA8L1BhcmFsbGF4PlxuICAgICA8L2Rpdj5cbiAgICAgPC9kaXY+XG5cbn1cbiJdLCJuYW1lcyI6WyJTZXNzaW9uUHJvdmlkZXIiLCJTdGFyZmllbGQiLCJzdWJzY3JpYmVUb0V2ZW50IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1c2VSZWYiLCJQYXJhbGxheCIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwibXlWYXJpYWJsZSIsInNldE15VmFyaWFibGUiLCJteUNvbG9yIiwic2V0TXlDb2xvciIsInBhcmFsbGF4IiwibnVtUGFnZXMiLCJzZXROdW1QYWdlcyIsImNhbGN1bGF0ZU51bVBhZ2VzIiwiY29udGVudEhlaWdodCIsImRvY3VtZW50IiwiYm9keSIsInNjcm9sbEhlaWdodCIsInZpZXdwb3J0SGVpZ2h0Iiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJjYWxjdWxhdGVkUGFnZXMiLCJNYXRoIiwiY2VpbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwidXBkYXRlVmFyaWFibGUiLCJuZXdWYWx1ZSIsInVwZGF0ZUNvbG9ycyIsImRpdiIsImNsYXNzTmFtZSIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJyZWYiLCJwYWdlcyIsInN0YXJDb3VudCIsInN0YXJDb2xvciIsInNwZWVkRmFjdG9yIiwiYmFja2dyb3VuZENvbG9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

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

/***/ }),

/***/ "@react-spring/parallax":
/*!*****************************************!*\
  !*** external "@react-spring/parallax" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@react-spring/parallax");;

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