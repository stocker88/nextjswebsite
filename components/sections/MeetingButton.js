import React from 'react';
import ReferralRecovery from '../ReferralRecovery';
import NewsletterSignUp from '../formStocker';

const MeetingButton = () => {
  return (
    <section className="download-section" aria-labelledby="download-title">
      <p>Available on iOS and Android</p>
      <h2 id="download-title">Put smarter market insights in your pocket.</h2>
      <NewsletterSignUp from="FinalFooter" />
      <ReferralRecovery />
    </section>
  );
};

export default MeetingButton;
