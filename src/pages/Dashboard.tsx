import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import pg from "../assets/pg.png";
import { v4 as uuidv4 } from "uuid";
import { SessionCard } from "../Compoenets/SessionCard"; // adjust path if needed
import { SessionActions } from "../Compoenets/SessionAction"; // adjust path
import { ChatPanel } from "../Compoenets/ChatPanel";
import { LivePreview } from "../Compoenets/Livepreview";
import { CodeInspector } from "../Compoenets/CodeInspector";
import { ErrorBoundary } from "../Compoenets/ErrorBoundary";
import "../styles/Dashboard.css";
import { Plus } from "../icons/plus";
import { Logout } from "../icons/Logout";
import { exportSessionAsZip } from "../utils/exportUtils";




const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Session {
    id: string;
    title: string;
    code: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
  }
  
 

export default function Dashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session>();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BACKEND_URL}/api/user/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSessions(res.data.sessions);
      if (res.data.sessions.length > 0) {
        setSelectedSession(res.data.sessions[0]);
        setChatMessages(res.data.sessions[0].messages || []);
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
      setError("Failed to load sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (code: string, prompt: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BACKEND_URL}/api/user/session`, {
        title: prompt.substring(0, 50) + (prompt.length > 50 ? "..." : ""), // Use prompt as title
        messages: [{
                id: uuidv4(),
                role: "user",
                content: prompt,
                timestamp: new Date().toISOString()
              }], // Store the prompt as a message
        code: code
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newSession = response.data.session;
      console.log('Created new session:', newSession);
      
      // Add the new session to the list and select it
      setSessions(prev => [newSession, ...prev]);
      
      return newSession;
    } catch (err) {
      console.error("Failed to create session", err);
      throw err;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BACKEND_URL}/api/user/session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from sessions list
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      // If the deleted session was selected, select the first available session
      if (selectedSession?.id === sessionId) {
        const remainingSessions = sessions.filter(s => s.id !== sessionId);
        setSelectedSession(remainingSessions.length > 0 ? remainingSessions[0] : undefined);
      }
    } catch (err) {
      console.error("Failed to delete session", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Modern Sidebar */}
      <div className="dashboard-sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <span>AI</span>
            </div>
            <div className="logo-text">
              <h1>Playground</h1>
              <p>AI Component Generator</p>
            </div>
          </div>
          
          <button
            onClick={async () => {
              setChatMessages([]);
              setSelectedSession(undefined);
              try {
                const newSession = await createSession("", "New Session");
                setSelectedSession(newSession);
                setChatMessages([]);
              } catch (err) {
                console.error('Failed to create new session:', err);
              }
            }}
            className="new-session-btn"
          >
            <Plus/>
            New Session
          </button>
        </div>

        {/* Sessions List */}
        <div className="sessions-list">
          <div className="space-y-2">
            {sessions.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                isSelected={selectedSession?.id === s.id}
                onClick={() => {
                  setSelectedSession(s);
                  setChatMessages(s.messages || []);
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            onClick={logout}
            className="logout-btn"
          >
            <Logout/>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Navigation */}
        <div className="top-navigation">
          <div className="nav-content">
            <div className="nav-left">
              <button className="mobile-menu-btn">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="nav-title">
                <h2>
                  {selectedSession ? selectedSession.title : "Welcome to AI Playground"}
                </h2>
                <p>
                  {selectedSession ? "Edit and refine your component" : "Create your first AI-generated component"}
                </p>
              </div>
            </div>
            
            {selectedSession && (
              <SessionActions
                onSave={() => console.log("Save clicked")}
                onExport={() => {
                  if (selectedSession) {
                    exportSessionAsZip({
                      jsxCode: selectedSession.code,
                      cssCode: "", // If you have CSS extraction, use it here
                      title: selectedSession.title || "Component"
                    });
                  }
                }}
                onDelete={() => {
                  if (selectedSession) {
                    deleteSession(selectedSession.id);
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="text-center">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading your sessions...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-container">
              <div className="error-content">
                <div className="error-icon">⚠️</div>
                <div className="error-text">
                  <h3>Something went wrong</h3>
                  <p>{error}</p>
                  <button onClick={fetchSessions} className="retry-btn">
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          {!loading && !error && (
            <div className="space-y-6">
              {/* AI Chat + Preview Grid */}
              <div className="content-grid">
                <ErrorBoundary>
                  <ChatPanel 
                    messages={chatMessages}
                    onMessageAdd={(message) => {
                      setChatMessages(prev => [...prev, message]);
                    }}
                    onCodeGenerated={async (code, prompt) => {
                      console.log('Code from backend:', code);
                      try {
                        await createSession(code, prompt);
                      } catch (err) {
                        console.error('Failed to create session:', err);
                      }
                    }} 
                  />
                </ErrorBoundary>
                <ErrorBoundary>
                  <LivePreview code={selectedSession?.code || ""} />
                </ErrorBoundary>
              </div>

              {/* Code Inspector */}
              {selectedSession?.code && (
                <ErrorBoundary>
                  <CodeInspector 
                    jsxCode={selectedSession.code} 
                    cssCode="" 
                    title={selectedSession.title}
                  />
                </ErrorBoundary>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
