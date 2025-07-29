import { useState } from "react";
import axios from "axios";
import "../styles/ChatPanel.css";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  onCodeGenerated: (code: string, prompt: string) => Promise<void>;
  messages?: Message[];
  onMessageAdd?: (message: Message) => void;
}

function formatTime(ts: string | Date | undefined) {
  if (!ts) return "";
  const date = typeof ts === "string" ? new Date(ts) : ts;
  return date && typeof date.toLocaleTimeString === 'function' ? date.toLocaleTimeString() : "";
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ onCodeGenerated, messages = [], onMessageAdd }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };
    onMessageAdd?.(userMessage);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/ai/generate`, {
        prompt,
      });

      const code = response.data.code;
      console.log(`the code from backend is : ${code}`)
      
      // Add assistant message to chat
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Generated code: ${code.substring(0, 100)}...`,
        timestamp: new Date()
      };
      onMessageAdd?.(assistantMessage);
      
      setSaving(true);
      try {
        await onCodeGenerated(code, prompt); // send to dashboard preview
      } catch (err) {
        setError("Failed to save session");
      } finally {
        setSaving(false);
      }
    } catch (err) {
      setError("Failed to generate code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="chat-avatar">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="chat-info">
            <h3>AI Assistant</h3>
            <p>Generate components with natural language</p>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {/* Chat history */}
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="empty-content">
              <div className="empty-icon">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3>Start a conversation</h3>
              <p>Ask me to create any component you need</p>
              <div className="suggestions">
                <div className="suggestion-item">💡 Try: "Create a modern card component"</div>
                <div className="suggestion-item">💡 Try: "Build a responsive navigation bar"</div>
                <div className="suggestion-item">💡 Try: "Design a contact form with validation"</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.role}`}
              >
                <div className="message-bubble">
                  <div className="message-content">{message.content}</div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <div className="input-container">
          <input
            className="chat-input"
            placeholder="Describe the component you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            disabled={loading || saving}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || saving || !prompt.trim()}
            className="generate-btn"
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Generating...
              </>
            ) : saving ? (
              <>
                <div className="loading-spinner"></div>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate
              </>
            )}
          </button>
        </div>
        {error && (
          <div className="error-message">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="error-text">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}; 