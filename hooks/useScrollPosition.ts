// https://gist.run/?id=2ef12e1c5a621e9041aeafeb80bb6102
// https://github.com/vercel/next.js/discussions/18299

import { useState, useEffect } from "react";

const useScrollPosition = ( element: any ) => {

  const [position, setPosition] = useState(0);
  
  useEffect(() => {
      
    const refresh = () => {
      const boundingClientRect = element.current.getBoundingClientRect();
      setPosition(boundingClientRect.top);
    }

    if(element.current !== null) {
      refresh();
    }
    if(document) {
      document.body.addEventListener("scroll", refresh);
      return () => document.body.removeEventListener('scroll', refresh);
    }
  })

  return position;

};

export default useScrollPosition;