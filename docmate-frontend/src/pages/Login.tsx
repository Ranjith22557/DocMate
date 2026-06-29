import { useState } from "react";
import api from "../services/api";

function Login() {

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtp = async () => {

    try {

      await api.post(
        "/auth/send-otp",
        {
          email
        }
      );

      alert("OTP Sent Successfully");

    } catch (error) {

      console.error(error);
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {

    try {

      const response = await api.post(
        "/auth/verify-otp",
        {
          email,
          otp
        }
      );

      console.log(response.data);

      localStorage.setItem("token",response.data.token);

      localStorage.setItem("email",email);

      alert("Login Successful");

      window.location.href = "/dashboard";

    } catch (error) {

      console.error(error);
      alert("Invalid OTP");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>DocMate Login</h2>

      <div>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button onClick={sendOtp}>
          Send OTP
        </button>
      </div>

      <br />

      <div>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
        />

        <button onClick={verifyOtp}>
          Verify OTP
        </button>
      </div>

    </div>
  );
}

export default Login;