// Monaco Editor setup
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' } });

let editor;
let currentLanguage = 'js';
const defaultCode = {
  html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>JS Example</title>\n  <style>\n    body {\n      font-family: Arial, sans-serif;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      height: 100vh;\n      margin: 0;\n      background-color: #f0f0f0;\n    }\n    .container {\n      text-align: center;\n      padding: 2rem;\n      background: white;\n      border-radius: 8px;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.1);\n    }\n    button {\n      padding: 0.5rem 1rem;\n      background: #3b82f6;\n      color: white;\n      border: none;\n      border-radius: 4px;\n      cursor: pointer;\n      font-size: 1rem;\n      transition: all 0.2s;\n    }\n    button:hover {\n      background: #2563eb;\n      transform: translateY(-2px);\n    }\n  </style>\n</head>\n<body>\n  <div class="container">\n    <h1>Try JavaScript!</h1>\n    <p>Click the button below to see an alert</p>\n    <button onclick="showAlert()">Show Alert</button>\n  </div>\n</body>\n</html>',
  css: '/* Add your CSS styles here */\nbody {\n  font-family: Arial, sans-serif;\n  background-color: #f0f0f0;\n  margin: 0;\n  padding: 20px;\n}\n\n.box {\n  width: 100px;\n  height: 100px;\n  background-color: #3b82f6;\n  border-radius: 8px;\n  margin: 20px auto;\n  transition: all 0.3s ease;\n}\n\n.box:hover {\n  transform: scale(1.1) rotate(10deg);\n  background-color: #8b5cf6;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.2);\n}\n\n.animated {\n  animation: bounce 1s infinite alternate;\n}\n\n@keyframes bounce {\n  from {\n    transform: translateY(0);\n  }\n  to {\n    transform: translateY(-20px);\n  }\n}',
  js: '// Example JavaScript function\nfunction showAlert() {\n  alert("Hello from JavaScript!");\n  console.log("Alert button was clicked");\n}\n\n// You can also manipulate the DOM\nfunction createBox() {\n  const box = document.createElement("div");\n  box.className = "box";\n  document.body.appendChild(box);\n  \n  // Add animation class after a delay\n  setTimeout(() => {\n    box.classList.add("animated");\n    console.log("Box is now animated!");\n  }, 1000);\n}\n\n// Log when the page loads\ndocument.addEventListener("DOMContentLoaded", () => {\n  console.log("Page loaded and ready!");\n});'
};

let code = { ...defaultCode };

// Initialize Monaco Editor
require(['vs/editor/editor.main'], function() {
  // Define custom theme
  monaco.editor.defineTheme('codeTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'C586C0', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'regexp', foreground: 'D16969' },
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'namespace', foreground: '569CD6' },
      { token: 'type', foreground: '4EC9B0' },
      { token: 'struct', foreground: '4EC9B0' },
      { token: 'class', foreground: '4EC9B0', fontStyle: 'bold' },
      { token: 'interface', foreground: '4EC9B0' },
      { token: 'enum', foreground: '4EC9B0' },
      { token: 'typeParameter', foreground: '4EC9B0' },
      { token: 'function', foreground: 'DCDCAA' },
      { token: 'member', foreground: '9CDCFE' },
      { token: 'macro', foreground: 'BD63C5' },
      { token: 'variable', foreground: '9CDCFE' },
      { token: 'parameter', foreground: '9CDCFE' },
      { token: 'property', foreground: '9CDCFE' },
      { token: 'label', foreground: '717171' }
    ],
    colors: {
      'editor.background': '#1E1E1E',
      'editor.foreground': '#D4D4D4',
      'editorLineNumber.foreground': '#858585',
      'editorCursor.foreground': '#A6A6A6',
      'editor.selectionBackground': '#264F78',
      'editor.inactiveSelectionBackground': '#3A3D41',
      'editorWhitespace.foreground': '#3A3D41'
    }
  });

  editor = monaco.editor.create(document.getElementById('editor'), {
    value: code[currentLanguage],
    language: currentLanguage,
    theme: 'codeTheme',
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: 'JetBrains Mono',
    padding: { top: 16 },
    smoothScrolling: true,
    cursorSmoothCaretAnimation: 'on',
    formatOnPaste: true,
    formatOnType: true,
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    tabSize: 2,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on'
  });

  editor.onDidChangeModelContent(() => {
    code[currentLanguage] = editor.getValue();
    updatePreview();
  });

  // Initial preview
  updatePreview();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    editor.layout();
  });
});

