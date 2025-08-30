import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop({ children }) {
  const { pathname } = useLocation();
  console.log("scroll to top")
  useEffect(() => {
    console.log(pathname)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return children || null ;
}

export default ScrollToTop;
