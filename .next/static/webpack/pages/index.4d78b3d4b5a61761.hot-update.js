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

/***/ "./components/inspiration.tsx":
/*!************************************!*\
  !*** ./components/inspiration.tsx ***!
  \************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_confetti_explosion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-confetti-explosion */ \"./node_modules/react-confetti-explosion/lib/index.esm.js\");\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/firestore */ \"./node_modules/firebase/firestore/dist/esm/index.esm.js\");\n/* harmony import */ var _stockerSession__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../stockerSession */ \"./stockerSession.tsx\");\n\nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\n\nfunction QuoteDisplay() {\n    _s();\n    const db = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.getFirestore)();\n    const { sessionData, setSessionData } = (0,_stockerSession__WEBPACK_IMPORTED_MODULE_4__.useSession)();\n    const [quotes, setQuotes] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([\n        \"Opportunities in the stock market are like sunrises; if you wait too long, you'll miss them. - Warren Buffett\",\n        \"If you don't find a way to make money while you sleep, you will work until you die. - Warren Buffett\",\n        \"Use your money to make more money. - Robert Kiyosaki\",\n        \"Risk comes from not knowing what you're doing, always double check with an advisor. - Warren Buffett\",\n        \"The stock market is a device for making the money work. - Warren Buffett\",\n        \"Price is what you pay. Value is what you get. - Warren Buffett\",\n        \"Your net worth is determined by your network – the people you learn from and grow with. - Warren Buffett\",\n        \"A well-diversified portfolio is the shield that guards your financial future. - Benjamin Graham\",\n        \"The stock market doesn't discriminate; it's open to anyone willing to learn and take action. - Warren Buffett\",\n        \"Success in investing is built on a foundation of sound research and thoughtful decisions. - Warren Buffett\",\n        \"The market is a giant discount machine. When everything goes on sale, people run out of the store. – Mark Cuban\"\n    ]);\n    const fetchDeviceInfo = ()=>{\n        try {\n            // Get basic device information\n            setDeviceInfo({\n                ...deviceInfo,\n                userAgent: navigator.userAgent,\n                platform: navigator.platform,\n                language: navigator.language,\n                screenWidth: String(window.screen.width),\n                screenHeight: String(window.screen.height)\n            });\n        } catch (error) {\n            console.error(\"Error fetching device information:\", error);\n            // Set empty string ('') as default values if fetching device information fails\n            setDeviceInfo({\n                ...deviceInfo,\n                userAgent: \"\",\n                platform: \"\",\n                language: \"\",\n                screenWidth: \"\",\n                screenHeight: \"\"\n            });\n        }\n    };\n    const [deviceInfo, setDeviceInfo] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        userAgent: \"\",\n        platform: \"\",\n        language: \"\",\n        screenWidth: \"\",\n        screenHeight: \"\"\n    });\n    const [isExploding, setIsExploding] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [isSubmitted, setIsSubmitted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [currentQuoteIndex, setCurrentQuoteIndex] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);\n    const [numberClicks, setNumberClicks] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Fetch device information when the component mounts\n        fetchDeviceInfo();\n    }, []); // Empty dependency array ensures the effect runs only once after initial render\n    const generateRandomQuote = ()=>{\n        const newIndex = Math.floor(Math.random() * quotes.length);\n        setCurrentQuoteIndex(newIndex % quotes.length);\n        setNumberClicks(numberClicks + 1);\n        setIsSubmitted(true);\n        setIsExploding(true);\n        setTimeout(()=>{\n            setIsExploding(false);\n        }, 1000);\n        const dateTime = Date.now();\n        const unixTime = Math.floor(dateTime / 1000);\n        const sessionId = sessionData.sessionId || \"\";\n        const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);\n        const docId = sessionId === \"\" ? deviceInfo.language + deviceInfo.platform + deviceInfo.screenWidth + deviceInfo.screenHeight + randomString : sessionId;\n        if (sessionId === \"\") {\n            setSessionData({\n                ...sessionData,\n                sessionId: docId\n            });\n        }\n        (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.setDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.doc)(db, \"contactList\", docId), {\n            timeLastClickQuoteInspiration: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.serverTimestamp)(),\n            time: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.serverTimestamp)(),\n            unixTimeLastClickQuoteInspiration: unixTime,\n            numberClicksQuoteInspiration: numberClicks,\n            userAgent: deviceInfo.userAgent,\n            platform: deviceInfo.platform,\n            language: deviceInfo.language,\n            screenWidth: deviceInfo.screenWidth,\n            screenHeight: deviceInfo.screenHeight\n        }, {\n            merge: true\n        });\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"center\", {\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                    children: isExploding && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_confetti_explosion__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n                        width: 1600,\n                        particleCount: 250,\n                        duration: 2000,\n                        force: 0.8\n                    }, void 0, false, {\n                        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/inspiration.tsx\",\n                        lineNumber: 125,\n                        columnNumber: 23\n                    }, this)\n                }, void 0, false),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                    className: \"text-4xl md:text-6xl font-bold tracking-tighter leading-tight \",\n                    style: {\n                        maxWidth: \"900px\",\n                        \"color\": \"white\",\n                        \"textShadow\": \"0px 0px 10px rgba(0, 0, 0, 1)\"\n                    },\n                    children: quotes[currentQuoteIndex]\n                }, void 0, false, {\n                    fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/inspiration.tsx\",\n                    lineNumber: 131,\n                    columnNumber: 7\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"br\", {}, void 0, false, {\n                    fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/inspiration.tsx\",\n                    lineNumber: 133,\n                    columnNumber: 12\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                    onClick: generateRandomQuote,\n                    style: {},\n                    children: [\n                        \"  \",\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            style: {\n                                \"padding\": \"0.8rem\",\n                                \"color\": \"white\",\n                                \"width\": \"31vw\",\n                                \"textAlign\": \"center\",\n                                \"fontSize\": \"min(19px,max(15px,2vw))\",\n                                \"borderRadius\": \"30px 30px 30px 30px\",\n                                \"background\": \"#493bc3\",\n                                \"maxWidth\": \"280px\"\n                            },\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"b\", {\n                                style: {\n                                    \"color\": \"white\",\n                                    \"textShadow\": \"0px 0px 4px rgba(0, 0, 0, 0.5)\"\n                                },\n                                children: \"Show me another quote\"\n                            }, void 0, false, {\n                                fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/inspiration.tsx\",\n                                lineNumber: 148,\n                                columnNumber: 20\n                            }, this)\n                        }, void 0, false, {\n                            fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/inspiration.tsx\",\n                            lineNumber: 139,\n                            columnNumber: 23\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/inspiration.tsx\",\n                    lineNumber: 136,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/inspiration.tsx\",\n            lineNumber: 124,\n            columnNumber: 5\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/aness/Desktop/factors/websitestocker/nextjswebsite/components/inspiration.tsx\",\n        lineNumber: 122,\n        columnNumber: 5\n    }, this);\n}\n_s(QuoteDisplay, \"SDrwbMUkjNuBXx36BjdTMjFTCEM=\", false, function() {\n    return [\n        _stockerSession__WEBPACK_IMPORTED_MODULE_4__.useSession\n    ];\n});\n_c = QuoteDisplay;\n/* harmony default export */ __webpack_exports__[\"default\"] = (QuoteDisplay);\nvar _c;\n$RefreshReg$(_c, \"QuoteDisplay\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LDhCQUE2QnJCO1lBQzNCbkIsV0FBV0QsV0FBV0MsU0FBUztZQUMvQkUsVUFBVUgsV0FBV0csUUFBUTtZQUM3QkMsVUFBVUosV0FBV0ksUUFBUTtZQUM3QkMsYUFBYUwsV0FBV0ssV0FBVztZQUNuQ0ssY0FBY1YsV0FBV1UsWUFBWTtRQUNyQyxHQUFHO1lBQUVnQyxPQUFPO1FBQUs7SUFDdkI7SUFHQSxxQkFDRSw4REFBQ0M7a0JBRUQsNEVBQUNDOzs4QkFDRDs4QkFBRzlCLDZCQUFlLDhEQUFDNUIsZ0VBQWlCQTt3QkFDcEJ1QixPQUFPO3dCQUNQb0MsZUFBZTt3QkFDZkMsVUFBVTt3QkFDVEMsT0FBTzs7Ozs7Ozs4QkFFdEIsOERBQUNDO29CQUFHQyxXQUFVO29CQUFpRUMsT0FBTzt3QkFBQ0MsVUFBUzt3QkFBUSxTQUFRO3dCQUFTLGNBQWM7b0JBQWdDOzhCQUN0S3ZELE1BQU0sQ0FBQ3NCLGtCQUFrQjs7Ozs7OzhCQUNyQiw4REFBQ2tDOzs7Ozs4QkFHSiw4REFBQ0M7b0JBQU9DLFNBQVNoQztvQkFDYjRCLE9BQU8sQ0FFRjs7d0JBQUc7c0NBQUUsOERBQUNQOzRCQUFJTyxPQUFPO2dDQUNqQixXQUFXO2dDQUNYLFNBQVM7Z0NBQ1IsU0FBUTtnQ0FDVCxhQUFhO2dDQUNiLFlBQVk7Z0NBQ1osZ0JBQWdCO2dDQUNoQixjQUFjO2dDQUNkLFlBQVc7NEJBQ1o7c0NBQUcsNEVBQUNLO2dDQUFFTCxPQUFPO29DQUFDLFNBQVE7b0NBQVMsY0FBYztnQ0FBZ0M7MENBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJaEc7R0ExSVMxRDs7UUFFbUNELHVEQUFVQTs7O0tBRjdDQztBQTRJVCwrREFBZUEsWUFBWUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL2luc3BpcmF0aW9uLnRzeD84OWE0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgQ29uZmV0dGlFeHBsb3Npb24gZnJvbSAncmVhY3QtY29uZmV0dGktZXhwbG9zaW9uJztcbmltcG9ydCBMYXlvdXQgZnJvbSAnLi4vY29tcG9uZW50cy9sYXlvdXQnXG5pbXBvcnQgeyBmb3JtYXQgfSBmcm9tICdkYXRlLWZucyc7XG5cblxuaW1wb3J0IHsgZG9jLCBzZXREb2MgfSBmcm9tIFwiZmlyZWJhc2UvZmlyZXN0b3JlXCI7XG5pbXBvcnQgJ2ZpcmViYXNlL2ZpcmVzdG9yZSc7XG5pbXBvcnQge2dldEZpcmVzdG9yZX0gZnJvbSAnZmlyZWJhc2UvZmlyZXN0b3JlJztcbmltcG9ydCB7IHNlcnZlclRpbWVzdGFtcCB9IGZyb20gXCJmaXJlYmFzZS9maXJlc3RvcmVcIjtcbmltcG9ydCB7IHVzZVNlc3Npb24gfSBmcm9tICcuLi9zdG9ja2VyU2Vzc2lvbic7XG5cbmZ1bmN0aW9uIFF1b3RlRGlzcGxheSAoKSB7XG5jb25zdCBkYiA9IGdldEZpcmVzdG9yZSgpO1xuICAgIGNvbnN0IHsgc2Vzc2lvbkRhdGEsIHNldFNlc3Npb25EYXRhIH0gPSB1c2VTZXNzaW9uKCk7XG5cblxuICBjb25zdCBbcXVvdGVzLCBzZXRRdW90ZXNdID0gdXNlU3RhdGUoW1xuICAgIFwiT3Bwb3J0dW5pdGllcyBpbiB0aGUgc3RvY2sgbWFya2V0IGFyZSBsaWtlIHN1bnJpc2VzOyBpZiB5b3Ugd2FpdCB0b28gbG9uZywgeW91J2xsIG1pc3MgdGhlbS4gLSBXYXJyZW4gQnVmZmV0dFwiLFxuICAgIFwiSWYgeW91IGRvbid0IGZpbmQgYSB3YXkgdG8gbWFrZSBtb25leSB3aGlsZSB5b3Ugc2xlZXAsIHlvdSB3aWxsIHdvcmsgdW50aWwgeW91IGRpZS4gLSBXYXJyZW4gQnVmZmV0dFwiLFxuICAgIFwiVXNlIHlvdXIgbW9uZXkgdG8gbWFrZSBtb3JlIG1vbmV5LiAtIFJvYmVydCBLaXlvc2FraVwiLFxuICAgIFwiUmlzayBjb21lcyBmcm9tIG5vdCBrbm93aW5nIHdoYXQgeW91J3JlIGRvaW5nLCBhbHdheXMgZG91YmxlIGNoZWNrIHdpdGggYW4gYWR2aXNvci4gLSBXYXJyZW4gQnVmZmV0dFwiLFxuICAgIFwiVGhlIHN0b2NrIG1hcmtldCBpcyBhIGRldmljZSBmb3IgbWFraW5nIHRoZSBtb25leSB3b3JrLiAtIFdhcnJlbiBCdWZmZXR0XCIsXG4gICAgXCJQcmljZSBpcyB3aGF0IHlvdSBwYXkuIFZhbHVlIGlzIHdoYXQgeW91IGdldC4gLSBXYXJyZW4gQnVmZmV0dFwiLFxuICAgIFwiWW91ciBuZXQgd29ydGggaXMgZGV0ZXJtaW5lZCBieSB5b3VyIG5ldHdvcmsg4oCTIHRoZSBwZW9wbGUgeW91IGxlYXJuIGZyb20gYW5kIGdyb3cgd2l0aC4gLSBXYXJyZW4gQnVmZmV0dFwiLFxuICAgIFwiQSB3ZWxsLWRpdmVyc2lmaWVkIHBvcnRmb2xpbyBpcyB0aGUgc2hpZWxkIHRoYXQgZ3VhcmRzIHlvdXIgZmluYW5jaWFsIGZ1dHVyZS4gLSBCZW5qYW1pbiBHcmFoYW1cIixcbiAgICBcIlRoZSBzdG9jayBtYXJrZXQgZG9lc24ndCBkaXNjcmltaW5hdGU7IGl0J3Mgb3BlbiB0byBhbnlvbmUgd2lsbGluZyB0byBsZWFybiBhbmQgdGFrZSBhY3Rpb24uIC0gV2FycmVuIEJ1ZmZldHRcIixcbiAgICBcIlN1Y2Nlc3MgaW4gaW52ZXN0aW5nIGlzIGJ1aWx0IG9uIGEgZm91bmRhdGlvbiBvZiBzb3VuZCByZXNlYXJjaCBhbmQgdGhvdWdodGZ1bCBkZWNpc2lvbnMuIC0gV2FycmVuIEJ1ZmZldHRcIixcbiAgICBcIlRoZSBtYXJrZXQgaXMgYSBnaWFudCBkaXNjb3VudCBtYWNoaW5lLiBXaGVuIGV2ZXJ5dGhpbmcgZ29lcyBvbiBzYWxlLCBwZW9wbGUgcnVuIG91dCBvZiB0aGUgc3RvcmUuIOKAkyBNYXJrIEN1YmFuXCIsXG4gICAgLy8gQWRkIG1vcmUgcXVvdGVzIGhlcmUgYXMgbmVlZGVkXG4gIF0pO1xuXG4gY29uc3QgZmV0Y2hEZXZpY2VJbmZvID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIEdldCBiYXNpYyBkZXZpY2UgaW5mb3JtYXRpb25cbiAgICAgICAgICBzZXREZXZpY2VJbmZvKHtcbiAgICAgICAgICAgIC4uLmRldmljZUluZm8sXG4gICAgICAgICAgICB1c2VyQWdlbnQ6IG5hdmlnYXRvci51c2VyQWdlbnQsXG4gICAgICAgICAgICBwbGF0Zm9ybTogbmF2aWdhdG9yLnBsYXRmb3JtLFxuICAgICAgICAgICAgbGFuZ3VhZ2U6IG5hdmlnYXRvci5sYW5ndWFnZSxcbiAgICAgICAgICAgIHNjcmVlbldpZHRoOiBTdHJpbmcod2luZG93LnNjcmVlbi53aWR0aCksXG4gICAgICAgICAgICBzY3JlZW5IZWlnaHQ6IFN0cmluZyh3aW5kb3cuc2NyZWVuLmhlaWdodCksXG4gICAgICAgICAgICAvLyBBZGQgb3IgdXBkYXRlIG90aGVyIHByb3BlcnRpZXMgYXMgbmVlZGVkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgZGV2aWNlIGluZm9ybWF0aW9uOicsIGVycm9yKTtcblxuICAgICAgICAgIC8vIFNldCBlbXB0eSBzdHJpbmcgKCcnKSBhcyBkZWZhdWx0IHZhbHVlcyBpZiBmZXRjaGluZyBkZXZpY2UgaW5mb3JtYXRpb24gZmFpbHNcbiAgICAgICAgICBzZXREZXZpY2VJbmZvKHtcbiAgICAgICAgICAgIC4uLmRldmljZUluZm8sXG4gICAgICAgICAgICB1c2VyQWdlbnQ6ICcnLFxuICAgICAgICAgICAgcGxhdGZvcm06ICcnLFxuICAgICAgICAgICAgbGFuZ3VhZ2U6ICcnLFxuICAgICAgICAgICAgc2NyZWVuV2lkdGg6ICcnLFxuICAgICAgICAgICAgc2NyZWVuSGVpZ2h0OiAnJyxcbiAgICAgICAgICAgIC8vIFNldCBvdGhlciBwcm9wZXJ0aWVzIHRvIGVtcHR5IHN0cmluZ3MgYXMgbmVlZGVkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5jb25zdCBbZGV2aWNlSW5mbywgc2V0RGV2aWNlSW5mb10gPSB1c2VTdGF0ZSh7XG4gICAgICAgIHVzZXJBZ2VudDogJycsXG4gICAgICAgIHBsYXRmb3JtOiAnJyxcbiAgICAgICAgbGFuZ3VhZ2U6ICcnLFxuICAgICAgICBzY3JlZW5XaWR0aDogJycsXG4gICAgICAgIHNjcmVlbkhlaWdodDogJycsXG4gICAgICAgIC8vIEFkZCBtb3JlIHByb3BlcnRpZXMgYmFzZWQgb24gYXZhaWxhYmxlIGJyb3dzZXIgQVBJc1xuLy8gICAgICAgICBsYXRpdHVkZTogbnVsbCxcbi8vICAgICAgICAgbG9uZ2l0dWRlOiBudWxsLFxuICAgICAgfSk7XG5cbiAgICBjb25zdCBbaXNFeHBsb2RpbmcsIHNldElzRXhwbG9kaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbaXNTdWJtaXR0ZWQsIHNldElzU3VibWl0dGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2N1cnJlbnRRdW90ZUluZGV4LCBzZXRDdXJyZW50UXVvdGVJbmRleF0gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgW251bWJlckNsaWNrcywgc2V0TnVtYmVyQ2xpY2tzXSA9IHVzZVN0YXRlKDApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIC8vIEZldGNoIGRldmljZSBpbmZvcm1hdGlvbiB3aGVuIHRoZSBjb21wb25lbnQgbW91bnRzXG4gICAgICAgIGZldGNoRGV2aWNlSW5mbygpO1xuICAgICAgfSwgW10pOyAvLyBFbXB0eSBkZXBlbmRlbmN5IGFycmF5IGVuc3VyZXMgdGhlIGVmZmVjdCBydW5zIG9ubHkgb25jZSBhZnRlciBpbml0aWFsIHJlbmRlclxuXG5cbiAgY29uc3QgZ2VuZXJhdGVSYW5kb21RdW90ZSA9ICgpID0+IHtcbiAgICBjb25zdCBuZXdJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHF1b3Rlcy5sZW5ndGgpO1xuICAgIHNldEN1cnJlbnRRdW90ZUluZGV4KChuZXdJbmRleCklcXVvdGVzLmxlbmd0aCk7XG4gICAgc2V0TnVtYmVyQ2xpY2tzKG51bWJlckNsaWNrcysxKVxuICAgIHNldElzU3VibWl0dGVkKHRydWUpXG4gICAgc2V0SXNFeHBsb2RpbmcodHJ1ZSlcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHNldElzRXhwbG9kaW5nKGZhbHNlKTtcbiAgICB9LCAxMDAwKTtcblxuICAgIGNvbnN0IGRhdGVUaW1lID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCB1bml4VGltZSA9IE1hdGguZmxvb3IoZGF0ZVRpbWUgLyAxMDAwKTtcblxuXG5cbiAgICBjb25zdCBzZXNzaW9uSWQgPSBzZXNzaW9uRGF0YS5zZXNzaW9uSWQgfHwgJyc7XG5cblxuICBjb25zdCByYW5kb21TdHJpbmcgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDIwKS5zdWJzdHJpbmcoMiwgMTQpICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygyMCkuc3Vic3RyaW5nKDIsIDE0KTtcbiAgICBjb25zdCBkb2NJZCA9IHNlc3Npb25JZCA9PT0nJz9kZXZpY2VJbmZvLmxhbmd1YWdlICsgZGV2aWNlSW5mby5wbGF0Zm9ybSArIGRldmljZUluZm8uc2NyZWVuV2lkdGggKyBkZXZpY2VJbmZvLnNjcmVlbkhlaWdodCtyYW5kb21TdHJpbmc6IHNlc3Npb25JZDtcbiAgICBpZiAoc2Vzc2lvbklkID09PSAnJyl7XG4gICAgICAgIHNldFNlc3Npb25EYXRhKHsgLi4uc2Vzc2lvbkRhdGEsIHNlc3Npb25JZDogZG9jSWQgfSk7XG4gICAgfVxuXG4gICAgIHNldERvYyhkb2MoZGIsIFwiY29udGFjdExpc3RcIiwgZG9jSWQpLCB7XG4gICAgICAgIHRpbWVMYXN0Q2xpY2tRdW90ZUluc3BpcmF0aW9uOiBzZXJ2ZXJUaW1lc3RhbXAoKSxcbiAgICAgICAgdGltZTogc2VydmVyVGltZXN0YW1wKCksXG4gICAgICAgIHVuaXhUaW1lTGFzdENsaWNrUXVvdGVJbnNwaXJhdGlvbjogdW5peFRpbWUsXG4gICAgICBudW1iZXJDbGlja3NRdW90ZUluc3BpcmF0aW9uOm51bWJlckNsaWNrcyxcbiAgICAgICAgdXNlckFnZW50OiBkZXZpY2VJbmZvLnVzZXJBZ2VudCxcbiAgICAgICAgcGxhdGZvcm06IGRldmljZUluZm8ucGxhdGZvcm0sXG4gICAgICAgIGxhbmd1YWdlOiBkZXZpY2VJbmZvLmxhbmd1YWdlLFxuICAgICAgICBzY3JlZW5XaWR0aDogZGV2aWNlSW5mby5zY3JlZW5XaWR0aCxcbiAgICAgICAgc2NyZWVuSGVpZ2h0OiBkZXZpY2VJbmZvLnNjcmVlbkhlaWdodCxcbiAgICAgICAgfSwgeyBtZXJnZTogdHJ1ZSB9KTtcbiAgfTtcblxuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cblxuICAgIDxjZW50ZXI+XG4gICAgPD57aXNFeHBsb2RpbmcgJiYgPENvbmZldHRpRXhwbG9zaW9uXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPXsxNjAwfVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZUNvdW50PXsyNTB9IC8vIEVxdWl2YWxlbnQgdG8gcGFydGljbGVDb3VudFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbj17MjAwMH0gLy8gRXF1aXZhbGVudCB0byBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgZm9yY2U9ezAuOH0gLy8gRXF1aXZhbGVudCB0byBmb3JjZVxuICAgICAgICAgICAgICAgICAgICAvPn08Lz5cbiAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LTR4bCBtZDp0ZXh0LTZ4bCBmb250LWJvbGQgdHJhY2tpbmctdGlnaHRlciBsZWFkaW5nLXRpZ2h0IFwiIHN0eWxlPXt7bWF4V2lkdGg6JzkwMHB4JywnY29sb3InOid3aGl0ZScsICd0ZXh0U2hhZG93JzogJzBweCAwcHggMTBweCByZ2JhKDAsIDAsIDAsIDEpJyB9fT5cbiAgICAgIHtxdW90ZXNbY3VycmVudFF1b3RlSW5kZXhdfTwvaDI+XG4gICAgICAgICAgIDxicj48L2JyPlxuXG5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtnZW5lcmF0ZVJhbmRvbVF1b3RlfVxuICAgICAgICAgICAgc3R5bGU9e3tcblxuICAgICAgICAgICAgICAgICB9fT4gIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgJ3BhZGRpbmcnOiAnMC44cmVtJyxcbiAgICAgICAgICAgICAgICAgJ2NvbG9yJzogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICAgICd3aWR0aCc6JzMxdncnLFxuICAgICAgICAgICAgICAgICAndGV4dEFsaWduJzogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICdmb250U2l6ZSc6ICdtaW4oMTlweCxtYXgoMTVweCwydncpKScsXG4gICAgICAgICAgICAgICAgICdib3JkZXJSYWRpdXMnOiAnMzBweCAzMHB4IDMwcHggMzBweCcsXG4gICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kJzogJyM0OTNiYzMnLFxuICAgICAgICAgICAgICAgICAnbWF4V2lkdGgnOicyODBweCdcbiAgICAgICAgICAgICAgICB9fT48YiBzdHlsZT17eydjb2xvcic6J3doaXRlJywgJ3RleHRTaGFkb3cnOiAnMHB4IDBweCA0cHggcmdiYSgwLCAwLCAwLCAwLjUpJ319PlNob3cgbWUgYW5vdGhlciBxdW90ZTwvYj48L2Rpdj48L2J1dHRvbj5cbiAgICAgIDwvY2VudGVyPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUXVvdGVEaXNwbGF5O1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJDb25mZXR0aUV4cGxvc2lvbiIsImRvYyIsInNldERvYyIsImdldEZpcmVzdG9yZSIsInNlcnZlclRpbWVzdGFtcCIsInVzZVNlc3Npb24iLCJRdW90ZURpc3BsYXkiLCJkYiIsInNlc3Npb25EYXRhIiwic2V0U2Vzc2lvbkRhdGEiLCJxdW90ZXMiLCJzZXRRdW90ZXMiLCJmZXRjaERldmljZUluZm8iLCJzZXREZXZpY2VJbmZvIiwiZGV2aWNlSW5mbyIsInVzZXJBZ2VudCIsIm5hdmlnYXRvciIsInBsYXRmb3JtIiwibGFuZ3VhZ2UiLCJzY3JlZW5XaWR0aCIsIlN0cmluZyIsIndpbmRvdyIsInNjcmVlbiIsIndpZHRoIiwic2NyZWVuSGVpZ2h0IiwiaGVpZ2h0IiwiZXJyb3IiLCJjb25zb2xlIiwiaXNFeHBsb2RpbmciLCJzZXRJc0V4cGxvZGluZyIsImlzU3VibWl0dGVkIiwic2V0SXNTdWJtaXR0ZWQiLCJjdXJyZW50UXVvdGVJbmRleCIsInNldEN1cnJlbnRRdW90ZUluZGV4IiwibnVtYmVyQ2xpY2tzIiwic2V0TnVtYmVyQ2xpY2tzIiwiZ2VuZXJhdGVSYW5kb21RdW90ZSIsIm5ld0luZGV4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwibGVuZ3RoIiwic2V0VGltZW91dCIsImRhdGVUaW1lIiwiRGF0ZSIsIm5vdyIsInVuaXhUaW1lIiwic2Vzc2lvbklkIiwicmFuZG9tU3RyaW5nIiwidG9TdHJpbmciLCJzdWJzdHJpbmciLCJkb2NJZCIsInRpbWVMYXN0Q2xpY2tRdW90ZUluc3BpcmF0aW9uIiwidGltZSIsInVuaXhUaW1lTGFzdENsaWNrUXVvdGVJbnNwaXJhdGlvbiIsIm51bWJlckNsaWNrc1F1b3RlSW5zcGlyYXRpb24iLCJtZXJnZSIsImRpdiIsImNlbnRlciIsInBhcnRpY2xlQ291bnQiLCJkdXJhdGlvbiIsImZvcmNlIiwiaDIiLCJjbGFzc05hbWUiLCJzdHlsZSIsIm1heFdpZHRoIiwiYnIiLCJidXR0b24iLCJvbkNsaWNrIiwiYiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/inspiration.tsx\n"));

/***/ })

});