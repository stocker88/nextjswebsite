import React from 'react';
import classNames from 'classnames';

const FooterNav = ({
  className,
  ...props
}) => {

  const classes = classNames(
    'footer-nav',
    className
  );

    const FbSvg = (props) =>(
                <svg
                              width="17"
                              height="17"
                              viewBox="0 0 16 16"
                              xmlns="http://www.w3.org/2000/svg">
                              <title>Facebook</title>
                              <path
                                d="M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z" fill="white" />
                            </svg>
                )

  return (
    <nav
      {...props}
      className={classes}
    >
      <ul className="list-reset">

             <li>
                                              <a href={`mailto:support@stockstobuynow.ai`} >

                                                <svg
                                                  width="20"
                                                  height="20"
                                                  viewBox="0 0 490 490"
                                                  xmlns="http://www.w3.org/2000/svg">
                                                  <title>Stocker Stocks and cryptos Support Email</title>
                                                  		<path d="M295.2,257.8L251.4,295c-3.5,2.9-8.6,2.9-12,0l-43.8-37.1L16.7,409.1h456.6L295.2,257.8z" fill="white"/>
                                                        <polygon points="0,92.2 0,397.8 180.1,245 			" fill="white"/>
                                                        <polygon points="16.7,80.9 245,274.6 473.3,80.9 			" fill="white"/>
                                                        <polygon points="309.9,245 490,397.8 490,92.2 			" fill="white"/>
                                                </svg>
                                              </a>
                                            </li>
            <li>
              <a href="https://twitter.com/StocksToBuyNow">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg">
                  <title>Stocker Stocks and crypto Twitter</title>
                  <path
                    d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z" fill="white"/>
                </svg>
              </a>
            </li>


            <li>
              <a href="https://t.me/stockerapp">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 23 23"
                  xmlns="http://www.w3.org/2000/svg">
                  <title>Stocker Stocks and crypto Telegram</title>
                  <path
                    fill="white" d="m16 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>

            </svg>
              </a>
            </li>
          </ul>
    </nav>
  );
}

export default FooterNav;
