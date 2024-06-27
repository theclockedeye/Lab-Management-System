import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./FHome.module.css";
import profileImage from "../static/profile-1.jpg";
import { Link } from "react-router-dom";
import Calendar from "../materials/Calendar";
import { Button, Menu, MenuItem } from "@mui/material";
import Attcard from "./Attcard";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

function CourseDiary() {
  const location = useLocation();
  const username1 = location.state?.username1;

  const [studentNames, setStudentNames] = useState([]);

  const [classAnchorEl, setClassAnchorEl] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const [batchAnchorEl, setBatchAnchorEl] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);

  const [userData, setUserData] = useState(null);
  const [labsData, setLabsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // State to store the selected date

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response1 = await axios.post(
          "http://127.0.0.1:8000/fac/set_fac/",
          { username1 }
        );

        //setted the name and dep

        const response = await axios.get(
          "http://127.0.0.1:8000/fac/fac_data_get/"
        );
        setUserData(response.data);
        const labsResponse = await axios.get(
          "http://127.0.0.1:8000/fac/get_lab_details/"
        );
        setLabsData(labsResponse.data.lab_names);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Function to handle the selected date
  const handleDateSelect = (date) => {
    setSelectedDate(date.toISOString().split("T")[0]); // Convert the date object to a string in the format "YYYY-MM-DD"
    console.log(selectedDate);
  };

  const handleClassClick = (event) => {
    setClassAnchorEl(event.currentTarget);
  };

  const handleBatchClick = (event) => {
    setBatchAnchorEl(event.currentTarget);
  };

  const handleClassClose = (classValue) => {
    setClassAnchorEl(null);
    if (classValue) {
      setSelectedClass(classValue);
    }
  };

  const handleBatchClose = (batchValue) => {
    setBatchAnchorEl(null);
    if (batchValue) {
      setSelectedBatch(batchValue);
    }
  };
  // ***********Show Alert *************
  const showAlert = () => {
    Swal.fire({
      title: "Success!",
      text: "Attendance Taken Successfully",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const handleSubmit = async (e) => {
    if (selectedDate) {
      setIsVisible(true);
      e.preventDefault();
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/fac/get_student_names/",
          {
            class: selectedClass,
            batch: selectedBatch,
            date: selectedDate,
          }
        );
        setStudentNames(response.data.student_names);
        console.log(studentNames);
      } catch (error) {
        console.error("Error fetching student names:", error);
      }
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  // *************NEw attendanceData***********************
  const [isVisible, setIsVisible] = useState(false);

  const [attendanceValues, setAttendanceValues] = useState([]);
  const [vivaMarkValues, setVivaMarkValues] = useState([]);
  const [outputValues, setOutputValues] = useState([]);
  const [programNameValues, setProgramNameValues] = useState([]);

  const handleAttendanceChange = (index, checked) => {
    const newAttendanceValues = [...attendanceValues];
    newAttendanceValues[index] = checked ? "Present" : "Absent";
    setAttendanceValues(newAttendanceValues);
  };

  const handleOutputChange = (index, checked) => {
    const newOutputValues = [...outputValues];
    newOutputValues[index] = checked ? "Verified" : "Not Verified";
    setOutputValues(newOutputValues);
  };

  const handleVivaMarkChange = (index, value) => {
    const newVivaMarkValues = [...vivaMarkValues];
    newVivaMarkValues[index] = value;
    setVivaMarkValues(newVivaMarkValues);
  };

  const handleProgramNameChange = (index, value) => {
    const newProgramNameValues = [...programNameValues];
    newProgramNameValues[index] = value;
    setProgramNameValues(newProgramNameValues);
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    studentNames.forEach((name, index) => {
      formData.append("studentName[]", name);
      formData.append(`attendance[]`, attendanceValues[index] || "Absent");
      formData.append(`vivaMark[]`, vivaMarkValues[index] || "");
      formData.append(`output[]`, outputValues[index] || "Not Verified");

      formData.append(`programName[]`, programNameValues[index] || "");
    });
    formData.append("date", selectedDate);
    formData.append("subject", selectedClass);
    formData.append("batch", selectedBatch);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/fac/save_course_diary/",
        formData
      );
      if (response.data.success) {
        console.log("Course diary data saved successfully");
        showAlert();
        // Reset form or perform any other necessary actions
      } else {
        console.error("Error saving course diary data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handlePasswordChangeClick = () => {
    Swal.fire({
      title: "Contact Admin",
      text: "Please contact the admin for password change.",
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.logo} title="University Management System">
          <h2>
            F<span className={styles.danger}>A</span>CULTY D
            <span className={styles.danger}>A</span>SHBOARD
          </h2>
        </div>
        <div className={styles.navbar}>
          <Link to="/faculty_home" state={{ username1: username1 }}>
            <a href="index.html">
              <span className="material-icons-sharp">home</span>
              <h3>Home</h3>
            </a>
          </Link>
          <Link to="/course_diary" state={{ username1: username1 }}>
            <a href="marks.html " className={styles.active}>
              <span className="material-icons-sharp">today</span>
              <h3>Course Diary</h3>
            </a>
          </Link>

          <Link to="/doubts" state={{ username1: username1 }}>
            <a>
              <span className="material-icons-sharp">grid_view</span>
              <h3>Doubts</h3>
            </a>
          </Link>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePasswordChangeClick();
            }}
          >
            <span className="material-icons-sharp">password</span>
            <h3>Change Password</h3>
          </a>
          <a href="#">
            <Link to="/login">
              <span className="material-icons-sharp">logout</span>
              <h3>Logout</h3>
            </Link>
          </a>
        </div>
        <div id="profile-btn" className={styles.profileBtn}>
          <span className="material-icons-sharp">person</span>
        </div>
        <div className={styles.themeToggler}>
          <span className="material-icons-sharp active">light_mode</span>
          <span className="material-icons-sharp">dark_mode</span>
        </div>
      </header>
      <div className={styles.container}>
        <aside>
          <div className={styles.profile}>
            <div className={styles.top}>
              <div className={styles.profile_photo}>
                <img src={profileImage} alt="Profile" />
              </div>
              <div className={styles.info}>
                <p>
                  Hey, <b>{userData ? userData.name : "Loading..."}</b>
                </p>
                <small className={styles.textMuted}>
                  {userData ? userData.id : "Loading..."}
                </small>
              </div>
            </div>
            <div className={styles.about}>
              <h5>Department</h5>
              <p>{userData ? userData.department : "Loading..."}</p>

              <h5>DOB</h5>
              <p>{userData ? userData.dob : "Loading..."}</p>
              <h5>Phone Number</h5>
              <p>{userData ? userData.phone : "Loading..."}</p>
              <h5>Email</h5>
              <p>{userData ? userData.email : "Loading..."}</p>
              <h5>Address</h5>
              <p>Ghost town Road, New York, America</p>
            </div>
          </div>
        </aside>

        <main>
          <h1 style={{ fontWeight: 800, fontSize: "1.8rem" }}>Attendance</h1>

          <div>
            <div className={styles.subjects}>
              <div>
                {/* Display the selected date */}
                {/* <h1>
                    Date Selected:{" "}
                    {selectedDate
                      ? selectedDate.toLocaleDateString()
                      : "No date selected"}
                  </h1>
                  <h1>Selected class: {selectedClass}</h1>
                  <h1>Selected Batch: {selectedBatch}</h1> */}
                {/* Take attendance */}
                {/* <Attcard /> */}
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>Select Class:</label>
                    <select value={selectedClass} onChange={handleClassChange}>
                      <option value="">Select Class</option>
                      {labsData.map((lab, index) => (
                        <option key={index} value={lab}>
                          {lab}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Select Batch:</label>
                    <select value={selectedBatch} onChange={handleBatchChange}>
                      <option value="">Select Batch</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </div>

                  {/* <div>
                    <label>Select Date:</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </div> */}

                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
            {isVisible && (
              <div className={styles.subjects}>
                <div>
                  {/* div for marking attendance */}
                  <div>
                    <h2>Course Diary</h2>
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Subject</th>
                          <th>Batch</th>
                          <th>Student Name</th>
                          <th>Attendance</th>
                          <th>Viva Mark</th>
                          <th>Output</th>
                          <th>Program Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentNames.map((student, index) => (
                          <tr key={index}>
                            <td>{selectedDate}</td>
                            <td>{selectedClass}</td>
                            <td>{selectedBatch}</td>
                            <td>{student}</td>
                            <td>
                              <input
                                type="checkbox"
                                checked={attendanceValues[index] === "Present"}
                                onChange={(e) =>
                                  handleAttendanceChange(
                                    index,
                                    e.target.checked
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={vivaMarkValues[index] || ""}
                                onChange={(e) =>
                                  handleVivaMarkChange(index, e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                checked={outputValues[index] === "Verified"}
                                onChange={(e) =>
                                  handleOutputChange(index, e.target.checked)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={programNameValues[index] || ""}
                                onChange={(e) =>
                                  handleProgramNameChange(index, e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button onClick={handleSaveClick}>Save</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.timetable} id="timetable">
            {/* Add your timetable component here */}
          </div>
        </main>

        <div className={styles.right}>
          <div className={styles.announcements}>
            <div
              className={styles.updates}
              style={{
                paddingLeft: "0px",
                width: "fit-content",
              }}
            >
              {/* Add your announcements components here */}
              <Calendar onDateSelect={handleDateSelect} />{" "}
              {/* Pass the handleDateSelect function as a prop */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDiary;
