import React from "react";
import FeedbackForm from "./components/FeedbackForm"; // Импортируем форму

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Feedback Form</h1>
      <FeedbackForm />
    </div>
  );
};

export default App;
