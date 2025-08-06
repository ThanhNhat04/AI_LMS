"use client";
import { useState, useEffect } from "react";
import LessonResult from "../resultquiz/index.js"; 

export default function AIAgentPage() {
  const getDefaultArticle = () => ({
    title: "Các Định Luật Newton về Chuyển Động",
    content: `...`,
    subject: "vật lý",
    difficulty: "trung bình",
  });

  const getStoredResultData = () => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("result_data_quizz");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

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

      const accessToken = getAccessToken();
      const res = await fetch("http://192.168.10.221:8000/api/agent/process", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: mess }),
      });

      if (!res.ok) throw new Error("Lỗi gọi API");

      const result = await res.json();
      setResponse(result.user_response);
      setSessionId(result.session_id);
      fetchSessions();
    } catch (err) {
      console.error("Lỗi:", err);
      setResponse("Không thể kết nối đến AI.");
    } finally {
      setLoading(false);
    }
  };

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
        }
      `}</style>
    </div>
  );
}
