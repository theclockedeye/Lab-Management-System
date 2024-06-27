import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./FHome.module.css";
import profileImage from "../static/profile-1.jpg";
import { Link } from "react-router-dom";
import Calendar from "../materials/Calendar";
import { Button, Menu, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import Chatapp from "./Chatapp";

function Doubts() {
  const location = useLocation();
  const username1 = location.state?.username1;

  const [userData, setUserData] = useState(null);
  const [labsData, setLabsData] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

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

  // ***********Show Alert *************
  const showAlert = () => {
    Swal.fire({
      title: "Success!",
      text: "Attendance Taken Successfully",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  // *************NEw attendanceData**********************
  useEffect(() => {
    // Fetch announcements data from the backend
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/myapi/announcements/"
        );
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);
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
            <a href="marks.html ">
              <span className="material-icons-sharp">today</span>
              <h3>Course Diary</h3>
            </a>
          </Link>
          <Link to="/doubts" state={{ username1: username1 }}>
            <a className={styles.active}>
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
          <h1 style={{ fontWeight: 800, fontSize: "1.8rem" }}>
            Doubts Session
          </h1>

          <div>
            <div className={styles.subjects}>
              <div>
                {/* chat system here */}

                <Chatapp labsData={labsData} username1={username1} />
              </div>
            </div>
          </div>

          <div className={styles.timetable} id="timetable">
            {/* Add your timetable component here */}
          </div>
        </main>
        <div className={styles.right}>
          <div className={styles.announcements}>
            <h2 style={{ marginBottom: "0.8rem" }}>Announcements</h2>
            <div className={styles.updates}>
              {announcements.length > 0 ? (
                <ul>
                  {announcements.map((announcement, index) => (
                    <li key={index}>
                      <p>{announcement.message}</p>
                      <small>{announcement.date}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No announcements found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Doubts;
