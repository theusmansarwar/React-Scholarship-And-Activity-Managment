import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateAdminRoute = ({ isAdmin, ...rest }) => {
    console.log(isAdmin);

    return isAdmin ? <Outlet /> : <Navigate to="/login" />
};

export default PrivateAdminRoute;
