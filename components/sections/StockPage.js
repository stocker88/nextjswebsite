import React from 'react';
import { Link } from 'react-router-dom';


//import EmbeddedFlutterComponent from '../../components/EmbeddedFlutterComponent'; // Assume this component embeds the Flutter app


const ReactComponent = () => {
  return (
    <div>
      <h1>Welcome to React</h1>
      <Link to="/path-to-flutter-dummy-page">Go to Flutter Dummy Page</Link>
      <FlutterAppContainer /> {/* Embed the Flutter web app */}
    </div>
  );
};

export default ReactComponent;

//const StockPage = ({ symbol }) => {
//  return (
//    <div>
//      {/*<h1>StocksToBuyNow.ai - Next.js App</h1>*/}
//      <h2>Stock Page for {symbol}</h2>
//      <EmbeddedFlutterComponent symbol={symbol} /> {/* Pass the symbol to Flutter component */}
//    </div>
//  );
//};
//
//export default StockPage;
//
