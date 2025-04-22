import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/Dashboard';
import CourseTypeManager from './components/CourseTypeManager';
import CourseManager from './components/CourseManager';
import CourseOfferingManager from './components/CourseOfferingManager';
import StudentManager from './components/StudentManager';
import { AppProvider } from './context/AppContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'courseTypes':
        return <CourseTypeManager />;
      case 'courses':
        return <CourseManager />;
      case 'courseOfferings':
        return <CourseOfferingManager />;
      case 'students':
        return <StudentManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex  ">
        {/* <Navbar setSidebarOpen={setSidebarOpen} /> */}
        <div className='fixed'>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        /> 
        </div>
        <div className="w-full flex-1 pl-64" >
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-scroll">
            {renderContent()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;