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

/***/ "./components/formStocker.tsx":
/*!************************************!*\
  !*** ./components/formStocker.tsx ***!
  \************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/firestore */ \"./node_modules/firebase/firestore/dist/esm/index.esm.js\");\n/* harmony import */ var react_confetti_explosion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-confetti-explosion */ \"./node_modules/react-confetti-explosion/lib/index.esm.js\");\n/* harmony import */ var _elements_InstallButtonsWithQR__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./elements/InstallButtonsWithQR */ \"./components/elements/InstallButtonsWithQR.js\");\n/* harmony import */ var _stockerSession__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../stockerSession */ \"./stockerSession.tsx\");\n\nvar _s = $RefreshSig$();\n\n\n\n\n\n// TODO: Add SDKs for Firebase products that you want to use\n// https://firebase.google.com/docs/web/setup#available-libraries\n// Your web app's Firebase configuration\n// For Firebase JS SDK v7.20.0 and later, measurementId is optional\n\n\n\n//export db from other script and import it here\nfunction NewsletterSignUp() {\n    _s();\n    {}\n    const { sessionData, setSessionData } = (0,_stockerSession__WEBPACK_IMPORTED_MODULE_5__.useSession)();\n    const [input, setInput] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const [message, setMessage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const [deviceInfo, setDeviceInfo] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        userAgent: \"\",\n        platform: \"\",\n        language: \"\",\n        screenWidth: \"\",\n        screenHeight: \"\"\n    });\n    const [isExploding, setIsExploding] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [isSubmitted, setIsSubmitted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    let [showDropdown, setShowDropdown] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const fetchDeviceInfo = ()=>{\n        try {\n            // Get basic device information\n            setDeviceInfo({\n                ...deviceInfo,\n                userAgent: navigator.userAgent,\n                platform: navigator.platform,\n                language: navigator.language,\n                screenWidth: String(window.screen.width),\n                screenHeight: String(window.screen.height)\n            });\n        } catch (error) {\n            console.error(\"Error fetching device information:\", error);\n            // Set empty string ('') as default values if fetching device information fails\n            setDeviceInfo({\n                ...deviceInfo,\n                userAgent: \"\",\n                platform: \"\",\n                language: \"\",\n                screenWidth: \"\",\n                screenHeight: \"\"\n            });\n        }\n    };\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Fetch device information when the component mounts\n        fetchDeviceInfo();\n    }, []); // Empty dependency array ensures the effect runs only once after initial render\n    const inputHandler = (e)=>{\n        setInput(e.target.value);\n    };\n    const db = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getFirestore)();\n    const submitHandler = ()=>{\n        console.log(input);\n        //add to firebase\n        const dateTime = Date.now();\n        const unixTime = Math.floor(dateTime / 1000);\n        const sessionId = sessionData.sessionId || \"\";\n        const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);\n        const docId = sessionData.sessionId || deviceInfo.language + deviceInfo.platform + deviceInfo.screenWidth + deviceInfo.screenHeight + randomString;\n        (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.setDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.doc)(db, \"contactList\", docId), {\n            emailTime: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.serverTimestamp)(),\n            time: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.serverTimestamp)(),\n            unixTime: unixTime,\n            userAgent: deviceInfo.userAgent,\n            platform: deviceInfo.platform,\n            language: deviceInfo.language,\n            screenWidth: deviceInfo.screenWidth,\n            screenHeight: deviceInfo.screenHeight\n        }, {\n            merge: true\n        });\n        if (sessionId === \"\") {\n            setSessionData({\n                ...sessionData,\n                sessionId: docId\n            });\n        }\n        setShowDropdown(true);\n        setInput(\"\");\n        setIsSubmitted(true);\n        setIsExploding(true);\n        {}\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"center\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"br\", {}, void 0, false, {\n                fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/formStocker.tsx\",\n                lineNumber: 184,\n                columnNumber: 5\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                children: isExploding && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_confetti_explosion__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n                    width: 1600,\n                    particleCount: 350,\n                    duration: 4000,\n                    force: 0.8\n                }, void 0, false, {\n                    fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/formStocker.tsx\",\n                    lineNumber: 186,\n                    columnNumber: 23\n                }, this)\n            }, void 0, false),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                style: {\n                    \"background\": \"Linear-gradient(to right, #414345. #232526)\",\n                    \"display\": \"fixed\"\n                },\n                children: [\n                    isSubmitted === false && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        type: \"submit\",\n                        onClick: submitHandler,\n                        style: {\n                            \"paddingTop\": \"16px\",\n                            \"paddingBottom\": \"16px\",\n                            \"color\": \"black\",\n                            \"width\": \"31vw\",\n                            \"textAlign\": \"center\",\n                            \"fontSize\": \"min(20px,max(15px,2vw))\",\n                            \"borderRadius\": \"30px 30px 30px 30px\",\n                            \"background\": \"black\",\n                            \"maxWidth\": \"240px\",\n                            \"boxShadow\": \"0px 0px 5px rgba(0, 0, 0, 0.4)\"\n                        },\n                        children: [\n                            \"  \",\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"b\", {\n                                style: {\n                                    \"color\": \"white\",\n                                    \"textShadow\": \"0px 0px 4px rgba(0, 0, 0, 0.5)\"\n                                },\n                                children: \"Get the App →\"\n                            }, void 0, false, {\n                                fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/formStocker.tsx\",\n                                lineNumber: 208,\n                                columnNumber: 21\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/formStocker.tsx\",\n                        lineNumber: 195,\n                        columnNumber: 17\n                    }, this),\n                    showDropdown && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"center\", {\n                        children: [\n                            \" \",\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                                className: \"text-3xl md:text-4xl font-bold tracking-tighter leading-tight\",\n                                style: {\n                                    color: \"white\",\n                                    fontFamily: \"arial\",\n                                    lineHeight: 1.3,\n                                    textShadow: \"0px 0px 3px rgba(0, 0, 0, 1)\",\n                                    \"padding\": \"2rem\"\n                                },\n                                children: \"\\uD83D\\uDCB8 Start now receive the best stocks & crypto to buy \\uD83C\\uDF8A\"\n                            }, void 0, false, {\n                                fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/formStocker.tsx\",\n                                lineNumber: 212,\n                                columnNumber: 42\n                            }, this),\n                            \"    \"\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/formStocker.tsx\",\n                        lineNumber: 212,\n                        columnNumber: 33\n                    }, this),\n                    showDropdown && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_elements_InstallButtonsWithQR__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {}, void 0, false, {\n                        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/formStocker.tsx\",\n                        lineNumber: 215,\n                        columnNumber: 30\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/formStocker.tsx\",\n                lineNumber: 192,\n                columnNumber: 5\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/formStocker.tsx\",\n        lineNumber: 183,\n        columnNumber: 5\n    }, this);\n}\n_s(NewsletterSignUp, \"ZOXiyOkBDE5Sww7i5yVJP+Myy+c=\", false, function() {\n    return [\n        _stockerSession__WEBPACK_IMPORTED_MODULE_5__.useSession\n    ];\n});\n_c = NewsletterSignUp;\n/* harmony default export */ __webpack_exports__[\"default\"] = (NewsletterSignUp);\nvar _c;\n$RefreshReg$(_c, \"NewsletterSignUp\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ly9fTl9FLy4vY29tcG9uZW50cy9mb3JtU3RvY2tlci50c3g/OTgwYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBzZXJ2ZXJUaW1lc3RhbXAgfSBmcm9tIFwiZmlyZWJhc2UvZmlyZXN0b3JlXCI7XG5pbXBvcnQgQ29uZmV0dGlFeHBsb3Npb24gZnJvbSAncmVhY3QtY29uZmV0dGktZXhwbG9zaW9uJztcblxuaW1wb3J0IEluc3RhbGxCdXR0b25zV2l0aFFSIGZyb20gJy4vZWxlbWVudHMvSW5zdGFsbEJ1dHRvbnNXaXRoUVInO1xuaW1wb3J0IHsgZG9jLCBzZXREb2MgfSBmcm9tIFwiZmlyZWJhc2UvZmlyZXN0b3JlXCI7XG4vLyBUT0RPOiBBZGQgU0RLcyBmb3IgRmlyZWJhc2UgcHJvZHVjdHMgdGhhdCB5b3Ugd2FudCB0byB1c2Vcbi8vIGh0dHBzOi8vZmlyZWJhc2UuZ29vZ2xlLmNvbS9kb2NzL3dlYi9zZXR1cCNhdmFpbGFibGUtbGlicmFyaWVzXG5cbi8vIFlvdXIgd2ViIGFwcCdzIEZpcmViYXNlIGNvbmZpZ3VyYXRpb25cbi8vIEZvciBGaXJlYmFzZSBKUyBTREsgdjcuMjAuMCBhbmQgbGF0ZXIsIG1lYXN1cmVtZW50SWQgaXMgb3B0aW9uYWxcbmltcG9ydCAnZmlyZWJhc2UvZmlyZXN0b3JlJztcblxuaW1wb3J0IHtnZXRGaXJlc3RvcmV9IGZyb20gJ2ZpcmViYXNlL2ZpcmVzdG9yZSc7XG5pbXBvcnQgeyB1c2VTZXNzaW9uIH0gZnJvbSAnLi4vc3RvY2tlclNlc3Npb24nO1xuXG5cblxuXG4vL2V4cG9ydCBkYiBmcm9tIG90aGVyIHNjcmlwdCBhbmQgaW1wb3J0IGl0IGhlcmVcblxuZnVuY3Rpb24gTmV3c2xldHRlclNpZ25VcCgpe1xuey8qXG5jb25zdCBBbGVydCA9IHN0eWxlZC5wYFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBwYWRkaW5nOiAwLjRyZW07XG4gICAgbWFyZ2luOiAwLjVyZW07XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjsgZm9udC1zaXplOiAxLjJyZW07XG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSAoMjU1LCAyNTUsIDI1NSwgMC4yKTsgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDI1NSwgMCwgMC4xKTsgYmFja2Ryb3AtZmlsdGVyOiBibHVyICgxMHB4KTtcbiAgICB6LSBpbmRleDogMztcbmA7XG5cbmNvbnN0IEJ1dHRvbiA9IHN0eWxlZC5idXR0b25gXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHBhZGRpbmc6IDAuNHJlbTtcbiAgICBtYXJnaW46IDAuNXJlbTtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyOyBmb250LXNpemU6IDEuMnJlbTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhICgyNTUsIDI1NSwgMjU1LCAwLjIpOyBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMjU1LCAwLCAwLjEpOyBiYWNrZHJvcC1maWx0ZXI6IGJsdXIgKDEwcHgpO1xuICAgIHotIGluZGV4OiAzO1xuYDtcblxuY29uc3QgRm9ybSA9IHN0eWxlZC5mb3JtYFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBwYWRkaW5nOiAzcmVtOyBtaW4td2lkdGg6IDUwMHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICBib3gtc2hhZG93OiAwIDAgMzBweCAjMzMzO1xuICAgIGJhY2tncm91bmQ6IHJnYmEgKDI1NSwgMjU1LCAyNTUsIDAuMSk7XG4gICAgYm9yZGVyOiBzb2xpZCAxcHggcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpO1xuICAgIGJhY2tncm91ZC1jbGlwOiBwYWRkaW5nLWJveDtcbiAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMTBweCk7XG4gICAgei1pbmRleDoyO1xuYDtcblxuY29uc3QgSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gICAgcGFkZGluZzoxMHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDEwcHggMCAwIDEwcHg7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIHdpdGg6IDgwJTtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIGNvbG9yOiAjY2YxZDIyO1xuYDtcblxuXG5jb25zdCBDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xuYDtcbmNvbnN0IERpdiA9IHN0eWxlZC5kaXZgXG4gICAgaGVpZ2h0OiAxMDB2aDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZDogTGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCAjNDE0MzQ1LiAjMjMyNTI2KTtcbiAgICBvdmVyZmxvdzpoaWRkZW47XG5gO1xuKi99XG4gICAgY29uc3QgeyBzZXNzaW9uRGF0YSwgc2V0U2Vzc2lvbkRhdGEgfSA9IHVzZVNlc3Npb24oKTtcblxuICAgIGNvbnN0IFtpbnB1dCxzZXRJbnB1dF0gPSB1c2VTdGF0ZShcIlwiKTtcbiAgICBjb25zdCBbbWVzc2FnZSxzZXRNZXNzYWdlXSA9IHVzZVN0YXRlKFwiXCIpO1xuICAgIGNvbnN0IFtkZXZpY2VJbmZvLCBzZXREZXZpY2VJbmZvXSA9IHVzZVN0YXRlKHtcbiAgICAgICAgdXNlckFnZW50OiAnJyxcbiAgICAgICAgcGxhdGZvcm06ICcnLFxuICAgICAgICBsYW5ndWFnZTogJycsXG4gICAgICAgIHNjcmVlbldpZHRoOiAnJyxcbiAgICAgICAgc2NyZWVuSGVpZ2h0OiAnJyxcbiAgICAgICAgLy8gQWRkIG1vcmUgcHJvcGVydGllcyBiYXNlZCBvbiBhdmFpbGFibGUgYnJvd3NlciBBUElzXG4vLyAgICAgICAgIGxhdGl0dWRlOiBudWxsLFxuLy8gICAgICAgICBsb25naXR1ZGU6IG51bGwsXG4gICAgICB9KTtcbiAgICBjb25zdCBbaXNFeHBsb2RpbmcsIHNldElzRXhwbG9kaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbaXNTdWJtaXR0ZWQsIHNldElzU3VibWl0dGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICAgIGxldCBbc2hvd0Ryb3Bkb3duLCBzZXRTaG93RHJvcGRvd25dID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IGZldGNoRGV2aWNlSW5mbyA9ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBHZXQgYmFzaWMgZGV2aWNlIGluZm9ybWF0aW9uXG4gICAgICAgICAgc2V0RGV2aWNlSW5mbyh7XG4gICAgICAgICAgICAuLi5kZXZpY2VJbmZvLFxuICAgICAgICAgICAgdXNlckFnZW50OiBuYXZpZ2F0b3IudXNlckFnZW50LFxuICAgICAgICAgICAgcGxhdGZvcm06IG5hdmlnYXRvci5wbGF0Zm9ybSxcbiAgICAgICAgICAgIGxhbmd1YWdlOiBuYXZpZ2F0b3IubGFuZ3VhZ2UsXG4gICAgICAgICAgICBzY3JlZW5XaWR0aDogU3RyaW5nKHdpbmRvdy5zY3JlZW4ud2lkdGgpLFxuICAgICAgICAgICAgc2NyZWVuSGVpZ2h0OiBTdHJpbmcod2luZG93LnNjcmVlbi5oZWlnaHQpLFxuICAgICAgICAgICAgLy8gQWRkIG9yIHVwZGF0ZSBvdGhlciBwcm9wZXJ0aWVzIGFzIG5lZWRlZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIGRldmljZSBpbmZvcm1hdGlvbjonLCBlcnJvcik7XG4gICAgICAgICAgLy8gU2V0IGVtcHR5IHN0cmluZyAoJycpIGFzIGRlZmF1bHQgdmFsdWVzIGlmIGZldGNoaW5nIGRldmljZSBpbmZvcm1hdGlvbiBmYWlsc1xuICAgICAgICAgIHNldERldmljZUluZm8oe1xuICAgICAgICAgICAgLi4uZGV2aWNlSW5mbyxcbiAgICAgICAgICAgIHVzZXJBZ2VudDogJycsXG4gICAgICAgICAgICBwbGF0Zm9ybTogJycsXG4gICAgICAgICAgICBsYW5ndWFnZTogJycsXG4gICAgICAgICAgICBzY3JlZW5XaWR0aDogJycsXG4gICAgICAgICAgICBzY3JlZW5IZWlnaHQ6ICcnLFxuICAgICAgICAgICAgLy8gU2V0IG90aGVyIHByb3BlcnRpZXMgdG8gZW1wdHkgc3RyaW5ncyBhcyBuZWVkZWRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuXG4gICAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICAvLyBGZXRjaCBkZXZpY2UgaW5mb3JtYXRpb24gd2hlbiB0aGUgY29tcG9uZW50IG1vdW50c1xuICAgICAgICBmZXRjaERldmljZUluZm8oKTtcbiAgICAgIH0sIFtdKTsgLy8gRW1wdHkgZGVwZW5kZW5jeSBhcnJheSBlbnN1cmVzIHRoZSBlZmZlY3QgcnVucyBvbmx5IG9uY2UgYWZ0ZXIgaW5pdGlhbCByZW5kZXJcblxuXG4gICAgY29uc3QgaW5wdXRIYW5kbGVyID0gKGUpID0+IHtcbiAgICAgICAgc2V0SW5wdXQoZS50YXJnZXQudmFsdWUpO1xuICAgIH07XG4gICAgY29uc3QgZGIgPSBnZXRGaXJlc3RvcmUoKTtcblxuICAgIGNvbnN0IHN1Ym1pdEhhbmRsZXIgPSAoKT0+IHtcblxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbnB1dCk7XG4gICAgICAgICAgICAvL2FkZCB0byBmaXJlYmFzZVxuICAgICAgICAgICAgY29uc3QgZGF0ZVRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgY29uc3QgdW5peFRpbWUgPSBNYXRoLmZsb29yKGRhdGVUaW1lIC8gMTAwMCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb25JZCA9IHNlc3Npb25EYXRhLnNlc3Npb25JZCB8fCAnJztcblxuICAgICAgICAgICAgY29uc3QgcmFuZG9tU3RyaW5nID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygyMCkuc3Vic3RyaW5nKDIsIDE0KSArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMjApLnN1YnN0cmluZygyLCAxNCk7XG4gICAgICAgICAgICBjb25zdCBkb2NJZCA9IHNlc3Npb25EYXRhLnNlc3Npb25JZCB8fCBkZXZpY2VJbmZvLmxhbmd1YWdlICsgZGV2aWNlSW5mby5wbGF0Zm9ybSArIGRldmljZUluZm8uc2NyZWVuV2lkdGggKyBkZXZpY2VJbmZvLnNjcmVlbkhlaWdodCtyYW5kb21TdHJpbmc7XG5cbiAgICAgICAgICAgICBzZXREb2MoZG9jKGRiLCBcImNvbnRhY3RMaXN0XCIsIGRvY0lkKSwge1xuXG4gICAgICAgICAgICAgICAgZW1haWxUaW1lOiBzZXJ2ZXJUaW1lc3RhbXAoKSxcbiAgICAgICAgICAgICAgICB0aW1lOiBzZXJ2ZXJUaW1lc3RhbXAoKSxcbiAgICAgICAgICAgICAgICB1bml4VGltZTogdW5peFRpbWUsXG4gICAgICAgICAgICAgIHVzZXJBZ2VudDogZGV2aWNlSW5mby51c2VyQWdlbnQsXG4gICAgICAgICAgICAgIHBsYXRmb3JtOiBkZXZpY2VJbmZvLnBsYXRmb3JtLFxuICAgICAgICAgICAgICBsYW5ndWFnZTogZGV2aWNlSW5mby5sYW5ndWFnZSxcbiAgICAgICAgICAgICAgc2NyZWVuV2lkdGg6IGRldmljZUluZm8uc2NyZWVuV2lkdGgsXG4gICAgICAgICAgICAgIHNjcmVlbkhlaWdodDogZGV2aWNlSW5mby5zY3JlZW5IZWlnaHQsXG4gICAgICAgICAgICAgICAgfSwgeyBtZXJnZTogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgaWYgKHNlc3Npb25JZCA9PT0gJycpe1xuICAgICAgICAgICAgICAgIHNldFNlc3Npb25EYXRhKHsgLi4uc2Vzc2lvbkRhdGEsIHNlc3Npb25JZDogZG9jSWQgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFNob3dEcm9wZG93bih0cnVlKVxuICAgICAgICAgICAgc2V0SW5wdXQoXCJcIik7XG4gICAgICAgICAgICBzZXRJc1N1Ym1pdHRlZCh0cnVlKVxuICAgICAgICAgICAgc2V0SXNFeHBsb2RpbmcodHJ1ZSlcblxuICAgICAgICAgICB7LypcbiAgICAgICAgICAgc2V0TWVzc2FnZSg8SW5zdGFsbEJ1dHRvbnNXaXRoUVIvPik7XG4gICAgICAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZXRNZXNzYWdlKFwiXCIpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgMzAwMCxcbiAgICAgICAgICAgICkqL31cblxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgPGNlbnRlcj5cbiAgICA8YnI+PC9icj5cblxuICAgIDw+e2lzRXhwbG9kaW5nICYmIDxDb25mZXR0aUV4cGxvc2lvblxuICAgICAgICAgICAgICAgIHdpZHRoPXsxNjAwfVxuICAgICAgICAgICAgICAgIHBhcnRpY2xlQ291bnQ9ezM1MH0gLy8gRXF1aXZhbGVudCB0byBwYXJ0aWNsZUNvdW50XG4gICAgICAgICAgICAgICAgZHVyYXRpb249ezQwMDB9IC8vIEVxdWl2YWxlbnQgdG8gZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgZm9yY2U9ezAuOH0gLy8gRXF1aXZhbGVudCB0byBmb3JjZVxuICAgICAgICAgICAgICAgIC8+fTwvPlxuICAgIDxkaXYgc3R5bGU9e3snYmFja2dyb3VuZCc6ICdMaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICM0MTQzNDUuICMyMzI1MjYpJywgJ2Rpc3BsYXknOiAnZml4ZWQnfX0+XG5cbiAgICAgICAgICAgIHtpc1N1Ym1pdHRlZD09PWZhbHNlICYmXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtzdWJtaXRIYW5kbGVyfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICdwYWRkaW5nVG9wJzogJzE2cHgnLFxuICAgICAgICAgICAgICAncGFkZGluZ0JvdHRvbSc6ICcxNnB4JyxcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgICd3aWR0aCc6JzMxdncnLFxuICAgICAgICAgICAgICAndGV4dEFsaWduJzogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICdmb250U2l6ZSc6ICdtaW4oMjBweCxtYXgoMTVweCwydncpKScsXG4gICAgICAgICAgICAgICdib3JkZXJSYWRpdXMnOiAnMzBweCAzMHB4IDMwcHggMzBweCcsXG4gICAgICAgICAgICAgICdiYWNrZ3JvdW5kJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ21heFdpZHRoJzonMjQwcHgnLFxuICAgICAgICAgICAgICAnYm94U2hhZG93JzogJzBweCAwcHggNXB4IHJnYmEoMCwgMCwgMCwgMC40KScsXG4gICAgICAgICAgICAgICB9fT4gIDxiIHN0eWxlPXt7J2NvbG9yJzond2hpdGUnLCAndGV4dFNoYWRvdyc6ICcwcHggMHB4IDRweCByZ2JhKDAsIDAsIDAsIDAuNSknfX0+R2V0IHRoZSBBcHAg4oaSPC9iPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgIHtzaG93RHJvcGRvd24gJiYgICAgIDxjZW50ZXI+IDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBtZDp0ZXh0LTR4bCBmb250LWJvbGQgdHJhY2tpbmctdGlnaHRlciBsZWFkaW5nLXRpZ2h0XCIgc3R5bGU9e3sgY29sb3I6ICd3aGl0ZScsIGZvbnRGYW1pbHk6ICdhcmlhbCcsbGluZUhlaWdodDogMS4zLHRleHRTaGFkb3c6ICcwcHggMHB4IDNweCByZ2JhKDAsIDAsIDAsIDAuNSknLCAncGFkZGluZyc6ICcycmVtJyB9fSA+XG4gICAgICAgICAgICAgICAgICAgIPCfkrggU3RhcnQgbm93IHJlY2VpdmUgdGhlIGJlc3Qgc3RvY2tzICYgY3J5cHRvIHRvIGJ1eSDwn46KXG4gICAgICAgICAgICAgICAgPC9oMT4gICAgPC9jZW50ZXI+fVxuICAgICAgICAgICAge3Nob3dEcm9wZG93biAmJiA8SW5zdGFsbEJ1dHRvbnNXaXRoUVIvPn1cblxuXG4gICAgICAgICAgICB7LypcbiAgICAgICAgICAgIHttZXNzYWdlICYmIDxhbGVydD4ge21lc3NhZ2V9IDwvYWxlcnQ+fVxuICAgICAgICAgICAgKSovfVxuICAgIDwvZGl2PlxuICAgIDwvY2VudGVyPlxuICAgIClcblxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgTmV3c2xldHRlclNpZ25VcDsiXSwibmFtZXMiOlsidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJzZXJ2ZXJUaW1lc3RhbXAiLCJDb25mZXR0aUV4cGxvc2lvbiIsIkluc3RhbGxCdXR0b25zV2l0aFFSIiwiZG9jIiwic2V0RG9jIiwiZ2V0RmlyZXN0b3JlIiwidXNlU2Vzc2lvbiIsIk5ld3NsZXR0ZXJTaWduVXAiLCJzZXNzaW9uRGF0YSIsInNldFNlc3Npb25EYXRhIiwiaW5wdXQiLCJzZXRJbnB1dCIsIm1lc3NhZ2UiLCJzZXRNZXNzYWdlIiwiZGV2aWNlSW5mbyIsInNldERldmljZUluZm8iLCJ1c2VyQWdlbnQiLCJwbGF0Zm9ybSIsImxhbmd1YWdlIiwic2NyZWVuV2lkdGgiLCJzY3JlZW5IZWlnaHQiLCJpc0V4cGxvZGluZyIsInNldElzRXhwbG9kaW5nIiwiaXNTdWJtaXR0ZWQiLCJzZXRJc1N1Ym1pdHRlZCIsInNob3dEcm9wZG93biIsInNldFNob3dEcm9wZG93biIsImZldGNoRGV2aWNlSW5mbyIsIm5hdmlnYXRvciIsIlN0cmluZyIsIndpbmRvdyIsInNjcmVlbiIsIndpZHRoIiwiaGVpZ2h0IiwiZXJyb3IiLCJjb25zb2xlIiwiaW5wdXRIYW5kbGVyIiwiZSIsInRhcmdldCIsInZhbHVlIiwiZGIiLCJzdWJtaXRIYW5kbGVyIiwibG9nIiwiZGF0ZVRpbWUiLCJEYXRlIiwibm93IiwidW5peFRpbWUiLCJNYXRoIiwiZmxvb3IiLCJzZXNzaW9uSWQiLCJyYW5kb21TdHJpbmciLCJyYW5kb20iLCJ0b1N0cmluZyIsInN1YnN0cmluZyIsImRvY0lkIiwiZW1haWxUaW1lIiwidGltZSIsIm1lcmdlIiwiY2VudGVyIiwiYnIiLCJwYXJ0aWNsZUNvdW50IiwiZHVyYXRpb24iLCJmb3JjZSIsImRpdiIsInN0eWxlIiwiYnV0dG9uIiwidHlwZSIsIm9uQ2xpY2siLCJiIiwiaDEiLCJjbGFzc05hbWUiLCJjb2xvciIsImZvbnRGYW1pbHkiLCJsaW5lSGVpZ2h0IiwidGV4dFNoYWRvdyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/formStocker.tsx\n"));

/***/ })

});