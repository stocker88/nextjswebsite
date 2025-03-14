import React, { Component } from "react";
import Image from 'next/image';
import LinkedInIconWhite from '../../components/linkediniconwhite';
class Header extends Component {

  render() {

    const FbSvg = (props) =>(
                <svg
                              width="19"
                              height="19"
                              viewBox="0 0 16 16"
                              xmlns="http://www.w3.org/2000/svg">
                              <title>Facebook</title>
                              <path
                                d="M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z" fill="white" />
                            </svg>
                )

    return (

    <header id="home">

                <ul id="nav" className="nav" style={{ backgroundColor: 'hsl(200, 100%, 48%)' , padding: '20px 20px 0px 20px' , display:'flex'}}>


                 <li>
                      <a href='https://www.linkedin.com/posts/anesshusseinali_multibagger-activity-7260416453328138242-S41Q' target="_blank" >
                        <LinkedInIconWhite/>
                      </a>
                    </li>

                    <li style={{paddingLeft:'10px'}}>
                                          <a href="https://www.instagram.com/stockstobuynow.ai?igsh=MWs4dTVndzk3NXkzZA%3D%3D&utm_source=qr">
                                            <svg
                                              width="34"
                                              height="34"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <title>Instagram</title>
                                              <path
                                                d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.25a1.25 1.25 0 0 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM12 4c-2.474 0-2.878.007-4.029.058-.784.037-1.31.142-1.798.332-.434.168-.747.369-1.08.703a2.89 2.89 0 0 0-.704 1.08c-.19.49-.295 1.015-.331 1.798C4.006 9.075 4 9.461 4 12c0 2.474.007 2.878.058 4.029.037.783.142 1.31.331 1.797.17.435.37.748.702 1.08.337.336.65.537 1.08.703.494.191 1.02.297 1.8.333C9.075 19.994 9.461 20 12 20c2.474 0 2.878-.007 4.029-.058.782-.037 1.309-.142 1.797-.331.433-.169.748-.37 1.08-.702.337-.337.538-.65.704-1.08.19-.493.296-1.02.332-1.8.052-1.104.058-1.49.058-4.029 0-2.474-.007-2.878-.058-4.029-.037-.782-.142-1.31-.332-1.798a2.911 2.911 0 0 0-.703-1.08 2.884 2.884 0 0 0-1.08-.704c-.49-.19-1.016-.295-1.798-.331C14.925 4.006 14.539 4 12 4zm0-2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2z" fill="white"/>
                                            </svg>
                                          </a>
                                        </li>
                        {/*<li>

                      <a className="smoothscroll" href="#overview" style={{color:"white", fontSize:"min(23px,max(17px,1vw))"}}>
                        Overview
                      </a>
                      </li>

                       <li>
                        <a className="smoothscroll" href="#features" style={{color:"white", fontSize:"min(23px,max(17px,1vw))"}}>
                        Features
                        </a>
                         </li>

                    <a className="smoothscroll" href="#blog" style={{color:"white", fontSize:"min(23px,max(16px,1vw))"}}>
                          Blog
                        </a>
                         </li>
                         <li>


                                <li>
                                  <a href="https://www.tiktok.com/@learnwithaness?_t=8f6nKI1QaWn&_r=1" >

                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 40 40"
                                      xmlns="http://www.w3.org/2000/svg">
                                      <title>Stocker Tik Tok</title>
                                      <path
                                        d="M16.229,10C39.436,10,40,10.564,40,17.77v14.507C40,39.439,39.44,40,32.277,40H17.723C10.56,40,10,39.439,10,32.277V17.723	C10,10.56,10.56,10,17.723,10H32.229z M34.07,23.433v-3.201c0,0-1.77,0.009-3.265-1.301c-1.256-1.1-1.36-3.161-1.36-3.161h-3.348	c0,0,0,10.925,0,12.666s-1.584,2.641-2.72,2.641c-0.856,0-2.804-0.642-2.804-2.661c0-2.12,2.239-2.661,2.825-2.661	c0.586,0,0.816,0.12,0.816,0.12v-3.379c0,0-0.544-0.05-0.942-0.063c-3.38-0.109-6.173,2.79-6.173,5.983	c0,2.697,2.206,5.963,6.236,5.963c4.293,0,6.257-3.423,6.257-5.943c0-1.841,0-6.283,0-6.283s1.235,0.66,2.239,0.96	C32.835,23.413,34.07,23.433,34.07,23.433z" fill="white"/>
                                    </svg>
                                  </a>
                                </li>


                                           <li>
                                                                          <a href="https://twitter.com/anesshusseinali" >

                                                                            <svg
                                                                              width="18"
                                                                              height="18"
                                                                              viewBox="0 0 16 16"
                                                                              xmlns="http://www.w3.org/2000/svg">
                                                                              <title>Stocker Twitter</title>
                                                                              <path
                                                                                d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z" fill="white"/>
                                                                            </svg>
                                                                          </a>
                                                                        </li>
                                          <li>
                                         <a href="https://www.youtube.com/channel/UCQU92dBvlCZMsnFHdDI9tSQ" >

                                                                            <svg
                                                                              width="18"
                                                                              height="18"
                                                                              viewBox="0 0 16 16"
                                                                              xmlns="http://www.w3.org/2000/svg">
                                                                              <title>Stocker YouTube channel</title>
                                                                              <path
                                                                                d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" fill="white"/>
                                                                            </svg>
                                                                          </a>
                                                                        </li>
                                                                           <li>
                                                           <a href={`mailto:support@stockstobuynow.ai`} >

                                                                                <svg
                                                                                  width="19"
                                                                                  height="19"
                                                                                  viewBox="0 0 490 490"
                                                                                  xmlns="http://www.w3.org/2000/svg">
                                                                                  <title>Stocker Support Email</title>
                                                                                  		<path d="M295.2,257.8L251.4,295c-3.5,2.9-8.6,2.9-12,0l-43.8-37.1L16.7,409.1h456.6L295.2,257.8z" fill="white"/>
                                                                                        <polygon points="0,92.2 0,397.8 180.1,245 			" fill="white"/>
                                                                                        <polygon points="16.7,80.9 245,274.6 473.3,80.9 			" fill="white"/>
                                                                                        <polygon points="309.9,245 490,397.8 490,92.2 			" fill="white"/>
                                                                                </svg>
                                                                              </a>
                                                                            </li>
*/}
              </ul>



               </header>
    );
  }
}

export default Header;
