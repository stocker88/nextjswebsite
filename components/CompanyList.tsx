import Link from 'next/link';
import { useEffect, useState } from 'react';

const CompanyList = ({ companies }) => {
  const [imageExists, setImageExists] = useState({});

  useEffect(() => {
    companies.forEach((company) => {
      const img = new Image();
      img.src = `/assets/assets/logo/${company.ticker}.webp`;
      img.onload = () => setImageExists((prev) => ({ ...prev, [company.ticker]: true }));
      img.onerror = () => setImageExists((prev) => ({ ...prev, [company.ticker]: false }));
    });
  }, [companies]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '80%', maxWidth: '600px' }}>
        {companies.map((company, index) => (
          <Link href={`/web-app/financial/${company.ticker}`} key={index}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
             {imageExists[company.ticker] ? (
                              <img
                                            src={`/assets/assets/logo/${company.ticker}.webp`}
                                            alt={`Logo of ${company.ticker}`}
                                            style={{
                                              width: '50px',
                                               'boxShadow': '0px 0px 5px rgba(0, 0, 0, 0.4)',
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
                                             alignItems: 'center',
                                             marginBottom: '20px',
                                              marginRight: '30px',
                                             borderRadius: '50%', // Round the placeholder
                                             width: '50px',
                                             height: '50px',
                                             justifyContent: 'center',
                                             overflow: 'hidden', // Hide any content overflow
                                             backgroundColor: 'black',
                                              'boxShadow': '0px 0px 5px rgba(0, 0, 0, 0.4)',
                                           }}
                                         ><span style={{ fontSize: '24px', color: 'white' }}>{company.logo.charAt(0)}</span>
                                         </div>
                           )}

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'white', marginRight: '30px','textShadow': '0px 0px 3px rgba(0, 0, 0, 0.5)' }}>{company.ticker}</span>
                  <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'white' ,'textShadow': '0px 0px 3px rgba(0, 0, 0, 0.5)'}}>{company.name}</span>
                </div>
              </div>
            </div>
          </Link>

        ))}
      </div>
    </div>
  );
};

export default CompanyList;
