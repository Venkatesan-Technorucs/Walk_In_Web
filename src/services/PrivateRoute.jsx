import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate, Outlet } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';

const PrivateRoute = ({ requiredRole }) => {
    let { state } = useAuth();

    if (state.loading) {
        return (
            <div className='w-screen h-screen flex items-center justify-center bg-(--header-bg)'>
                <ProgressSpinner className='h-16' />
            </div>
        );
    }

    if (!state.user) {
        return <Navigate to='/register' replace />
    }

    if (requiredRole) {
        if (Array.isArray(requiredRole)) {
            if (!requiredRole.includes(state.user.role)) {
                return <Navigate to="/login" replace />;
            }
        } else if (state.user.role !== requiredRole) {
            return <Navigate to="/login" replace />;
        }
    }
    return <Outlet />;
}

export default PrivateRoute