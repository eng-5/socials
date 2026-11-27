// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const { user, loading, authError } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // avoid a flash-redirect while we're still checking localStorage
    }
    if (authError) {
        return <div>Can't reach the server, retry again</div>
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children
}

export default ProtectedRoute;