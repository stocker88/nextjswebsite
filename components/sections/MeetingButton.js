import LocalizedContent from '../localization/LocalizedContent';
import React from 'react';
import NewsletterSignUp from '../formStocker';

const MeetingButton = () => {
  return (
    <LocalizedContent><section className="download-section" aria-labelledby="download-title">
      <p>Available on iOS and Android</p>
      <h2 id="download-title">Put smarter market insights in your pocket.</h2>
      <NewsletterSignUp from="FinalFooter" />
    </section></LocalizedContent>
  );
};

export default MeetingButton;
