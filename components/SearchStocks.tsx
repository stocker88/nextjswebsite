import Link from 'next/link';
import { doc, setDoc } from "firebase/firestore";
import 'firebase/firestore';
import {getFirestore} from 'firebase/firestore';
import { serverTimestamp } from "firebase/firestore";
import { useSession } from '../stockerSession';
import { useState, useEffect } from "react";
import { format } from 'date-fns';
import ConfettiExplosion from 'react-confetti-explosion';
import InstallButtonsWithQR from './elements/InstallButtonsWithQR';

const SearchStocks = ({ stockData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

const [selectedTicker, setSelectedTicker] = useState('');
const [isExploding, setIsExploding] = useState(false);

const db = getFirestore();

  const [imageExists, setImageExists] = useState({});

  useEffect(() => {
    stockData.forEach((company) => {
      const img = new Image();
      img.src = `/assets/assets/logo/${company.ticker}.webp`;
      img.onload = () => setImageExists((prev) => ({ ...prev, [company.ticker]: true }));
      img.onerror = () => setImageExists((prev) => ({ ...prev, [company.ticker]: false }));
    });
  }, [stockData]);


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

      // If the query is empty, display no elements
      setSearchResults(query === '' ? [] : filteredResults);
    };


  useEffect(() => {
        // Fetch device information when the component mounts
        fetchDeviceInfo();
      }, []); // Empty dependency array ensures the effect runs only once after initial render


  const handleClick = (ticker) => {
    const dateTime = Date.now();
    const unixTime = Math.floor(dateTime / 1000);
    const unixTimeStr = unixTime.toString();

    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init('3644450535825105');


        ReactPixel.trackCustom('getTheAppClicked', {location: 'selectedStock'});
      });

    const sessionId = sessionData.sessionId || '';


    const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);
    const docId = unixTimeStr + deviceInfo.language + deviceInfo.platform + deviceInfo.screenWidth + deviceInfo.screenHeight+randomString;
    if (sessionId === ''){
        setSessionData({ ...sessionData, sessionId: docId });
    }

      var storedUtmParams = localStorage.getItem('utmParams');
     var utmCampaignValue='defaultWeb';
     var utmSourceValue='defaultWeb';
     var utmMediumValue='defaultWeb';
     // Check if UTM parameters are stored
     if (storedUtmParams) {
         // Parse the stored JSON string
         var utmParams = JSON.parse(storedUtmParams);

         // Retrieve the specific UTM parameter
         utmCampaignValue = utmParams.campaign;
         utmSourceValue = utmParams.source;
         utmMediumValue = utmParams.medium;
    }
     setDoc(
        doc(db, "contactList", docId), {
            time_clicked_stock: serverTimestamp(),
            a_type: 'selectedStock',
            time: serverTimestamp(),
            time_clicked_stockunix: unixTime,
            userAgent: deviceInfo.userAgent,
            ticker: ticker,
            sessionId:sessionId,
            platform: deviceInfo.platform,
            language: deviceInfo.language,
            screenWidth: deviceInfo.screenWidth,
            screenHeight: deviceInfo.screenHeight,
            utmCampaignValue:utmCampaignValue,
            utmSourceValue:utmSourceValue,
            utmMediumValue:utmMediumValue,
        }, { merge: true });

        setSelectedTicker(ticker)
        setIsExploding(true)
  };




  return (
    <div>
    <center>
       <>{isExploding && <ConfettiExplosion
                              width={1600}
                              particleCount={350} // Equivalent to particleCount
                              duration={4000} // Equivalent to duration
                               force={0.8} // Equivalent to force
                              />}</>
                 {selectedTicker!=='' &&     <center> <h1 className="text-4xl md:text-4xl font-bold tracking-tighter leading-tight" style={{ color: 'white', fontFamily: 'arial',lineHeight: 1.3,textShadow: '0px 0px 3px rgba(0, 0, 0, 1)',  }} >
                    {`Access ${selectedTicker} Forecast and Price Target Now`}
                    <br></br>
                    <br></br>
                      </h1>    </center>}
                  {selectedTicker!=='' && <InstallButtonsWithQR/>}
      {selectedTicker==''&&
      <input
        type="text"
        placeholder="Search a ticker or company..."
        value={searchQuery}
        onChange={handleSearch}
        style={{
          padding: '30px',
          paddingLeft: '20px',
          paddingRight: '10px',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: 'white',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          width: '300px', // Adjust width as needed
          color: 'black',
          WebkitTextFillColor: 'black',
          fontSize: '18px', // Adjust the font size

        }}
      />}
      {selectedTicker==''&& <div style={{
                      display: 'flex',
                      justifyContent: 'center', // Center the content horizontally
                    }}>
      <ul style={{
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'flex-start', // Align items to the left side of the column
           }}>
        {searchResults.map((stock, index) => (
         <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <a onClick={() => handleClick(stock.ticker)}>
                     <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                {imageExists[stock.ticker] ? (
                            <img
                                          src={`/assets/assets/logo/${stock.ticker}.webp`}
                                          alt={`Logo of ${stock.ticker}`}
                                          style={{
                                          'boxShadow': '0px 0px 5px rgba(0, 0, 0, 0.4)',
                                            width: '50px',
                                            height: '50px',
                                            marginRight: '30px',
                                            borderRadius: '50%', // Set border radius to create a circular shape
                                            objectFit: 'cover', // Maintain aspect ratio and cover the entire space
                                            overflow: 'hidden', // Hide any image overflow beyond the circle
                                          }}
                                        />
                         ) : (
                            <div
                                         style={{
                                           cursor: 'pointer',
                                           display: 'flex',
                                           'boxShadow': '0px 0px 5px rgba(0, 0, 0, 0.4)',
                                           alignItems: 'center',
                                           marginBottom: '20px',
                                            marginRight: '30px',
                                           borderRadius: '50%', // Round the placeholder
                                           width: '50px',
                                           height: '50px',
                                           justifyContent: 'center',
                                           overflow: 'hidden', // Hide any content overflow
                                           backgroundColor: 'black',
                                         }}
                                       ><span style={{ fontSize: '24px', color: 'white' }}>{stock.logo.charAt(0)}</span>
                                       </div>
                         )}

                       <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <div style={{ display: 'flex', alignItems: 'center' }}>
                           <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'white', marginRight: '30px' , 'textShadow': '0px 0px 4px rgba(0, 0, 0, 0.5)'}}>{stock.ticker}</span>
                           <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'white', 'textShadow': '0px 0px 4px rgba(0, 0, 0, 0.5)' }}>{stock.name}</span>
                         </div>
                       </div>
                     </div>
                    </a>
                   </div>
        ))}
      </ul></div>}
      </center>
    </div>
  );
};

export default SearchStocks;
