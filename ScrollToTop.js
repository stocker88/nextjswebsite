import { useEffect } from 'react';
import { scroller } from "react-scroll";

const ScrollToTop = ({ children, location: { pathname } }) => {
  useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return children || null;
};

export default ScrollToTop;
