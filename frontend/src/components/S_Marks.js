import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Home.module.css";
import profileImage from "../static/profile-1.jpg";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

function S_Marks() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const username1FromState = location.state?.username1;
  const username1FromQueryParam = searchParams.get("username");
  const username1 = username1FromState || username1FromQueryParam;

  const [userData, setUserData] = useState(null);
  const [labsData, setLabsData] = useState([]);
  const [username, setUsername] = useState(null);
  const [subjectVivamarks, setSubjectVivamarks] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [labData3, setLabData3] = useState([]);

  useEffect(() => {
    if (selectedSubject) {
      const tableRows =
        selectedSubject.data.length > 0
          ? selectedSubject.data
              .map(
                (item) => `
              <tr>
                <td>${item.date}</td>
                <td>${item.vivamark}</td>
              </tr>
            `
              )
              .join("")
          : `
            <tr>
              <td>No data found</td>
              <td>-</td>
            </tr>
          `;

      Swal.fire({
        title: `${selectedSubject.name} Details`,
        html: `
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        `,
        confirmButtonText: "OK",
      });
    }
  }, [selectedSubject]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const loginData = {
          /* Your login data */
        };

        const response1 = await axios.post(
          "http://127.0.0.1:8000/myapi/set_stud/",
          { username1 }
        );
        console.log(response1.data);

        await axios
          .post("http://127.0.0.1:8000/myapi/login/", loginData)
          .then((response) => {
            setUsername(response.data.username);
          });

        const response = await axios.get(
          "http://127.0.0.1:8000/myapi/user-data/"
        );
        setUserData(response.data);
        const labsResponse = await axios.get(
          "http://127.0.0.1:8000/myapi/lab-details/"
        );
        setLabsData(labsResponse.data.lab_names);

        const vivamarksResponse = await axios.get(
          `http://127.0.0.1:8000/myapi/subject-vivamarks/${username1}/`
        );
        setSubjectVivamarks(vivamarksResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/myapi/get_lab_attendance_and_marks",
          {
            params: {
              username1: "your_username",
            },
          }
        );
        setLabData3(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubjectClick = async (lab) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/myapi/subject-details/${lab}/?username1=${username1}`
      );
      setSelectedSubject({ name: lab, data: response.data });
    } catch (error) {
      console.error("Error fetching subject details:", error);
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
            S<span className={styles.danger}>T</span>UDENT D
            <span className={styles.danger}>A</span>SHBOARD
          </h2>
        </div>
        <div className={styles.navbar}>
          <Link to="/home" state={{ username1: username1 }}>
            <a href="index.html">
              <span className="material-icons-sharp">home</span>
              <h3>Home</h3>
            </a>
          </Link>
          <Link to="/s_marks" state={{ username1: username1 }}>
            <a href="marks.html " className={styles.active}>
              <span className="material-icons-sharp">today</span>
              <h3>Marks</h3>
            </a>
          </Link>
          <Link to="/s_doubts" state={{ username1: username1 }}>
            <a href="doubts.html">
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
                <small className={styles.textMuted}>12102030</small>
              </div>
            </div>
            <div className={styles.about}>
              <h5>Course</h5>
              <p>
                {userData ? userData.department : "Loading..."},S
                {userData ? userData.sem : "Loading..."}
              </p>

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
          <h2>Hi {username1}</h2>
          <h1 style={{ fontWeight: 800, fontSize: "1.8rem" }}>Marks</h1>

          <div>
            {labsData.map((lab, index) => {
              const subjectData = subjectVivamarks.find(
                (item) => item.subject_name === lab
              );
              const totalVivamark = subjectData
                ? subjectData.total_vivamark
                : 0;
              const maxVivamark = subjectData ? subjectData.max_vivamark : 100; // Assuming a default value of 100

              return (
                <div
                  key={index}
                  className={styles.subjects}
                  onClick={() => handleSubjectClick(lab)}
                >
                  <div>
                    <h1>{lab}</h1>
                    <p>
                      <div className={styles.percent}>
                        Total Mark: {totalVivamark}/{maxVivamark}
                      </div>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.timetable} id="timetable">
            {/* Add your timetable component here */}
          </div>
        </main>

        {/* <div className={styles.right}>
          <div className={styles.announcements}>
            <h2 style={{ marginBottom: "0.8rem" }}>Announcements</h2>
            <div className={styles.updates}>
              {labData3.map((lab) => (
                <div key={lab.subject_name}>
                  <p>
                    <strong>{lab.subject_name}</strong>: {lab.mark_out_of_50}/50
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default S_Marks;
