import React, { useEffect, useRef } from 'react';

const FlutterAppContainer = () => {
  const flutterAppRef = useRef();

  useEffect(() => {
  console.log('Loading Flutter script...2');

    const loadFlutterApp = () => {
      // Replace 'path-to-your-flutter-app/main.dart.js' with the correct path to your Flutter app's main.js
      const flutterScript = document.createElement('script');
      flutterScript.src = 'web/main.dart.js'; // Update with your Flutter app's build path
      flutterScript.type = 'application/javascript';
      flutterScript.defer = true;

      flutterScript.onload = () => {
        // Access the Flutter app using the reference and initialize/render it
        // For example:
        // const flutterApp = new YourFlutterApp({ /* pass configuration or parameters */ });
        // flutterApp.render(flutterAppRef.current);
      };

      document.body.appendChild(flutterScript);
    };

    loadFlutterApp();

    return () => {
      // Clean-up logic if needed
    };
  }, []);

  return <div ref={flutterAppRef}></div>;
};

export default FlutterAppContainer;
