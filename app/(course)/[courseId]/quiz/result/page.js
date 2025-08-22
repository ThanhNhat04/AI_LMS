"use client";

import { useState } from "react";
import LessonResult from "./components/reultquiz.js";

export default function AIAgentPage() {
  const getDefaultArticle = () => ({
    title: "Các Định Luật Newton về Chuyển Động",
    content: `...`,
    subject: "vật lý",
    difficulty: "trung bình",
  });

  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };


  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);

    try {
      const article =
        JSON.parse(localStorage.getItem("custom_quiz_article")) ||
        getDefaultArticle();


      const accessToken = getAccessToken();
      const res = await fetch("http://192.168.10.221:8000/api/agent/process", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: JSON.stringify({
            study_sessions: [
              {
                article,
                questions: [],
                correct_answers: [],
                user_answers: [],
                answer_details: [],
              },
            ],
          }),
        }),

      });

      if (!res.ok) throw new Error("Lỗi gọi API");

      const result = await res.json();
      setResponse(result.user_response);
    } catch (err) {
      console.error("Lỗi:", err);
      setResponse("Không thể kết nối đến AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agent-container">
      {/* <h1 className="agent-title">Trợ lý AI</h1> */}
      <button onClick={handleSend} disabled={loading} className="send-button">
        {loading ? "Đang chạy..." : "Thực thi"}
      </button>

      <div className="agent-main">
        <div className="agent-result">
          {loading ? (
            <div className="loading-box">
              <div className="spinner"></div>
              <p>Đang xử lý, vui lòng chờ...</p>
            </div>
          ) : response ? (
            <LessonResult lessonData={response} />
          ) : (
            <p>Nhấn "Thực thi" để chạy và xem kết quả.</p>
          )}
        </div>
      </div>

      <style>{`
        .agent-container {
          padding: 2rem;
          font-family: Arial, sans-serif;
        }
        .agent-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #1e3a8a;
        }
        .send-button {
          background: #16a34a;
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 1.5rem;
        }
        .send-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .agent-main {
          display: block;
        }
        .agent-result {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 10px;
          min-height: 250px; /* giữ độ cao tối thiểu để giao diện không co lại */
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .loading-box {
          text-align: center;
          color: #374151;
        }
        .spinner {
          border: 4px solid #e5e7eb;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
