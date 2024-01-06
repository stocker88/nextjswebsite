import Link from 'next/link';

const CompanyList = ({ companies }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '80%', maxWidth: '600px' }}>
        {companies.map((company, index) => (

          <Link href={`/web-app/financial/${company.ticker}`} key={index}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
             <img
               src={`/assets/assets/logo/${company.ticker}.webp`}
               alt={`Logo of ${company.ticker}`}
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
                  <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'white', marginRight: '30px' }}>{company.ticker}</span>
                  <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'white' }}>{company.name}</span>
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
