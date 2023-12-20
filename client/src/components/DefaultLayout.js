import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

import "./../resources/defaultLayout.css";

function DefaultLayout(props) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const items = [
    {
      key: "1",
      label: (
        <Link style={{ textDecoration: "none" }} to="/home">
          Home
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link style={{ textDecoration: "none" }} to="/profile">
          Profile
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <span
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          Logout
        </span>
      ),
    },
  ];

  return (
    <div className="layout">
      <div className="header">
        <h1 onClick={()=>{navigate("/home")}}>AI Resume Generator</h1>
        <Dropdown
          menu={{
            items,
          }}
          placement="bottomLeft"
        >
          <Button icon={<UserOutlined />}>{user.username}</Button>
        </Dropdown>
      </div>
      <div className="content" style={{overflow: "scroll"}}>{props.children}</div>
    </div>
  );
}

export default DefaultLayout;
