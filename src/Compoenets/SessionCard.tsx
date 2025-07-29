// src/components/SessionCard.tsx
import React from "react";
import "../styles/SessionCard.css";

interface Session {
  id: string;
  title: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  session: Session;
  isSelected: boolean;
  onClick: () => void;
}

export const SessionCard: React.FC<Props> = ({ session, isSelected, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={onClick}
      className={`session-card ${isSelected ? 'selected' : ''}`}
    >
      <div className="card-header">
        <div className="card-title">
          <h3>{session.title}</h3>
          <p className="card-date">{formatDate(session.updatedAt)}</p>
        </div>
        {session.code && (
          <div className="code-badge">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Code
          </div>
        )}
      </div>
      
      {session.code && (
        <div className="code-preview">
          <div className="code-text">{session.code.substring(0, 100)}...</div>
        </div>
      )}
    </div>
  );
};
