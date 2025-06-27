import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './i18n/i18n'; // Initialize i18n

// Context
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundAnimations from './components/FlyingAirplanes';

// Pages
import Home from './pages/Home';
import Plans from './pages/Plans';
import About from './pages/About';
import Contact from './pages/Contact';

// Services
import { chatApi } from './services/chatApi';

// Component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNewChat = async () => {
    try {
      const newSession = await chatApi.createSession({
        title: 'New Chat'
      });
      console.log('New chat created:', newSession);
      // You can add additional logic here, like navigating to the new chat
    } catch (err) {
      console.error('Error creating new chat:', err);
    }
  };

  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="app-container">
              <BackgroundAnimations />
              <ScrollToTop />
              <Navbar 
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={handleToggleSidebar}
                onNewChat={handleNewChat}
              />
              
              <div className="content">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <Home 
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={handleToggleSidebar}
                        onNewChat={handleNewChat}
                      />
                    } 
                  />
                  <Route path="/plans" element={<Plans />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </div>
              
              <Footer sidebarCollapsed={sidebarCollapsed} />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
