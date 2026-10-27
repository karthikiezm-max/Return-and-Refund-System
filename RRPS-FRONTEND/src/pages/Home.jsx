import React from 'react';
import { CustomerHome } from './customer/CustomerHome';

// Appendix I.3 Home.jsx conformant export
export const Home = ({ onNavigate }) => {
  return <CustomerHome onNavigate={onNavigate} />;
};

export default Home;
