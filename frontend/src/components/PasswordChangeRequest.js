import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

function PasswordChangeRequest({ username1 }) {
  const handlePasswordChangeClick = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/myapi/submit-password-change-request/",
        { username1 }
      );
      const { status, message } = response.data;

      if (status === "success") {
        Swal.fire("Success", message, "success");
      } else {
        Swal.fire("Error", message, "error");
      }
    } catch (error) {
      console.error("Error submitting password change request:", error);
      Swal.fire(
        "Error",
        "An error occurred while submitting the request.",
        "error"
      );
    }
  };

  return (
    <a href="#" onClick={handlePasswordChangeClick}>
      <span className="material-icons-sharp">password</span>
      <h3>Change Password</h3>
    </a>
  );
}

export default PasswordChangeRequest;
