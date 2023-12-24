import React, { useState } from "react";
import axios from "axios";
import DefaultLayout from "../components/DefaultLayout";
import { Tabs, Form, Spin, message } from "antd";
import PersonalInfo from "../components/PersonalInfo";
import SkillsEducation from "../components/SkillsEducation";
import ExperienceProject from "../components/ExperienceProject";

const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: "Personal Information",
    children: <PersonalInfo />,
  },
  {
    key: "2",
    label: "Skills and Education",
    children: <SkillsEducation />,
  },
  {
    key: "3",
    label: "Experience and Projects",
    children: <ExperienceProject />,
  },
];

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const onFinish = async (values) => {
    setLoading(true);
      try {
        const result = await axios.post("/api/user/update", {
          ...values,
          _id: user._id,
        });
        localStorage.setItem("user", JSON.stringify(result.data));
        setLoading(false);
        message.success("Profile Updated Successfully");
      } catch (err) {
        setLoading(false);
        message.error("Profile Update Failed");
        console.log(err);
      }    
  };

  return (
    <DefaultLayout>
      {loading && <Spin size="large" />}
      <h4>
            <strong>Update Profile</strong>
          </h4>
          <hr />
          <div className="update-profile">
            <Form layout="vertical" onFinish={onFinish} initialValues={user}>
              <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
              <button
                style={{ borderRadius: "5px" }}
                type="submit"
              >
                Update Profile
              </button>
            </Form>
          </div>
      <div className="divider mt-3"></div>
    </DefaultLayout>
  );
};

export default Profile;