// Tab switching
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const language = tab.dataset.tab;
      if (language === currentLanguage) return;

      // Update active tab
      document.querySelector('.tab.active').classList.remove('active');
      tab.classList.add('active');

      // Update editor
      currentLanguage = language;
      monaco.editor.setModelLanguage(editor.getModel(), language);
      editor.setValue(code[language]);
    });
  });

  // Console functionality
  const consoleOutput = document.getElementById('consoleOutput');

  document.getElementById('clearConsole').addEventListener('click', () => {
    consoleOutput.innerHTML = '';
    // Add back the ready message
    const readyMessage = document.createElement('div');
    readyMessage.textContent = '[LOG] Ready to code! 🚀';
    readyMessage.className = 'ready-message';
    consoleOutput.appendChild(readyMessage);
  });

  // Back button functionality
  document.getElementById('BackBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.history.back();
  });

  // Protection against keyboard shortcuts and right-click
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const message = document.createElement('div');
    message.textContent = '[INFO] Right-click is disabled in this editor';
    message.className = 'info';
    consoleOutput.appendChild(message);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  });

  document.addEventListener("keydown", (event) => {
    const forbiddenKeys = [
      { ctrl: true, key: "u" },
      { ctrl: true, shift: true, key: "i" },
      { ctrl: true, shift: true, key: "j" },
      { ctrl: true, key: "s" }
    ];

    if (forbiddenKeys.some(k => 
        event.ctrlKey === k.ctrl && 
        event.shiftKey === (k.shift || false) &&
        event.key.toLowerCase() === k.key
    )) {
      event.preventDefault();
      const message = document.createElement('div');
      message.textContent = '[INFO] This keyboard shortcut is disabled';
      message.className = 'info';
      consoleOutput.appendChild(message);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
  });
});

// Preview functionality
function updatePreview() {
  const wrappedJS = `
    try {
      const originalConsole = console.log;
      const originalConsoleError = console.error;
      const originalConsoleWarn = console.warn;
      const originalConsoleInfo = console.info;
      
      console.log = function(...args) {
        window.parent.postMessage({ type: 'log', content: args.join(' ') }, '*');
        originalConsole.apply(console, args);
      };

      console.error = function(...args) {
        window.parent.postMessage({ type: 'error', content: args.join(' ') }, '*');
        originalConsoleError.apply(console, args);
      };
      
      console.warn = function(...args) {
        window.parent.postMessage({ type: 'warning', content: args.join(' ') }, '*');
        originalConsoleWarn.apply(console, args);
      };
      
      console.info = function(...args) {
        window.parent.postMessage({ type: 'info', content: args.join(' ') }, '*');
        originalConsoleInfo.apply(console, args);
      };

      ${code.js}
    } catch (error) {
      window.parent.postMessage({ type: 'error', content: error.message }, '*');
    }
  `;

  const preview = document.getElementById('preview');
  preview.srcdoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${code.css}</style>
      </head>
      <body>
        ${code.html}
        <script>${wrappedJS}<\/script>
      </body>
    </html>
  `;
}

// Navigation Toggle Function
function toggleNav() {
  const navMenu = document.getElementById('navMenu');
  const overlay = document.getElementById('overlay');

  navMenu.classList.toggle('open');
  overlay.classList.toggle('active');

  // Prevent body scrolling when nav is open
  if (navMenu.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Console message handling
window.addEventListener('message', event => {
  if (event.data && typeof event.data === 'object') {
    const { type, content } = event.data;
    const log = document.createElement('div');
    log.textContent = `[${type.toUpperCase()}] ${content}`;
    log.className = type;
    consoleOutput.appendChild(log);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }
});
