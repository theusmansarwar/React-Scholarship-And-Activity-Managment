import React from 'react';
import {  Navigate, Outlet } from 'react-router-dom';

const PrivateuserRoute = ({  isUser, ...rest }) => {
  console.log(isUser);

  return isUser ? <Outlet/> : <Navigate to="/login" />
};

export default PrivateuserRoute;





