"use client";
<<<<<<< HEAD
import { useState, useEffect } from "react";
import LessonResult from "../resultquiz/index.js"; 
=======
import { useState } from "react";
import LessonResult from "./components/reultquiz.js";
>>>>>>> master

export default function AIAgentPage() {
  const getDefaultArticle = () => ({
    title: "Các Định Luật Newton về Chuyển Động",
    content: `...`,
    subject: "vật lý",
    difficulty: "trung bình",
  });

<<<<<<< HEAD
  const getStoredResultData = () => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("result_data_quizz");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

=======
>>>>>>> master
  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

<<<<<<< HEAD
  const buildInitialMessage = () => {
    const stored = getStoredResultData();
    const defaultArticle = getDefaultArticle();

    if (!stored) {
      return {
        study_sessions: [
          {
            article: defaultArticle,
            questions: [],
            correct_answers: [],
            user_answers: [],
            answer_details: [],
          },
        ],
      };
    }

    return {
      study_sessions: [
        {
          article: stored.article || defaultArticle,
          questions: stored.questions || [],
          correct_answers: stored.correct_answers || [],
          user_answers: stored.user_answers || [],
          answer_details: stored.answer_details || [],
        },
      ],
    };
  };

  const [message, setMessage] = useState(
    JSON.stringify(buildInitialMessage(), null, 2)
  );
  const [response, setResponse] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const handleSend = async () => {
    setLoading(true);
    setResponse("");
    setSessionId("");

    try {
      const parsedMessage = JSON.parse(message);
      //Định dạng mark down
      const defMess = "lưu ý định dạng toàn bộ phản hồi bằng Markdown hợp lệ, sử dụng ký tự xuống dòng \n để phân tách các đoạn văn và các mục trong danh sách. Đảm bảo mỗi mục trong danh sách (bắt đầu bằng * hoặc -) nằm trên một dòng riêng";
      const mess = defMess + message
      const article = parsedMessage.study_sessions?.[0]?.article || getDefaultArticle();

      if (article) {
        localStorage.setItem("custom_quiz_article", JSON.stringify(article));
      }
=======
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);

    try {
      const article =
        JSON.parse(localStorage.getItem("custom_quiz_article")) ||
        getDefaultArticle();
>>>>>>> master

      const accessToken = getAccessToken();
      const res = await fetch("http://192.168.10.221:8000/api/agent/process", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
<<<<<<< HEAD
        body: JSON.stringify({ messages: mess }),
=======
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
>>>>>>> master
      });

      if (!res.ok) throw new Error("Lỗi gọi API");

      const result = await res.json();
      setResponse(result.user_response);
<<<<<<< HEAD
      setSessionId(result.session_id);
      fetchSessions();
=======
>>>>>>> master
    } catch (err) {
      console.error("Lỗi:", err);
      setResponse("Không thể kết nối đến AI.");
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const fetchSessions = async () => {
    try {
      const accessToken = getAccessToken();
      const res = await fetch("http://192.168.10.221:8000/api/agent/sessions", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error("Lỗi gọi API /sessions");
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error("Lỗi khi lấy sessions:", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="agent-container">
      <h1 className="agent-title">Trợ lý AI</h1>

      <div className="agent-main">
        {/* Cột trái: lịch sử */}
        <div className="agent-sessions">
          <h2>Lịch sử phiên AI</h2>
          {sessions.length > 0 ? (
            <ul>
              {sessions.map((s, idx) => (
                <li
                  key={idx}
                  className="agent-session-item"
                  onClick={() => setSelectedSession(s)}
                >
                  <strong>ID:</strong> {s._id}
                  <br />
                  <span className="session-time">
                    {new Date(s.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Chưa có phiên nào.</p>
          )}
        </div>

        <div className="agent-result">
          {selectedSession ? (
            <LessonResult lessonData={selectedSession.user_response} />
          ) : (
            <p>Chọn một phiên để xem kết quả.</p>
=======
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
>>>>>>> master
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
<<<<<<< HEAD
        .agent-main {
          display: flex;
          gap: 2rem;
        }
        .agent-sessions {
          flex: 1;
          border-right: 1px solid #ccc;
          padding-right: 1rem;
        }
        .agent-sessions ul {
          list-style: none;
          padding: 0;
        }
        .agent-session-item {
          background: #f9fafb;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .agent-session-item:hover {
          background: #e5e7eb;
        }
        .session-time {
          font-size: 0.875rem;
          color: #6b7280;
        }
        .agent-result {
          flex: 2;
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 10px;
=======
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
>>>>>>> master
        }
      `}</style>
    </div>
  );
}
