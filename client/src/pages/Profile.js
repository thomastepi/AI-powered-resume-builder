import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import DefaultLayout from "../components/DefaultLayout";
import { Tabs, Form, Spin, message } from "antd";
import PersonalInfo from "../components/PersonalInfo";
import SkillsEducation from "../components/SkillsEducation";
import ExperienceProject from "../components/ExperienceProject";
import AIGeneratedCV from "./templates/AIGeneratedCV";

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
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [isCVGenerated, setIsCVGenerated] = useState(true);
  const [alert, setAlert] = useState("");

  const navigate = useNavigate();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const onFinish = async (values) => {
    console.log(values);
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

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const {
        firstName,
        lastName,
        email,
        mobileNumber,
        address,
        skills,
        education,
        experience,
        projects,
        careerObjective,
      } = user;
      const skillsString = skills
        .map((skill) => `${skill.skill}: ${skill.rating}`)
        .join(", ");
      const educationString = education
        .map((edu) => `${edu.qualification} at ${edu.institution}`)
        .join(", ");
      const experienceString = experience
        .map((exp) => `${exp.years} years at ${exp.company}`)
        .join(", ");
      const projectsString = projects
        .map((proj) => `${proj.title}: ${proj.description}`)
        .join(", ");

      setIsCVGenerated(false);
      setAlert("LOADING...please wait while the AI Robots work their magic");
      const result = await axios.post("/api/user/build", {
        text: `generate a basic resume in HTML,and style with CSS, using these values: first name:${firstName}, last name:${lastName}, email:${email}, phone:${mobileNumber}, adddress:${address}, ${careerObjective}, skills:${skillsString}, education:${educationString}, experience:${experienceString}, projects:${projectsString}`,
      });
      setIsCVGenerated(true);
      setAlert("");
      //console.log(result.data.data[0].message.content);
      setGeneratedHTML(result.data.data[0].message.content);
      setLoading(false);
      message.success("Resume generated Successfully");
    } catch (err) {
      setLoading(false);
      message.error("Resume generation Failed");
      console.log(err);
    }
  };

  return (
    <DefaultLayout>
      {loading && <Spin size="large" />}
      {!isCVGenerated && (
        <>
          <div style={{ textAlign: "center" }}>
            <h4>{alert}</h4>
          </div>
          <Spin size="large" />
        </>
      )}
      {isCVGenerated && generatedHTML && (
        <>
          <div className="d-flex justify-content-end my-5 mx-5">
            <button
              className="back-btn"
              onClick={() => {
                navigate("/home");
              }}
            >
              Back
            </button>
            <button className="mx-5" onClick={handlePrint}>
              Print
            </button>
          </div>
          <div ref={componentRef}>
            <AIGeneratedCV generatedHTML={generatedHTML} />
          </div>
        </>
      )}
      {isCVGenerated && alert === "" && generatedHTML === "" ? (
        <>
          <h4>
            <strong>Update Profile / Generate Resume using AI</strong>
          </h4>
          <hr />
          <div className="update-profile">
            <Form layout="vertical" onFinish={onFinish} initialValues={user}>
              <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
              <button style={{ borderRadius: "5px" }} type="submit">
                Update/Generate Resume
              </button>
            </Form>
          </div>
        </>
      ) : (
        ""
      )}

      {/* <h4>
        <strong>Update Profile</strong>
      </h4>
      <hr />
      <div className="update-profile">
        <Form layout="vertical" onFinish={onFinish} initialValues={user}>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          <button style={{ borderRadius: "5px" }} type="submit">
            Update/Generate Resume
          </button>
        </Form>
      </div> */}

      <div className="divider mt-3"></div>
    </DefaultLayout>
  );
};

export default Profile;
