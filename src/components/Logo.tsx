import React from 'react';
import logo from '../images/logo-no-bg.png';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
    <img src={logo} alt="Cartified logo" className="h-10 w-10" width={300} height={200}/>
      <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        <h1 className="text-2xl font-extrabold pb-0">CARTIFIED</h1>
        <p className="text-gray-400 text-xs">Carted, Certified, Verified</p>
      </div>
    </div>
  );
};

export default Logo;