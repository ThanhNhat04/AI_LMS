"use client";

import React, { useState } from "react";
import "../../../style/globals.css";
import { IconUser, IconLock } from "../../../public/svg/index.js";

const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN_AGENT;

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(`Lỗi: ${data.error}`);
      } else {
        await res.json();
        alert("Đăng ký thành công!");
        window.location.href = "auth/login";
      }
    } catch (error) {
      setErrorMessage(`Lỗi: ${error.message}`);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="login-main-bg">
        <div className="login-wrapper">
          <div className="login-left">
            <img
              src="https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-6/442467313_935888515206980_2723605427967175180_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFVIjy8gJjk9Zc7yaXeSkueqIsocnNTIrSoiyhyc1MitCKc7LCmRStTuyG8QPjaTQPs6Cc6QvSbeL9YCQ-K46Lm&_nc_ohc=gVhpS7PF5DwQ7kNvwHlRG7J&_nc_oc=AdkV2mpVE1V2URpCzp-VqReUd2uAqWdQvDb-dDxxB0RywN8ocMJHKTCr0xKjU0q9B7ttUxBXKTX4kXsA5qU7L0BC&_nc_zt=23&_nc_ht=scontent.fsgn15-1.fna&_nc_gid=F2ARDgydT2s-PzRs6mABEQ&oh=00_AfTbHMOW4beiXO8g8RiXdbWzytve7070jz5SCC47SkdOOw&oe=6886D6D9"
              alt="Register illustration"
              className="login-image"
            />
          </div>
          <div className="login-right">
            <h2 className="login-title">Đăng ký tài khoản</h2>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit} noValidate className="login-form">
              <div className="input-group">
                <span className="input-icon">
                  <IconUser />
                </span>
                <input
                  type="text"
                  placeholder="Họ tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="login-input"
                />
              </div>

              <div className="input-group">
                <span className="input-icon">
                  <IconUser />
                </span>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input"
                />
              </div>

              <div className="input-group">
                <span className="input-icon">
                  <IconLock />
                </span>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
              <button type="submit" disabled={isLoading} className="login-btn">
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
              </button>
              <a href="/auth/login" className="register-link">
                Đã có tài khoản? Đăng nhập ngay
                </a>
            </form>
          </div>
        </div>

        {isLoading && (
          <div className="login-backdrop">
            <div className="loader" />
          </div>
        )}
      </div>

      <style>{`
        .login-main-bg {
          min-height: 100vh;
          width: 100vw;
          background: var(--bg-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-wrapper {
          width: 900px;
          max-width: 98vw;
          height: 500px;
          background: white;
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          display: flex;
          overflow: hidden;
        }
        .login-left {
          flex: 1.2;
          background: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          text-align: center;
        }
        .login-image {
          max-width: 100%;
          height: 100%;
          object-fit: cover;      
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .login-right {
          flex: 1;
          background: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 36px 32px;
        }

        .login-title {
          color: #000;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .login-form {
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .input-group {
          display: flex;
          align-items: center;
          background: #f3f6fd;
          border-radius: 8px;
          padding: 0 12px;
          border: 1.5px solid #e0e7ff;
        }

        .input-icon {
          font-size: 1.2rem;
          color: #7f53ac;
          margin-right: 8px;
          display: flex;
          align-items: center;
        }

        .login-input {
          border: none;
          background: transparent;
          outline: none;
          padding: 12px 0;
          width: 100%;
          font-size: 1rem;
          color: #333;
        }

        .login-input::placeholder {
          color: #b4b4b4;
        }

        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem;
          margin-top: -8px;
        }

        .remember-me {
          color: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .forgot-link {
          color: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
          text-decoration: none;
          font-weight: 500;
          transition: text-decoration 0.2s;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .login-btn {
          width: 100%;
          padding: 12px 0;
          background: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          font-weight: 600;
          color: white;
          border: none;
          font-size: 1.05rem;
          box-shadow: 0 2px 8px rgba(59,130,246,0.08);
          transition: background 0.2s, transform 0.1s;
          margin-top: 10px;
        }

        .login-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .error-message {
          color: #ef4444;
          background: #fee2e2;
          border: 1px solid #fca5a5;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 1rem;
          width: 100%;
          text-align: center;
          animation: shake 0.2s;
        }

        .login-backdrop {
          z-index: 999;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #7f53ac;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
