import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HelloWorld from "./Helloworld.js";
import SignUpForm from "./components/SignUpForm.js";
import Home from "./components/Home.js";
import Fhome from "./components/Fhome.js";
import Calendar from "./materials/Calendar.js";
import CourseDiary from "./components/CourseDiary.js";
import Doubts from "./components/Doubts.js";
import S_Doubts from "./components/S_Doubts.js";
import S_Marks from "./components/S_Marks.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignUpForm />} />
        <Route path="/hello" element={<Calendar />} />
        <Route path="/home" element={<Home />} />
        <Route path="/faculty_home" element={<Fhome />} />
        <Route path="/course_diary" element={<CourseDiary />} />
        <Route path="/doubts" element={<Doubts />} />
        <Route path="/s_doubts" element={<S_Doubts />} />
        <Route path="/s_marks" element={<S_Marks />} />
      </Routes>
    </Router>
  );
}

export default App;
