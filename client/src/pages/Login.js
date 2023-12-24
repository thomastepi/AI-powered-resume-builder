import React, { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Spin } from "antd";
import "../resources/authentication.css";

function Login() {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/user/login", values);
      message.success("Login Successful");
      localStorage.setItem("user", JSON.stringify(response.data));
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      message.error("User not found");
      console.log(err);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/home");
    }
  });

  return (
    <div className="auth-parent">
      {loading && <Spin size="large" />}
      <div className="auth-child">
        <div style={{textAlign: "left", paddingRight: "40px"}}>
          <h1 className="brand">AI-Powered Resume Builder</h1>
          <p>
            A Resume Builder powered by AI which helps you create a professional
            resume in minutes.
          </p>
        </div>
        <div>
          <Form layout="vertical" onFinish={onFinish}>
            <h1>Login</h1>
            <hr />
            <Form.Item name="username" label="Username">
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input type="password" />
            </Form.Item>
            <div className="d-flex align-items-center justify-content-between">
              <span>
                Don't have an account? Register <Link to="/register">Here</Link>{" "}
              </span>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
