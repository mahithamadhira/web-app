import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import ProtectedRoute from '../components/ProtectedRoute';

import RoleBasedHome from '../pages/Common/RoleBasedHome';
import HomeStudent from '../pages/Student/HomeStudent';
import HomeInstructor from '../pages/Instructor/HomeInstructor';
import HomeGrader from '../pages/Grader/HomeGrader';

import CreateCourse from '../pages/Instructor/CreateCourse';
import CreateAssignment from '../pages/Instructor/CreateAssignment';
import RubricsSetup from '../pages/Instructor/RubricsSetup';
import GradesOverview from '../pages/Instructor/GradesOverview';
import InstructorCourseDetail from '../pages/Instructor/InstructorCourseDetail';
import AssignmentDetail from '../pages/Instructor/AssignmentDetail';

import AssignmentDeadlines from '../pages/Student/AssignmentDeadlines';
import CourseDetailPage from '../pages/Student/CourseDetailPage';
import AssignmentToReview from "../pages/Student/AssignmentToReview.jsx";

import GraderAssignmentDetail from "../pages/Grader/GraderAssignmentDetail.jsx";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* ✅ Role-based redirection after login */}
                <Route path="/home" element={
                    <ProtectedRoute>
                        <RoleBasedHome />
                    </ProtectedRoute>
                } />

                {/* ✅ Instructor Routes */}
                <Route path="/instructor" element={
                    <ProtectedRoute>
                        <HomeInstructor />
                    </ProtectedRoute>
                } />
                <Route path="/create-course" element={
                    <ProtectedRoute>
                        <CreateCourse />
                    </ProtectedRoute>
                } />
                <Route path="/create-assignment" element={
                    <ProtectedRoute>
                        <CreateAssignment />
                    </ProtectedRoute>
                } />
                <Route path="/create-assignment/rubrics" element={
                    <ProtectedRoute>
                        <RubricsSetup />
                    </ProtectedRoute>
                } />
                <Route path="/course/:courseName" element={
                    <ProtectedRoute>
                        <InstructorCourseDetail />
                    </ProtectedRoute>
                } />
                <Route path="/assignment/:assignmentName" element={
                    <ProtectedRoute>
                        <AssignmentDetail />
                    </ProtectedRoute>
                } />
                <Route path="/course/:courseId/assignment/:assignId" element={
                    <ProtectedRoute>
                        <AssignmentDetail />
                    </ProtectedRoute>
                } />
                <Route path="/course/:courseName/grades" element={
                    <ProtectedRoute>
                        <GradesOverview />
                    </ProtectedRoute>
                } />

                {/* ✅ Student Routes */}
                <Route path="/student" element={
                    <ProtectedRoute>
                        <HomeStudent />
                    </ProtectedRoute>
                } />
                <Route path="/student/course/:courseid" element={
                    <ProtectedRoute>
                        <CourseDetailPage />
                    </ProtectedRoute>
                } />
                <Route path="/assignment/:id/student" element={
                    <ProtectedRoute>
                        <AssignmentDeadlines />
                    </ProtectedRoute>
                } />
                <Route path="/peer-review/:reviewId" element={
                    <ProtectedRoute>
                        <AssignmentToReview />
                    </ProtectedRoute>
                } />

                {/* ✅ Grader Routes */}
                <Route path="/grader" element={
                    <ProtectedRoute>
                        <HomeGrader />
                    </ProtectedRoute>
                } />
                <Route path="/grader/assignment/:assignmentId" element={
                    <ProtectedRoute>
                        <GraderAssignmentDetail />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
