import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Home from './components/Home/Home';
import CreateCourse from "./components/Course/CreateCourse";

import { useAuth } from './context/AuthContext';
import CreateAssignment from "./components/Assignment/CreateAssignment";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/create-course"
                           element={
                                <ProtectedRoute>
                                    <CreateCourse />
                                </ProtectedRoute>
                            }
                    />
                    <Route path="/create-assignment"
                           element={
                               <ProtectedRoute>
                                   <CreateAssignment />
                               </ProtectedRoute>
                           }
                    />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;