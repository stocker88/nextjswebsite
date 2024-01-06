import Link from 'next/link';
import { doc, setDoc } from "firebase/firestore";
import 'firebase/firestore';
import {getFirestore} from 'firebase/firestore';
import { serverTimestamp } from "firebase/firestore";
import { useSession } from '../stockerSession';
import { useState, useEffect } from "react";
import { format } from 'date-fns';

const SearchStocks = ({ stockData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);



const db = getFirestore();
    const { sessionData, setSessionData } = useSession();
        const [deviceInfo, setDeviceInfo] = useState({
            userAgent: '',
            platform: '',
            language: '',
            screenWidth: '',
            screenHeight: '',
        });

 const fetchDeviceInfo = () => {
        try {
          // Get basic device information
          setDeviceInfo({
            ...deviceInfo,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: String(window.screen.width),
            screenHeight: String(window.screen.height),
            // Add or update other properties as needed
          });
        } catch (error) {
          console.error('Error fetching device information:', error);

          // Set empty string ('') as default values if fetching device information fails
          setDeviceInfo({
            ...deviceInfo,
            userAgent: '',
            platform: '',
            language: '',
            screenWidth: '',
            screenHeight: '',
            // Set other properties to empty strings as needed
          });
        }
      };



  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredResults = stockData.filter(
      (stock) =>
        stock.ticker.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query)
    );
    setSearchResults(filteredResults);
  };


  useEffect(() => {
        // Fetch device information when the component mounts
        fetchDeviceInfo();
      }, []); // Empty dependency array ensures the effect runs only once after initial render


  const handleClick = (ticker) => {
    const dateTime = Date.now();
    const unixTime = Math.floor(dateTime / 1000);


    const sessionId = sessionData.sessionId || '';


    const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);
    const docId = deviceInfo.language + deviceInfo.platform + deviceInfo.screenWidth + deviceInfo.screenHeight+randomString;
    if (sessionId === ''){
        setSessionData({ ...sessionData, sessionId: docId });
    }

     setDoc(doc(db, "a_selectedStockWebPage", docId), {
        time_clicked_stock: serverTimestamp(),
        time: serverTimestamp(),
         time_clicked_stockunix: unixTime,
          userAgent: deviceInfo.userAgent,
          ticker: ticker,
          sessionId:sessionId,
          platform: deviceInfo.platform,
          language: deviceInfo.language,
          screenWidth: deviceInfo.screenWidth,
          screenHeight: deviceInfo.screenHeight,
        }, { merge: true });
  };




  return (
    <div>
    <center>
      <input
        type="text"
        placeholder="Search by ticker or name..."
        value={searchQuery}
        onChange={handleSearch}
        style={{
          padding: '15px',
          paddingLeft: '20px',
          paddingRight: '20px',
          borderRadius: '30px',
          border: 'none',
          backgroundColor: 'white',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          width: '300px', // Adjust width as needed
        }}
      />
      <ul>
        {searchResults.map((stock, index) => (
         <div style={{ display: 'flex', justifyContent: 'center' }}>
           <Link
           href={`/web-app/financial/${stock.ticker}`}
           key={index}
            onClick={() => handleClick(stock.ticker)}
           >
                     <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                       <img
                                    src={`/assets/assets/logo/${stock.ticker}.webp`}
                                    alt={`Logo of ${stock.ticker} ${stock.name}`}
                                    style={{
                                      width: '50px',
                                      height: '50px',
                                      marginRight: '30px',
                                      borderRadius: '50%', // Set border radius to create a circular shape
                                      objectFit: 'cover', // Maintain aspect ratio and cover the entire space
                                      overflow: 'hidden', // Hide any image overflow beyond the circle
                                    }}
                                  />
                       <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <div style={{ display: 'flex', alignItems: 'center' }}>
                           <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'white', marginRight: '30px' }}>{stock.ticker}</span>
                           <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'white' }}>{stock.name}</span>
                         </div>
                       </div>
                     </div>
                   </Link>
                   </div>
        ))}
      </ul>
      </center>
    </div>
  );
};

export default SearchStocks;
