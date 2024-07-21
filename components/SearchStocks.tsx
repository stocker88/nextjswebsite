import Link from 'next/link';
import { useSession } from '../stockerSession';
import { useState, useEffect } from "react";
import { format } from 'date-fns';
import ConfettiExplosion from 'react-confetti-explosion';
import InstallButtonsWithQR from './elements/InstallButtonsWithQR';

const SearchStocks = ({ stockData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

//REMOVED FIREBASE

const [selectedTicker, setSelectedTicker] = useState('');
const [isExploding, setIsExploding] = useState(false);

  const [imageExists, setImageExists] = useState({});

    const handleSearch = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      const filteredResults = stockData.filter(
        (stock) =>
          stock.ticker.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query)
      );

      filteredResults.forEach((company) => {
        const img = new Image();
        img.src = `/assets/assets/logo/${company.ticker}.webp`;
        img.onload = () => setImageExists((prev) => ({ ...prev, [company.ticker]: true }));
        img.onerror = () => setImageExists((prev) => ({ ...prev, [company.ticker]: false }));
      });

      // If the query is empty, display no elements
      setSearchResults(query === '' ? [] : filteredResults);
    };


  const handleClick = (ticker) => {
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
                 {selectedTicker!=='' &&     <center> <h1 className="text-3xl md:text-3xl font-bold tracking-tighter leading-tight" style={{ color: 'white', lineHeight: 1.3,textShadow: '0px 0px 3px rgba(0, 0, 0, 1)',  }} >
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
          padding: '17px',
          paddingLeft: '20px',
          paddingRight: '10px',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: 'white',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          width: '300px', // Adjust width as needed
          color: 'black',
          WebkitTextFillColor: 'black',
          fontSize: '15px', // Adjust the font size

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
                                            width: '30px',
                                            height: '30px',
                                            marginRight: '10px',
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
                                   width: '30px',
                                   height: '30px',
                                   justifyContent: 'center',
                                   overflow: 'hidden', // Hide any content overflow
                                   backgroundColor: 'black',
                                 }}
                               ><span style={{ fontSize: '20px', color: 'white' }}>{stock.logo.charAt(0)}</span>
                               </div>
                         )}

                       <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <div style={{ display: 'flex', alignItems: 'center' }}>
                           <span style={{ fontSize: '1em',  color: 'white', marginRight: '10px' , 'textShadow': '0px 0px 4px rgba(0, 0, 0, 0.5)'}}>{stock.ticker}</span>
                           <span style={{ fontSize: '1em',  color: 'white', 'textShadow': '0px 0px 4px rgba(0, 0, 0, 0.5)' }}>{stock.name}</span>
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
