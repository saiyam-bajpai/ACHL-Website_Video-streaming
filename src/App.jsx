import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import ForHR from './pages/ForHR';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import ForStartups from './pages/ForStartups';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import DashboardCourses from './pages/DashboardCourses';
import CoursePlayer from './pages/CoursePlayer';
import Classroom from './pages/Classroom';
import Admin from './pages/Admin';
import TestConsole from './pages/TestConsole';
import NotFound from './pages/NotFound';
import Investor from './pages/Investor';

import ProtectedRoute from './components/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:slug" element={<ProgramDetail />} />
        <Route path="/for-hr" element={<ForHR />} />
        <Route path="/for-startups" element={<ForStartups />} />
        <Route path="/explore" element={<Resources />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:slug" element={<ResourceDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Student Workspace */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/courses" element={<ProtectedRoute><DashboardCourses /></ProtectedRoute>} />
        <Route path="/learn/:courseSlug" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
        <Route path="/classroom/:sessionId" element={<ProtectedRoute><Classroom /></ProtectedRoute>} />
        <Route path="/test/:slug" element={<ProtectedRoute><TestConsole /></ProtectedRoute>} />
        
        {/* Admin Console */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />

        {/* Investor Dashboard */}
        <Route path="/view/investor" element={<ProtectedRoute allowedRoles={['Investor', 'Admin', 'SuperAdmin']}><Investor /></ProtectedRoute>} />

        {/* 404 Fallback page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
