import React, { useState } from "react";
import { message, Spin } from "antd";
import axios from "axios";
import AIGeneratedCV from "./AIGeneratedCV";

const Template3 = () => {
  const [loading, setLoading] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [isCVGenerated, setIsCVGenerated] = useState(true);
  const [alert, setAlert] = useState("");

  const handleClick = async () => {
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
        .map((edu) => `${edu.qualification} at ${edu.institution}, ${edu.gpa}`)
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
        text: `generate a basic resume in HTML,and style with CSS, using these values: first name:${firstName}, last name:${lastName}, email:${email}, phone:${mobileNumber}, adddress:${address}, objectives:${careerObjective}, skills:${skillsString}, education:${educationString}, experience:${experienceString}, projects:${projectsString}`,
      });
      setIsCVGenerated(true);
      setAlert("");
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
    <div>
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
          <div>
            <AIGeneratedCV generatedHTML={generatedHTML} />
          </div>
        </>
      )}
      {generatedHTML === "" && alert === "" && (
        <>
          <div style={{ textAlign: "center" }}>
            <h4>Click the button below to generate your resume</h4>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={handleClick}
              style={{ borderRadius: "5px", marginLeft: "20px" }}
              type="button"
            >
              Generate Resume using AI
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Template3;
