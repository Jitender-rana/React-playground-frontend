import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import JSZip from 'jszip';
import '../styles/CodeInspector.css';

interface CodeInspectorProps {
  jsxCode: string;
  cssCode: string;
  title?: string;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({ jsxCode, cssCode, title = "Component" }) => {
  const [activeTab, setActiveTab] = useState<'jsx' | 'css'>('jsx');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const downloadAsZip = async () => {
    const zip = new JSZip();
    
    // Add JSX/TSX file
    zip.file(`${title}.tsx`, jsxCode);
    
    // Add CSS file
    zip.file(`${title}.css`, cssCode);
    
    // Add package.json for React project
    const packageJson = {
      name: title.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      }
    };
    zip.file('package.json', JSON.stringify(packageJson, null, 2));
    
    // Add README
    const readme = `# ${title}

This component was generated using AI.

## Files:
- \`${title}.tsx\` - React component
- \`${title}.css\` - Styles

## Usage:
\`\`\`jsx
import { ${title.replace(/\s+/g, '')} } from './${title}.tsx';
import './${title}.css';

function App() {
  return <${title.replace(/\s+/g, '')} />;
}
\`\`\`
`;
    zip.file('README.md', readme);
    
    // Generate and download zip
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const extractCSSFromJSX = (jsx: string): string => {
    // Extract Tailwind classes and convert to CSS
    const tailwindClasses = jsx.match(/className="([^"]*)"/g) || [];
    let css = '';
    
    tailwindClasses.forEach(match => {
      const classes = match.replace('className="', '').replace('"', '');
      if (classes.includes('bg-') || classes.includes('text-') || classes.includes('p-') || classes.includes('m-')) {
        css += `/* Tailwind classes: ${classes} */\n`;
      }
    });
    
    return css || '/* No custom CSS found */';
  };

  const getCurrentCode = () => {
    if (activeTab === 'jsx') {
      return jsxCode;
    } else {
      return extractCSSFromJSX(jsxCode);
    }
  };

  return (
    <div className="code-inspector">
      {/* Header */}
      <div className="inspector-header">
        <div className="inspector-header-content">
          <div className="inspector-title">
            <div className="inspector-icon">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className="inspector-info">
              <h3>Code Inspector</h3>
              <p>View and export your generated code</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="inspector-tabs">
        <button
          onClick={() => setActiveTab('jsx')}
          className={`inspector-tab ${activeTab === 'jsx' ? 'active' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          JSX/TSX
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`inspector-tab ${activeTab === 'css' ? 'active' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-3m-3 3l-3-3m3 3V9a6 6 0 0112 0v6" />
          </svg>
          CSS
        </button>
      </div>

      {/* Code Area */}
      <div className="inspector-code-area">
        {/* Action Buttons */}
        <div className="inspector-actions">
          <button
            onClick={() => copyToClipboard(getCurrentCode())}
            className="inspector-action-btn"
            title="Copy code"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
          <button
            onClick={downloadAsZip}
            className="inspector-action-btn"
            title="Download as ZIP"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download
          </button>
        </div>

        {/* Code Display */}
        <SyntaxHighlighter
          language={activeTab === 'jsx' ? 'tsx' : 'css'}
          style={tomorrow}
          customStyle={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          {getCurrentCode()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}; 