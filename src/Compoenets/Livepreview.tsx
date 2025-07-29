import React, { useMemo, useEffect } from "react";
import "../styles/LivePreview.css";

interface Props {
  code: string;
}

export const LivePreview = ({ code }: Props) => {
  // Debug logging
  useEffect(() => {
    console.log('LivePreview received code:', code);
    console.log('Code length:', code?.length);
  }, [code]);

  // Check if user code already contains full HTML structure
  const isFullHTML = useMemo(() => {
    return code && /<html[\s\S]*?>[\s\S]*<\/html>/i.test(code);
  }, [code]);

  // Compose final HTML to inject into iframe
  const finalHtml = useMemo(() => {
    if (!code || code.trim() === '') {
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 min-h-screen">
          <div class="flex items-center justify-center h-screen text-gray-500">
            <p>No code to preview</p>
          </div>
        </body>
        </html>
      `;
    }

    const html = isFullHTML
      ? code
      : `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 min-h-screen">
          ${code}
        </body>
        </html>
      `;
    
    console.log('Final HTML for iframe:', html.substring(0, 200) + '...');
    return html;
  }, [code, isFullHTML]);

  return (
    <div className="live-preview">
      <div className="preview-header">
        <div className="preview-header-content">
          <div className="preview-icon">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div className="preview-info">
            <h3>Live Preview</h3>
            <p>See your component in action</p>
          </div>
        </div>
      </div>

      <div className="preview-container">
        {!code || code.trim() === '' ? (
          <div className="preview-empty">
            <div className="empty-preview-content">
              <div className="empty-preview-icon">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3>No preview available</h3>
              <p>Generate some code to see the live preview</p>
            </div>
          </div>
        ) : (
          <iframe
            key={code}
            title="Live Preview"
            srcDoc={finalHtml}
            sandbox="allow-scripts"
            className="preview-iframe"
          />
        )}
      </div>
    </div>
  );
};
