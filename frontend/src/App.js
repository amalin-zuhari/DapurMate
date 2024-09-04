import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar/Sidebar'; // Sidebar component
import LandingPage from './Components/LandingPage'; // Other components
import Login from './Components/Login/Login';
import Inventory from './Components/Inventory/Inventory';
import ForgotPassword from './Components/Login/ForgotPassword';
import ResetPassword from './Components/Login/ResetPassword';
import VerificationSuccess from './Components/Login/VerificationSuccess';
import VerifyYourEmail from './Components/Login/VerifyYourEmail';
import PriceComparison from './Components/PriceComparison/PriceComparison';
import { ShopListWrapper } from './Components/ShoppingList/ShopListWrapper';
import Recipe from './Components/Recipe/Recipe';
import RecipeDetail from './Components/Recipe/RecipeDetail';
import AddRecipe from './Components/Recipe/AddRecipe';
import Dashboard from './Components/Homepage/Dashboard';
import FooterHome from './Components/Homepage/FooterHome'; // Footer component
import './App.css'; // Main global CSS


// SidebarWrapper component to handle sidebar display logic
function SidebarWrapper({ children }) {
  const [collapsed, setCollapsed] = useState(false); // State to handle the collapsed sidebar
  const location = useLocation();

  // Define the routes that should display the sidebar and footer
  const routesWithSidebarAndFooter = [
    '/inventory',
    '/price-comparison',
    '/recipe',
    '/recipe/:id',
    '/add-recipe',
    '/shopping-list',
    '/dashboard',
  ];

  // Check if the current path should show the sidebar and footer
  const shouldShowSidebar = routesWithSidebarAndFooter.some((route) => {
    return new RegExp(`^${route.replace(':id', '[^/]+')}$`).test(location.pathname);
  });

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`App ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      {/* Conditionally render the Sidebar based on the route */}
      {shouldShowSidebar && (
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} /> // Pass collapsed and toggle function
      )}
      <div className={`content ${shouldShowSidebar ? 'content-with-sidebar' : 'content-full'} ${collapsed ? 'collapsed' : ''}`}>
        {children}
      </div>
      {/* Conditionally render the Footer */}
      {shouldShowSidebar && <FooterHome />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <SidebarWrapper>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify-email" element={<VerifyYourEmail />} />
          <Route path="/verify-success" element={<VerificationSuccess />} />
          <Route path="/verify/:token" element={<VerificationSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/price-comparison" element={<PriceComparison />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/shopping-list" element={<ShopListWrapper />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </SidebarWrapper>
    </Router>
  );
}

export default App;
