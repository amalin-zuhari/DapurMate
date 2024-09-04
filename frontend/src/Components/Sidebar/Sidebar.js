import React, { useState } from "react"; // Import React and useState hook
import { Menu } from "antd"; // Import Menu component from Ant Design
import { Link } from "react-router-dom"; // Import Link component for routing
import {
  UserOutlined,
  CarryOutOutlined,
  ShoppingCartOutlined,
  ProfileOutlined,
  DollarCircleOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons"; // Import icons from Ant Design
import "../../Styles/Sidebar.css"; // Import custom CSS for styling

const Sidebar = () => {
  // State hook to manage the collapse state of the sidebar
  const [collapsed, setCollapsed] = useState(false);

  // Function to toggle the sidebar's collapse state
  const toggleSidebar = () => {
    setCollapsed(!collapsed); // Toggle the collapsed state
    console.log("Sidebar collapsed:", !collapsed); // Log the updated collapse state
  };

  return (
    <div className="App-sidebar"> {/* Container for the sidebar */}
      <div className={`sidebar-main ${collapsed ? "collapsed" : ""}`}> {/* Main sidebar container */}
        <div className="logo-text-container"> {/* Container for logo and text */}
          {collapsed ? (
            <span className="logo-text-collapsed">DAPUR MATE</span> // Display logo text when collapsed
          ) : (
            <div className="sidebar-logo-container"> {/* Container for logo image */}
              <img
                src="/dapurmateLogo.png" // Path to the logo image
                alt="Dapurmate Logo" // Alt text for the image
                width="100" // Width of the logo
                height="100" // Height of the logo
                className="sidebar-logo" // CSS class for styling the logo
              />
            </div>
          )}
        </div>

        <div className="menu-wrapper"> {/* Container for the menu */}
          <Menu
            mode="inline" // Set the menu to inline mode
            defaultSelectedKeys={["1"]} // Default selected menu item
            inlineCollapsed={collapsed} // Apply collapsed state to the menu
          >
            {/* Menu items with icons and links */}
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<CarryOutOutlined />}>
              <Link to="/inventory">Inventory Tracker</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
              <Link to="/shopping-list">Shopping List</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<ProfileOutlined />}>
              <Link to="/recipe">Recipe Database</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<DollarCircleOutlined />}>
              <Link to="/price-comparison">Price Comparison</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<LogoutOutlined />}>
              <Link to="/">Logout</Link>
            </Menu.Item>
          </Menu>
        </div>

        <div className="sidebar-footer-button"> {/* Container for the toggle button */}
          <button className="sidebar-toggle" onClick={toggleSidebar}> {/* Button to toggle the sidebar */}
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} {/* Show different icons based on collapse state */}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`main-content ${collapsed ? "sidebar-collapsed" : "sidebar-open"}`}>
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

export default Sidebar; // Export the Sidebar component
