import React from 'react';

const AIResumeComponent = (props) => {
  // This is your generated HTML string received from the OpenAI API
  const generatedHTML = props.generatedHTML;

  return (
    <div>
      {/* Render the HTML content using dangerouslySetInnerHTML */}
      <div dangerouslySetInnerHTML={{ __html: generatedHTML }} />
    </div>
  );
};

export default AIResumeComponent;