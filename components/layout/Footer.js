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
          <Link href="/posts/privacypolicy">Privacy Policy</Link>
        </div>

        <div className="footer-link-block">
          <span>Support</span>
          <a href="mailto:support@stockstobuynow.ai">support@stockstobuynow.ai</a>
        </div>
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
