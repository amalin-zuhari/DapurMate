import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import HomePage from './HomePage'; // Ensure this file exists
import InventoryPage from './InventoryPage'; // Ensure this file exists
import './Sidebar.css'; // Custom CSS

function SidebarWrapper() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default SidebarWrapper;
