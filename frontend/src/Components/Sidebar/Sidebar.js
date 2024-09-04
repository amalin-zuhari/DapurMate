import React, { useState } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  CarryOutOutlined,
  ShoppingCartOutlined,
  ProfileOutlined,
  DollarCircleOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import "../../Styles/Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    console.log("Sidebar collapsed:", collapsed);
  };

  return (
    <div className="App-sidebar">
      <div className={`sidebar-main ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-text-container">
          {collapsed ? (
            <span className="logo-text-collapsed">DAPUR MATE</span>
          ) : (
            <div className="sidebar-logo-container">
              <img
                src="/dapurmateLogo.png"
                alt="Dapurmate Logo"
                width="100"
                height="100"
                className="sidebar-logo"
              />
            </div>
          )}
        </div>

        <div className="menu-wrapper">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            inlineCollapsed={collapsed}
          >
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<CarryOutOutlined />}>
              <Link to="/inventory">Inventory Tracker</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
              <Link to="/shoppinglist">Shopping List</Link>
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

        <div className="sidebar-footer-button">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
