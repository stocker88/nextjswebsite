import LocalizedContent from '../localization/LocalizedContent';
import {useSiteLanguage} from '../../lib/localization/use-site-language';
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

  const {t,href}=useSiteLanguage();
  const classes = classNames(
  );

  return (
    <LocalizedContent><footer
      {...props}
      className="professional-footer"
    >
    <Container>
      <div className="professional-footer-inner">
        <div className="footer-brand-block">
          <strong>Stocks To Buy Now Research</strong>
          <span>{t("Market insights, signals and investor education.")}</span>
        </div>

        <div className="footer-link-block">
          <span>{t("Company")}</span>
          <Link href={href("/company/")}>{t("About us")}</Link>
          <Link href={href("/authors/aness-hussein-ali/")}>{t("Meet the founder")}</Link>
          <Link href={href("/reviews/")}>{t("Public reviews")}</Link>
          <Link href={href("/company/culture/")}>{t("Culture")}</Link>
          <Link href={href("/company/careers/")}>{t("Careers")}</Link>
          <Link href={href("/posts/privacypolicy")}>{t("Privacy Policy")}</Link>
          <Link href="/legal/">Legal &amp; Disclosures</Link>
        </div>

        <div className="footer-link-block">
          <span>{t('Learn & Support')}</span>
          <Link href={href("/learn/")}>{t("Free video courses")}</Link>
          <Link href={href("/learn/get-certified/")}>{t("Get certified")}</Link>
          <Link href={href("/editorial-policy/")}>{t("Editorial standards")}</Link>
          <a href="mailto:support@stockstobuynow.ai">support@stockstobuynow.ai</a>
        </div>
      </div>
      <div className="footer-disclosure" style={{padding:'24px 0',fontSize:14,lineHeight:1.7}}>
        <p>{t('Founded by')} <Link href={href("/authors/aness-hussein-ali/")}>Aness Hussein Ali</Link>. {t('Stocks To Buy Now Research provides investment research tools and educational content. Investing involves loss of capital; options can lose their entire premium.')} </p>
        <p>{t('Education and examination history do not establish current professional registration or regulatory approval of this platform.')} <Link href={href("/methodology/")}>{t("Read our methodology and limitations")}</Link>.</p>
      </div>
      <div className="footer-bottom-line">
        <span>© {new Date().getFullYear()} Stocks To Buy Now Research</span>
        <span>{t("Made by the Stocks To Buy Now Research team, for you.")}</span>
      </div>
      </Container>
    </footer></LocalizedContent>
  );
}

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;
