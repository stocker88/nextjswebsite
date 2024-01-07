import Head from 'next/head';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { stockDataSearch } from '../../../components/constants';
type Props = {
  ticker: string;
};
const company_descriptions = {
       'AAPL': "Apple Inc. (AAPL): Technology company specializing in consumer electronics and software services.",
       'MSFT': "Microsoft Corporation (MSFT): Global leader in software, cloud computing, and technology solutions.",
       'GOOGL': "Alphabet Inc. (GOOGL): Multinational conglomerate offering internet-related products and services.",
       'AMZN': "Amazon.com Inc. (AMZN): E-commerce giant providing online retail, cloud computing, and AI services.",
       'NVDA': "NVIDIA Corporation (NVDA): Leading graphics processing unit (GPU) manufacturer for gaming and AI.",
       'META': "Meta Platforms Inc. (META): Social media conglomerate offering various communication platforms.",
       'TSLA': "Tesla Inc. (TSLA): Innovative electric vehicle and clean energy company.",
       'BTC-USD': 'Cryptocurrency known for pioneering blockchain technology.',
       'LLY': 'Eli Lilly and Company focuses on pharmaceuticals, producing drugs in various therapeutic areas.',
       'V': 'Visa is a global payments technology company, enabling secure and convenient transactions worldwide.',
       'TSM': 'Taiwan Semiconductor Manufacturing Company produces semiconductor products for various applications.',
       'UNH': 'UnitedHealth Group provides health care products and insurance services to diverse customers.',
       'NVO': 'Novo Nordisk specializes in diabetes care, offering a broad range of pharmaceutical products.',
       'JPM': 'JPMorgan Chase is a leading financial institution offering banking, asset management, and commercial services.',
       'WMT': 'Walmart operates a chain of retail stores worldwide, offering a wide range of consumer products.',
       'XOM': 'Exxon Mobil is an energy company engaged in exploration, production, refining, and marketing of oil and gas.',
       'AVGO': 'Broadcom designs and develops a broad range of semiconductor and infrastructure software solutions.',
       'SPY': 'SPDR S&P 500 ETF Trust tracks the S&P 500 Index, offering diversified exposure to large-cap U.S. stocks.',
       'MA': 'Mastercard is a global technology company in the payments industry, providing secure and efficient transactions.',
       'JNJ': 'Johnson & Johnson focuses on pharmaceuticals, medical devices, and consumer health care products.',
       'PG': 'Procter & Gamble is a multinational consumer goods corporation, producing a wide range of household products.',
       'MC.PA': 'LVMH Moët Hennessy Louis Vuitton is a luxury goods conglomerate known for its high-end brands.',
       'IVV': 'iShares Core S&P 500 ETF aims to mirror the performance of the S&P 500 Index.',
       'ORCL': 'Oracle specializes in cloud engineering systems, enterprise software products, and database technology.',
       'HD': 'The Home Depot is a home improvement retailer providing a wide array of products and services.',
       'ADBE': 'Adobe offers software products and services for creative professionals and enterprises globally.',
       'CVX': 'Chevron is an integrated energy company engaged in the exploration and production of oil and natural gas.',
       'ASML': 'ASML Holding manufactures photolithography machines used in semiconductor manufacturing.',
       'MRK': 'Merck & Co. is a global pharmaceutical company focusing on innovative medical solutions.',
       'COST': 'Costco Wholesale operates a chain of membership-based warehouse clubs offering various products.',
        'KO': 'Coca-Cola Company is a multinational beverage corporation producing various non-alcoholic beverages.',
       'TM': 'Toyota Motor Corporation manufactures and sells a diverse range of automobiles and related products globally.',
       'ETH-USD': 'Ethereum is a decentralized blockchain platform facilitating smart contracts and cryptocurrency transactions.',
       'ABBV': 'AbbVie focuses on research-based pharmaceuticals, developing therapies across several medical specialties.',
       'BAC': 'Bank of America offers banking and financial services to individuals, businesses, and institutions.',
       'PEP': 'Pepsico operates in the food and beverage industry, offering a wide range of snacks and beverages.',
       'OR.PA': "L'Oréal is a cosmetics and beauty company, offering a diverse range of beauty products and services.",
       'FMX': 'Fomento Económico Mexicano (FEMSA) operates in the beverage, retail, and logistics sectors.',
       'SHEL': 'Royal Dutch Shell is a global energy company engaged in oil, gas, and renewable energy production.',
       'CRM': 'Salesforce provides customer relationship management solutions, aiding businesses in sales and marketing.',
       'NFLX': 'Netflix is a streaming service providing various movies, TV series, and original content worldwide.',
       'ACN': 'Accenture is a global professional services company, offering consulting and technology services.',
       'RMS.PA': 'Hermès International specializes in luxury goods, particularly high-end fashion and accessories.',
       'MCD': "McDonald's is a fast-food restaurant chain serving a variety of burgers, fries, and beverages.",
       'BABA': 'Alibaba Group is an e-commerce and technology conglomerate operating various online marketplaces.',
       'LIN': 'Linde plc is a multinational industrial gases and engineering company.',
       'AZN': 'AstraZeneca focuses on pharmaceuticals, developing drugs for various medical conditions.',
       'NVS': 'Novartis AG is a global healthcare company involved in pharmaceuticals and eye care products.',
       'QQQ': 'Invesco QQQ Trust tracks the Nasdaq 100 Index, offering exposure to top non-financial companies.',
       'CSCO': 'Cisco Systems designs, manufactures, and sells networking equipment and technology services.',
        'AMD': 'Advanced Micro Devices (AMD) develops computer processors and related technologies for business, consumer, and gaming markets.',
       'TMO': 'Thermo Fisher Scientific offers laboratory equipment, software, services, and consumables for scientific research and healthcare.',
       'INTC': 'Intel Corporation designs and manufactures essential technologies powering the cloud, data centers, and various computing devices.',
       'SAP': 'SAP SE provides enterprise software solutions assisting companies in managing business operations and customer relations.',
       'ABT': 'Abbott Laboratories develops and markets a diverse range of healthcare products, including medical devices, diagnostics, and nutrition.',
       'SHEL.L': 'Royal Dutch Shell is a multinational energy company involved in oil, gas, and renewable energy production.',
       'TMUS': 'T-Mobile US provides wireless network services and devices to consumers, businesses, and government agencies.',
       'CMCSA': 'Comcast Corporation operates in media and technology, offering cable television, internet, and entertainment services.',
       'PFE': 'Pfizer Inc. is a global pharmaceutical company developing vaccines, medicines, and healthcare solutions.',
       'DIS': 'The Walt Disney Company operates in entertainment, media, and theme parks, offering diverse content and experiences.',
       'NKE': 'Nike designs, manufactures, and markets athletic footwear, apparel, equipment, and accessories globally.',
       'DHR': 'Danaher Corporation manufactures and markets professional, medical, industrial, and commercial products.',
       'BHP': 'BHP is a leading global resources company engaged in the exploration, production, and processing of minerals.',
       'AZN.L': 'AstraZeneca PLC focuses on developing and commercializing prescription medicines in various therapeutic areas.',
       'INTU': 'Intuit Inc. provides financial management and tax preparation software for individuals and small businesses.',
       'PDD': 'Pinduoduo operates an e-commerce platform offering a wide range of products with social shopping features.',
       'WFC': 'Wells Fargo & Company provides banking, investment, mortgage, and consumer financial services.',
       'HSBC': 'HSBC Holdings plc offers banking and financial services to individuals and businesses globally.',
       'TTE.PA': 'TotalEnergies SE is a multinational oil and gas company involved in energy production and distribution.',
       'HDB': 'HDFC Bank is one of India’s leading private sector banks providing various banking and financial services.',
       'PM': 'Philip Morris International manufactures and sells cigarettes and tobacco products worldwide.',
       'QCOM': 'QUALCOMM Inc. designs and markets wireless telecommunications products and services.',
        'AMGN': "Amgen (AMGN): Biotechnology giant focused on developing innovative therapies to treat serious illnesses.",
        'IBM': "IBM (IBM): Technology company offering hardware, software, and consulting services.",
        'TXN': "Texas Instruments (TXN): Semiconductor company specializing in analog and embedded processing products.",
        'NOW': "ServiceNow (NOW): Cloud computing platform providing solutions for IT service management and operations management.",
        'COP': "ConocoPhillips (COP): Energy company engaged in the exploration, production, and marketing of oil and gas.",
        'UNP': "Union Pacific (UNP): Transportation company operating one of the largest railroad networks in North America.",
        'BA': "Boeing (BA): Aerospace company known for aircraft manufacturing, defense products, and related services.",
        'SPGI': "S&P Global (SPGI): Financial information and analytics company offering credit ratings, market data, and research.",
        'GE': "General Electric (GE): Diversified technology and manufacturing company operating in aviation, power, and healthcare sectors.",
        'MS': "Morgan Stanley (MS): Financial services firm providing investment banking, securities, wealth management, and investment management.",
        'BX': "Blackstone (BX): Global investment firm offering alternative asset management and financial advisory services.",
        'UPS': "United Parcel Service (UPS): Logistics company specializing in package delivery, freight transportation, and supply chain management.",
        'CAT': "Caterpillar (CAT): Manufacturing company producing construction and mining equipment, diesel and natural gas engines, industrial gas turbines.",
        'HON': "Honeywell International (HON): Multinational conglomerate providing products and services in aerospace, building technologies, and performance materials.",
        'BHP.L': "BHP Group Limited (BHP.L): Global resources company specializing in the production and exploration of minerals, oil, and gas.",
        'AMAT': "Applied Materials (AMAT): Supplier of semiconductor manufacturing equipment, services, and software to chipmakers worldwide.",
        'BUD': "Anheuser-Busch Inbev (BUD): Multinational beverage company engaged in brewing, marketing, and distribution of beer and other beverages.",
        'CDI.PA': "Christian Dior (CDI.PA): Luxury goods company specializing in fashion, perfumes, cosmetics, and watches.",
        'RY': "Royal Bank Of Canada (RY): Financial services company providing personal and commercial banking, wealth management, and investment services.",
        'UL': "Unilever (UL): Consumer goods company offering a wide range of food, beverages, cleaning agents, and personal care products.",
         'HSBA.L': "HSBC Holdings PLC (HSBA.L): One of the world's largest banking and financial services organizations, serving customers worldwide.",
       'NEE': "NextEra Energy (NEE): One of the largest clean energy companies in the United States, specializing in electricity generation and distribution.",
       'AXP': "American Express (AXP): Global financial services corporation providing payment, travel, and financial management services.",
       'SBUX': "Starbucks (SBUX): International coffeehouse chain offering a variety of coffee, beverages, pastries, and snacks.",
       'SNY': "Sanofi (SNY): Global pharmaceutical company focused on researching, developing, and marketing medications.",
       'T': "AT&T (T): Telecommunications company providing wireless services, internet, and TV services to consumers and businesses.",
       'LOW': "Lowe's Companies (LOW): Home improvement retailer offering a wide range of products for construction, repair, maintenance, and remodeling.",
       'RIO': "Rio Tinto Plc (RIO): Mining and metals company engaged in the exploration, production, and processing of minerals and resources.",
   }

