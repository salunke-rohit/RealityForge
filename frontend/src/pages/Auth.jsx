import { useState } from "react";
import axios from "axios";
import "../styles/auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    identifier: "",
    password: ""
  });

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const url = isLogin
        ? "https://realityforge.onrender.com/api/auth/login"
        : "https://realityforge.onrender.com/api/auth/signup";

      const payload = isLogin
        ? {
            email: form.identifier,
            password: form.password
          }
        : {
            username: form.username,
            email: form.identifier,
            password: form.password
          };

      const res = await axios.post(url, payload);

      // ✅ LOGIN
      if (isLogin) {
        const userData = {
          id: res.data.user.id,
          email: res.data.user.email,
          token: res.data.token   // ✅ CORRECT
        };

        localStorage.setItem("user", JSON.stringify(userData));

        speak("Login successful");

        setTimeout(() => window.location.reload(), 800);
      } 
      // ✅ SIGNUP
      else {
        speak("Signup successful");
        setIsLogin(true);
      }

    } catch (err) {
      console.log("AUTH ERROR:", err.response?.data || err.message);
      speak(err.response?.data?.error || "Authentication failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>{isLogin ? "Login" : "Signup"}</h2>

        {!isLogin && (
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
        )}

        <input
          name="identifier"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>
          {isLogin ? "LOGIN" : "SIGN UP"}
        </button>

        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create account" : "Already have account?"}
        </p>

      </div>
    </div>
  );
}

export default Auth;