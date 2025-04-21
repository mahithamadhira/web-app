import React from 'react';
import { useAuth } from '../../context/AuthContext';
import HomeInstructor from '../Instructor/HomeInstructor.jsx';
import HomeStudent from '../Student/HomeStudent.jsx';
import HomeGrader from '../Grader/HomeGrader.jsx';

const RoleBasedHome = () => {
    const { user } = useAuth();
    const role = user?.role;

    if (role === 'Instructor') return <HomeInstructor />;
    if (role === 'Student') return <HomeStudent />;
    if (role === 'Grader') return <HomeGrader />;

    return <div>❌ Unknown role</div>;
};

export default RoleBasedHome;
