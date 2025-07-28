"use client";

import { useState, useEffect } from "react";

export default function AIAgentPage() {
  const [message, setMessage] = useState(
    "Tôi đang học về phương trình bậc 2, có thể giải thích cho tôi được không?"
  );
  const [response, setResponse] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const handleSend = async () => {
    setLoading(true);
    setResponse("");
    setSessionId("");

    try {
      const accessToken = getAccessToken();

      const res = await fetch("http://192.168.10.221:8000/api/agent/process", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: message }),
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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Lỗi gọi API /sessions");

      const data = await res.json();
      console.log("Sessions:", data);
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

      <textarea
        className="agent-textarea"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button className="agent-button" onClick={handleSend} disabled={loading}>
        {loading ? "Đang gửi..." : "Gửi yêu cầu"}
      </button>

      {response && (
        <div className="agent-response">
          <p>
            <strong>AI:</strong> {response}
          </p>
          <p className="session-id">Session ID: {sessionId}</p>
        </div>
      )}

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

        {selectedSession && (
          <div className="agent-session-detail">
            <h3>Chi tiết phiên</h3>
            <p>
              <strong>Input:</strong> {selectedSession.input_messages}
            </p>
            {/* <p><strong>Response:</strong> {JSON.stringify(selectedSession.user_response)}</p> */}
            <pre>
              <code>
                {JSON.stringify(selectedSession.user_response, null, 2)}
              </code>
            </pre>
          </div>
        )}
      </div>

      <style>{`
        .agent-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 2rem;
          font-family: Arial, sans-serif;
        }
        .agent-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #1e3a8a;
        }
        .agent-textarea {
          width: 100%;
          padding: 1rem;
          font-size: 16px;
          border-radius: 10px;
          border: 1px solid #ccc;
          margin-bottom: 1rem;
          resize: vertical;
        }
        .agent-button {
          background-color: #2563eb;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        }
        .agent-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
        .agent-response {
          background-color: #f3f4f6;
          border-radius: 10px;
          padding: 1rem;
          margin-top: 1.5rem;
        }
        .session-id {
          font-size: 0.875rem;
          color: #6b7280;
        }
        .agent-sessions {
          margin-top: 2rem;
        }
        .agent-sessions h2 {
          font-size: 20px;
          margin-bottom: 1rem;
          color: #374151;
        }
        .agent-sessions ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .agent-session-item {
          margin-bottom: 0.5rem;
          background: #f9fafb;
          padding: 0.75rem;
          border-radius: 8px;
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
        .agent-session-detail {
          margin-top: 1.5rem;
          background-color: #f0fdf4;
          border: 1px solid #86efac;
          padding: 1rem;
          border-radius: 10px;
        }
        .agent-session-detail h3 {
          font-size: 18px;
          margin-bottom: 0.5rem;
          color: #166534;
        }
      `}</style>
    </div>
  );
}
