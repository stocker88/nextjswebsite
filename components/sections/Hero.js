import DesktopAppLink from '../DesktopAppLink';
import {useSiteAccount} from '../SiteAccount';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import InstallButtonsWithQR from '../elements/InstallButtonsWithQR';
import Image from 'next/image';
import { openInbox } from 'react'
import Container from '../container'
import CompactSignUp from '../CompactSignUp'


const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const Hero = ({
  className,
  ...props
}) => {



  const {desktop}=useSiteAccount();
  const [showScrollCue, setShowScrollCue] = useState(false);
  useEffect(() => {
    if (!className?.includes('mobile-download-hero') || !window.matchMedia('(max-width:1023px)').matches || window.scrollY > 8) return;
    setShowScrollCue(true);
    const dismiss = () => {
      if (window.scrollY > 8) {
        setShowScrollCue(false);
        window.removeEventListener('scroll', dismiss);
      }
    };
    window.addEventListener('scroll', dismiss, {passive:true});
    return () => window.removeEventListener('scroll', dismiss);
  }, [className]);

  const outerClasses = classNames(
    'hero section center-content',
    'has-bg-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
  );

  return (
    <section
      {...props}
      className={outerClasses}
      id="home"
    >
<div className="hero-atmosphere" data-motion-depth="28" aria-hidden="true"><i /><i /></div>
<Container>
<br></br>
<center>
      <div className="container-sm has-animations" style={{  zIndex: 10 }}>
          <div className="hero-content">
     <div className="hero-top-space" style={{paddingTop: 'clamp(72px, 9vw, 110px)'}}> </div>

         {/*    <Image
              src={require('assets/images/stockstobuynow.png')}
              alt="StocksToBuyNow app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading"
              width={700}
              height={58.33}
              />*/}

            <Image
                  className="hero-robot" src='/assets/images/stockerRobotIcon.png'
                  alt="StocksToBuyNow AI App"
                  priority={true}
                  width={156}
                  height={156}
                 style={{
                 borderRadius: '10px',
                 opacity:0.9,
                 width:'min(max(145px,13vw),200px)',
                  height:'min(max(145px,13vw),200px)',
                  }}

                  />
            <div className="container-xs">
            <br></br>
            <h1 data-motion-intro className="text-3xl md:text-6xl tracking-tighter leading-tight" style={{ color: 'white', lineHeight: 1.2, maxWidth: "800px" }} >
                Wish someone told you about Nvidia when it was <b>$5 instead of $100</b>?
              </h1>
              <div className="hero-content-space" style={{paddingTop: 'max(25px,2.2vw)'}}></div>
          <h2  style={{ color: 'white',fontWeight: 600, fontSize: "min(19px,max(17px,3vw))", lineHeight: 1.3, maxWidth: "650px" }} >
             Your professional macro investment team.
            </h2>
            <p className="hero-research-description" style={{ color: 'rgba(255,255,255,.85)', fontSize: '15px', fontWeight: 400, lineHeight: 1.45, maxWidth: '540px', margin: '10px auto 0' }}>
              Data-driven insights into the macro picture, company fundamentals, insider activity, unusual options volume and technical timing.
            </p>
          </div>

        </div>
<div className="hero-content-space" style={{paddingTop: 'max(25px,2.2vw)'}}></div>
 </div>
 </center>
 </Container>
<div className="hero-cta-group" data-motion-intro={className?.includes('mobile-download-hero') ? undefined : 'later'}>
  <CompactSignUp placement="hero"/>
</div>
<div className="hero-content-space" style={{paddingTop: 'max(25px,2.2vw)'}}></div>
<Container>
<center>

          <Image
           className="hero-rating" src='/assets/images/usersRating.webp'
           alt="Customer review illustration"
           priority={true}
          width={150}
          height={50*3/4}
           />

    <div style={{ color: 'lightGrey', fontSize: "min(14px,max(13px,1.3vw))", lineHeight: 1.35,maxWidth: "350px",textShadow: '5px 5px 5px rgba(0, 0, 0, 0)' }} className="reveal-from-bottom hero-review-links" data-reveal-delay="150">
       Read customer reviews on{' '}
       <a href="https://www.trustpilot.com/review/stockstobuynow.ai" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px'}}>Trustpilot</a>
       <div>{desktop?<DesktopAppLink href="https://apps.apple.com/us/app/stocks-to-buy-now-ai-signals/id1565527320">{'Explore the app →'}</DesktopAppLink>:<>
         Reviews on{' '}
         <a href="https://apps.apple.com/us/app/stocks-to-buy-now-ai-signals/id1565527320" target="_blank" rel="noopener noreferrer" style={{color:'inherit',textDecoration:'underline',textUnderlineOffset:'3px'}}>Apple Store</a>
         {' '}and{' '}
         <a href="https://play.google.com/store/apps/details?id=com.newcompany.stocker" target="_blank" rel="noopener noreferrer" style={{color:'inherit',textDecoration:'underline',textUnderlineOffset:'3px'}}>Google Play</a>
       </>}</div>
    </div>
    <a href="/authors/aness-hussein-ali/" className="hero-founder-link" style={{display:'flex',width:'100%',maxWidth:350,boxSizing:'border-box',justifyContent:'center',alignItems:'center',gap:6,marginTop:4,padding:0,color:'lightGrey',fontSize:'min(14px,max(13px,1.3vw))',lineHeight:1.35,fontWeight:400,textDecoration:'underline',textUnderlineOffset:'3px'}}>Meet our Founder</a>
<div className="hero-bottom-space" style={{ height: 'clamp(40px, 7vw, 88px)' }} />




 </center>
 </Container>
    {showScrollCue && <a className="hero-scroll-cue" href="#desktop-product-intro" aria-label="Explore more below" onClick={() => setShowScrollCue(false)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></a>}
    <style jsx global>{`
      .hero-scroll-cue{display:none}

      @media(max-width:1023px){
        .mobile-download-hero{min-height:100vh;min-height:100svh;box-sizing:border-box;border-bottom:0!important;box-shadow:none!important}
        .mobile-download-hero .hero-cta-group,.mobile-download-hero .hero-cta-group .app-download-cta{animation:none!important;transform:none!important;translate:none!important}
        .hero-scroll-cue{display:flex;align-items:center;justify-content:center;position:fixed;left:50%;bottom:calc(8px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:44px;height:44px;color:rgba(255,255,255,.55);z-index:20;text-decoration:none}
        .hero-scroll-cue:focus-visible{outline:1px solid #ffffff99;border-radius:50%}
        .mobile-download-hero::before,.mobile-download-hero::after{display:none!important}
        .mobile-download-hero + #desktop-product-intro{border-top:0!important;box-shadow:none!important;margin-top:-1px}
        .mobile-download-hero + #desktop-product-intro + #product-reveal{border-top:0!important;margin-top:-1px}
      }
      @media(min-width:401px) and (max-width:1023px){
        .mobile-download-hero .hero-top-space{padding-top:64px!important}
        .mobile-download-hero .hero-content{padding-inline:8px}
        .mobile-download-hero .hero-content-space{padding-top:30px!important}
        .mobile-download-hero .hero-bottom-space{height:48px!important}
      }
      @media(min-width:401px) and (max-width:600px){
        .mobile-download-hero .hero-top-space{padding-top:32px!important}
      }
      @media(max-width:400px){
        .mobile-download-hero .hero-top-space{padding-top:38px!important}
        .mobile-download-hero .hero-robot{width:104px!important;height:104px!important;border-radius:18px!important;opacity:1!important}
        .mobile-download-hero .hero-content .container-xs>br{display:none}
        .mobile-download-hero h1{font-size:clamp(27px,6.8vw,36px)!important;line-height:1.16!important;margin:22px auto 0!important;max-width:470px!important}
        .mobile-download-hero h2{font-size:15px!important;line-height:1.4!important;max-width:330px!important;margin:0 auto!important}
        .mobile-download-hero .hero-research-description{font-size:13px!important;max-width:330px!important;margin-top:8px!important}
        .mobile-download-hero .hero-content-space{padding-top:21px!important}
        .mobile-download-hero .hero-cta-group .app-download-cta{min-height:44px;min-width:170px;font-size:14px}
        .mobile-download-hero .hero-rating{width:125px!important;height:auto!important;margin:0 auto 5px}
        .mobile-download-hero .hero-review-links,.mobile-download-hero .hero-founder-link{font-size:11px!important;line-height:1.45!important}
        .mobile-download-hero .hero-bottom-space{height:30px!important}
      }
    `}</style>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
