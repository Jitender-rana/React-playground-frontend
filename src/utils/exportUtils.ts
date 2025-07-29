import JSZip from 'jszip';

export async function exportSessionAsZip({ jsxCode, cssCode, title }: { jsxCode: string; cssCode: string; title: string }) {
  const zip = new JSZip();
  zip.file(`${title}.tsx`, jsxCode);
  zip.file(`${title}.css`, cssCode);
  const packageJson = {
    name: title.toLowerCase().replace(/\s+/g, '-'),
    version: "1.0.0",
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    }
  };
  zip.file('package.json', JSON.stringify(packageJson, null, 2));
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
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
} 