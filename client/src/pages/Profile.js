import React, { useState } from "react";
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
  const user = JSON.parse(localStorage.getItem("user"));

  function splitContent(inputContent) {
    const maxTokensPerRequest = 1000; // Adjust this based on API limits
  
    const words = inputContent.split(' '); // Split content into words
  
    let chunks = [];
    let currentChunk = '';
  
    for (const word of words) {
      if ((currentChunk + ' ' + word).split(' ').length <= maxTokensPerRequest) {
        currentChunk += ' ' + word;
      } else {
        chunks.push(currentChunk.trim());
        currentChunk = word;
      }
    }
  
    if (currentChunk !== '') {
      chunks.push(currentChunk.trim());
    }
  
    return chunks;
  }
  

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

        const inputContent = `generate a basic resume in HTML, values: name:${firstName} ${lastName}, phone:${mobileNumber} email:${email}, address:${address}, objective:${careerObjective}, skills:${skillsString}, education:${educationString}, projects:${projectsString}`;
        const contentChunks = splitContent(inputContent);

        let generatedHTML = '';
        for (let i = 0; i < contentChunks.length; i++) {
          const result = await axios.post("/api/user/build", {
            text: contentChunks[i],
          });
          // Concatenate each response to form the complete HTML
          generatedHTML += result.data.data.choices[0].text;
        }
      // const result = await axios.post("/api/user/build", {
      //   text: `generate a basic resume in HTML, using these values: first name:${firstName}, last name:${lastName}, email:${email}, phone:${mobileNumber}, adddress:${address}, ${careerObjective}, skills:${skillsString}, education:${educationString}, experience:${experienceString}, projects:${projectsString}`,
      // });
      // console.log(result.data.data.choices[0].text);
      // setGeneratedHTML(result.data.data.choices[0].text);
      setGeneratedHTML(generatedHTML);
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
      <h4>
        <strong>Update Profile</strong>
      </h4>
      <hr />
      <div className="update-profile">
        <Form layout="vertical" onFinish={onFinish} initialValues={user}>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          <button style={{ borderRadius: "5px" }} type="submit">
            Update
          </button>
        </Form>
      </div>

      <div className="divider mt-3"></div>
      <AIGeneratedCV generatedHTML={generatedHTML} />
    </DefaultLayout>
  );
};

export default Profile;
