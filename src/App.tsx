import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import AdminPage from './pages/AdminPage';
import AdminCourseEdit from './pages/AdminCourseEdit';
import AdminLessonEdit from './pages/AdminLessonEdit';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="curso/:courseId" element={<CoursePage />} />
        <Route path="curso/:courseId/aula/:lessonId" element={<LessonPage />} />
        <Route path="login" element={<LoginPage />} />
        
        {/* Rotas protegidas para administrador */}
        <Route path="admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="admin/curso/novo" element={<ProtectedRoute><AdminCourseEdit /></ProtectedRoute>} />
        <Route path="admin/curso/:courseId" element={<ProtectedRoute><AdminCourseEdit /></ProtectedRoute>} />
        <Route path="admin/curso/:courseId/aula/nova" element={<ProtectedRoute><AdminLessonEdit /></ProtectedRoute>} />
        <Route path="admin/curso/:courseId/aula/:lessonId" element={<ProtectedRoute><AdminLessonEdit /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;