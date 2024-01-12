import Link from 'next/link';
import { useEffect, useState } from 'react';

const CompanyList = ({ companies }) => {
  const [imageExists, setImageExists] = useState({});

// Styles
const tableHeaderStyle = {
  textAlign: 'left',
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

const tableRowStyle = {
  borderBottom: '1px solid #ddd',
};

const tableCellStyle = {
  padding: '10px',
};

const tableImageStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  objectFit: 'cover',
  overflow: 'hidden',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.4)',
  marginRight: '10px',
};

const tablePlaceholderStyle = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: 'black',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.4)',
  marginRight: '10px',
};

const tablePlaceholderTextStyle = {
  fontSize: '24px',
  color: 'white',
};

const tableTextStyle = {
  fontSize: '1.2em',
  fontWeight: 'bold',
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
        {companies.map((company, index) => (
     <table style={{ width: '100%', borderCollapse: 'collapse' }}>

       <tbody>
         {companies.map((company, index) => (
           <tr key={index} style={tableRowStyle}>
             <td style={tableCellStyle}>
               <Link href={`/web-app/financial/${company.ticker}`} style={{ textDecoration: 'none' }}>
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
               <Link href={`/web-app/financial/${company.ticker}`} style={{ textDecoration: 'none' }}>
                 <span style={tableTextStyle}>{company.ticker}</span>
               </Link>
             </td>
             <td style={tableCellStyle}>
               <Link href={`/web-app/financial/${company.ticker}`} style={{ textDecoration: 'none' }}>
                 <span style={tableTextStyle}>{company.name}</span>
               </Link>
             </td>
           </tr>
         ))}
       </tbody>
     </table>



        ))}
      </div>
    </div>
  );
};

export default CompanyList;
