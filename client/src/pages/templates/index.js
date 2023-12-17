import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Template1 from "./Template1";
import Template2 from "./Template2";
import DefaultLayout from "../../components/DefaultLayout";
import { useParams, useNavigate } from "react-router-dom";

const Templates = () => {
  const navigate = useNavigate();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const params = useParams();
  const getTemplate = () => {
    switch (params.id) {
      case "1": {
        return <Template1 />;
      }

      case "2": {
        return <Template2 />;
      }
    }
  };
  return (
    <DefaultLayout>
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
      <div ref={componentRef}>{getTemplate()}</div>
    </DefaultLayout>
  );
};

export default Templates;
