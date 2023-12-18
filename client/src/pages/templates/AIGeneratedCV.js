import React from 'react';

const AIResumeComponent = (props) => {
  const generatedHTML = props.generatedHTML;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: generatedHTML }} />
    </div>
  );
};

export default AIResumeComponent;