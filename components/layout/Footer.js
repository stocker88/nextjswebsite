import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Logo from './partials/Logo';
import FooterNav from './partials/FooterNav';
import Link from 'next/link';
import Container from 'components/container'

const propTypes = {
  topOuterDivider: PropTypes.bool,
  topDivider: PropTypes.bool
}

const defaultProps = {
  topOuterDivider: false,
  topDivider: false
}

const Footer = ({
  ...props
}) => {

  const classes = classNames(
  );

  return (
    <footer
      {...props}
      className="professional-footer"
    >
    <Container>
      <div className="professional-footer-inner">
        <div className="footer-brand-block">
          <strong>Stocks To Buy Now AI</strong>
          <span>Market insights, signals and investor education.</span>
        </div>

        <div className="footer-link-block">
          <span>Company</span>
          <Link href="/company/">About us</Link>
          <Link href="/authors/aness-hussein-ali/">Meet the founder</Link>
          <Link href="/reviews/">Public reviews</Link>
          <Link href="/company/culture/">Culture</Link>
          <Link href="/company/careers/">Careers</Link>
          <Link href="/posts/privacypolicy">Privacy Policy</Link>
        </div>

        <div className="footer-link-block">
          <span>Learn &amp; Support</span>
          <Link href="/learn/">Free video courses</Link>
          <Link href="/editorial-policy/">Editorial standards</Link>
          <a href="mailto:support@stockstobuynow.ai">support@stockstobuynow.ai</a>
        </div>
      </div>
      <div className="footer-disclosure" style={{padding:'24px 0',fontSize:14,lineHeight:1.7}}>
        <p>Founded by <Link href="/authors/aness-hussein-ali/">Aness Hussein Ali</Link>. Stocks To Buy Now AI provides investment research tools and educational content. Investing involves loss of capital; options can lose their entire premium. Selected examples and customer reviews are not a complete audited performance record.</p>
        <p>Education and examination history do not establish current professional registration or regulatory approval of this platform. <Link href="/methodology/">Read our methodology and limitations</Link>.</p>
      </div>
      <div className="footer-bottom-line">
        <span>© {new Date().getFullYear()} Stocks To Buy Now AI</span>
        <span>Made by the Stocks To Buy Now AI team, for you.</span>
      </div>
      </Container>
    </footer>
  );
}

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;
