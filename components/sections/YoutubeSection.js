import React from 'react';

const playlistId = 'PLiBfVBTk2-F8r-7NsUrJ9Zjle_WIANUye';

const YoutubeSection = () => {
  return (
    <section id="watch-and-learn" className="playlist-section" aria-labelledby="playlist-title">
      <div className="playlist-shell">
        <div className="playlist-heading">
          <p>Learn for Free</p>
          <h2 id="playlist-title">Learn for Free</h2>
          <span>
            Explore the complete video playlist for practical walkthroughs,
            market insights and investing education.
          </span>
        </div>

        <div className="playlist-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`}
            title="Stocks To Buy Now AI YouTube playlist"
            loading="lazy"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <a
          className="playlist-link"
          href={`https://www.youtube.com/playlist?list=${playlistId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View the full playlist on YouTube
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
};

export default YoutubeSection;
