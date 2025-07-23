'use client'

import React, { useState } from 'react';
import '../../../style/globals.css'

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/Register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName }),
      })
      if (!res.ok) {
        const data = await res.json()
        console.log(data);
        setErrorMessage(`Lỗi: ${data.error}`);
        setIsLoading(false);
      }
      else {
        let d = await res.json()
        console.log(d);

        window.location.reload()
        setIsLoading(false)
      }
    } catch (error) {
      setErrorMessage(`Lỗi: ${error}`);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="register-container">
        <h1 className='register-title'>ĐĂNG KÝ</h1>
        {errorMessage && (
          <div className="register-error-message">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="register-form">
          <label htmlFor="full_name" className="register-label">Họ và tên</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            required
            autoComplete="name"
            placeholder="Nhập họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="register-input"
          />
          <label htmlFor="email" className="register-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
          />
          <label htmlFor="password" className="register-label">Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="new-password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="register-btn"
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
      </div>
      {isLoading && (
        <div className="register-backdrop">
          <div className="register-loader" />
        </div>
      )}
      <style>{`
        .register-container {
          min-width: 350px;
          max-width: 400px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 40px 32px 32px 32px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          border-radius: 16px;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
        }
        .register-title {
          font-size: 2rem;
          font-weight: 700;
          color: #3b82f6;
          margin-bottom: 24px;
          letter-spacing: 1px;
        }
        .register-error-message {
          color: #ef4444;
          background: #fee2e2;
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 16px;
          width: 100%;
          text-align: center;
          font-size: 0.95rem;
        }
        .register-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .register-label {
          font-size: 1rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
          margin-left: 2px;
        }
        .register-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          background: #f1f5f9;
          font-size: 1rem;
          transition: border 0.2s;
        }
        .register-input:focus {
          outline: none;
          border: 1.5px solid #3b82f6;
          background: #fff;
        }
        .register-btn {
          width: 100%;
          padding: 12px 0;
          background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.1rem;
          color: white;
          border: none;
          margin-top: 18px;
          box-shadow: 0 2px 8px rgba(59,130,246,0.08);
          transition: background 0.2s, box-shadow 0.2s;
        }
        .register-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .register-backdrop {
          color: #fff;
          z-index: 999;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(59,130,246,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .register-loader {
          border: 5px solid #e0e7ff;
          border-top: 5px solid #3b82f6;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </>
  );
}

