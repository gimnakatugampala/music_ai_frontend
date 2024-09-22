import React from 'react';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const location = useLocation();
  
  // Function to get the code from the query parameters
  const getCodeFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('code'); // This will return '150' in your example
  };

  const code = getCodeFromUrl();

  return (
    <div>
      Index
      {code && <p>Code: {code}</p>}
    </div>
  );
};

export default Index;
