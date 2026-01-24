import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import FuzzyText from './FuzzyText';
  


const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <FuzzyText 
  baseIntensity={0.2}
  fontSize="40vw"
>
  404
</FuzzyText>
       
      </div>
    </div>
  );
};

export default NotFound;
