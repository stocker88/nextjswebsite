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
      className={classes}
    >
    <Container>
      <div className="container">
        <div className={
          classNames(
            'site-footer-inner',
            'has-top-divider',
          )}>
          <div className="footer-bottom space-between text-xxs invert-order-desktop">
            <nav
                  {...props}
                  className={classes}
                ></nav>
            <div className="footer-copyright" style={{color:"white", fontFamily: 'arial'}}>
                        <Link href="privacypolicy" style={{color:"white", fontFamily: 'arial'}}> Privacy Policy </Link>

                        <br></br>
                        <br></br>

                        <a href={`mailto:support@hellostocker.com`} style={{color:"white", fontFamily: 'arial'}}> Contact Support Team </a>

                        <br></br>
                        <br></br>

                        <a href={'https://www.linkedin.com/in/anesshusseinali/'} style={{color:"white", fontFamily: 'arial'}}> Contact our Founder </a>

                        <br></br>
                        <br></br>

                        Made by HelloStocker, for you

            </div>
            <br></br>
            <br></br>
            <br></br>
          </div>
        </div>
      </div>
      </Container>
    </footer>
  );
}

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;
