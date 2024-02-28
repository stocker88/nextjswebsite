import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CSSProperties } from 'react';
import { isMobile, browserName } from "react-device-detect";
const CompanyList = ({ companies }) => {
  const [imageExists, setImageExists] = useState({});

// Styles

const tableHeaderStyle: CSSProperties = {
  textAlign: 'left',
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

const tableRowStyle: CSSProperties = {
  borderBottom: 'none',
};

const tableCellStyle: CSSProperties = {
  padding: '5px',
};


const tableImageStyle: CSSProperties = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  objectFit: 'cover',
  overflow: 'hidden',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.4)',
  marginRight: '5px',
};
const tablePlaceholderStyle: CSSProperties = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: 'black',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.4)',
  marginRight: '5px',
};

const tablePlaceholderTextStyle: CSSProperties = {
  fontSize: '16px',
  color: 'white',
};

const tableTextStyle: CSSProperties = {
  fontSize: '1.2em',
  color: 'white',
  textShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)',
  marginBottom: '5px',
};

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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} style={tableRowStyle}>
                <td style={tableCellStyle}>
                  <Link href={isMobile?'https://applink.hellostocker.com/invite':`/web-app/financial/${company.ticker}`} style={{ textDecoration: 'none' }}>
                    {imageExists[company.ticker] ? (
                      <img
                        src={`/assets/assets/logo/${company.ticker}.webp`}
                        alt={`Logo of ${company.ticker}`}
                        style={tableImageStyle}
                      />
                    ) : (
                      <div style={tablePlaceholderStyle}>
                        <span style={tablePlaceholderTextStyle}>{company.logo.charAt(0)}</span>
                      </div>
                    )}
                  </Link>
                </td>
                <td style={tableCellStyle}>
                  <Link href={isMobile?'https://applink.hellostocker.com/invite':`/web-app/financial/${company.ticker}`} style={{ textDecoration: 'none' }}>
                    <span style={tableTextStyle}>{company.ticker}</span>
                  </Link>
                </td>
                <td style={tableCellStyle}>
                  <Link href={isMobile?'https://applink.hellostocker.com/invite':`/web-app/financial/${company.ticker}`} style={{ textDecoration: 'none' }}>
                    <span style={tableTextStyle}>{company.name}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyList;