export default function Ticker({ ticker }) {
  const router = useRouter();

  const logoPath = `https://www.stockstobuynow.ai/assets/assets/logo/${ticker}.webp`;
  const pageTitle = `${ticker} AI Analysis: Financial Forecast, Economics, Social Hype, and Technical Trading in Stocks To Buy Now - Invest better`;
  const pageDescription = `${ticker} Financial Forecast and Price Prediction on Stocks To Buy Now AI - best trading tool invest in stocks and crypto before they skyrocket - ${company_descriptions[ticker] || 'ticker'}`; // Update with your description

  if (router.isFallback || !ticker) {
    return <b>Loading…</b>;
  }

  // Check for an invalid ticker value or handle other error scenarios
  if (ticker === '') {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={logoPath} />
      </Head>

      <div className="iframe-container">
        <iframe src={`https://www.stockstobuynow.ai/web-app#/financial/${ticker}`} />
        <style jsx>{`
          .iframe-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          iframe {
            border: none;
            width: 100%;
            height: 100%;
            display: block;
          }
        `}</style>
      </div>
    </>
  );
}
export async function fetchAvailableTickers() {
  const availableTickers = stockDataSearch.map((stock) => stock.ticker);
  return availableTickers;
}

// This method tells Next.js which dynamic routes to pre-render
export async function getStaticPaths() {
  // Fetch available tickers from your API or source
  const availableTickers = await fetchAvailableTickers(); // Implement your fetching logic

  // Map available tickers to the paths Next.js should pre-render
  const paths = availableTickers.map((ticker) => ({
    params: { ticker },
  }));

  return {
    paths,
    fallback: true, // or 'blocking' for incremental static regeneration
  };
}

// This method is called at build time to fetch data for a specific ticker
export async function getStaticProps({ params }) {
  const { ticker } = params;
  // Fetch data for the ticker from your API or server
  // Example: const tickerData = await fetchTickerData(ticker);

  // Return the ticker data as props
  return { props: { ticker } };
}