
import React, { useState, useCallback, useRef } from 'react';
import { FileUploader } from './components/FileUploader';
import { ReadmeSettings } from './components/ReadmeSettings';
import { Button } from './components/Button';
// Fix: Added FileCodeIcon to the imports
import { SparklesIcon, GithubIcon, CopyIcon, CheckIcon, RocketIcon, FileCodeIcon } from './components/Icons';
import { GeminiReadmeService } from './services/geminiService';
import { ReadmeConfig, FileData, GenerationState } from './types';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [config, setConfig] = useState<ReadmeConfig>({
    projectName: '',
    repoUrl: '',
    includeLicense: true,
    includeBadges: true,
    style: 'comprehensive',
  });
  
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    output: '',
  });

  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const generate = useCallback(async () => {
    if (files.length === 0) {
      setState(prev => ({ ...prev, error: "Please add some files first!" }));
      return;
    }

    setState({ isGenerating: true, error: null, output: '' });
    
    try {
      const service = new GeminiReadmeService();
      await service.generateReadme(files, config, (chunk) => {
        setState(prev => ({ ...prev, output: prev.output + chunk }));
        // Auto scroll to bottom
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      });
      setState(prev => ({ ...prev, isGenerating: false }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: err instanceof Error ? err.message : "Generation failed"
      }));
    }
  }, [files, config]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(state.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <SparklesIcon />
            </div>
            <span className="text-xl font-bold tracking-tight">README Magic</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <GithubIcon />
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
              <FileUploader files={files} onFilesChange={setFiles} />
            </div>
            
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
              <ReadmeSettings config={config} onConfigChange={setConfig} />
            </div>

            <Button
              className="w-full py-4 shadow-lg shadow-indigo-500/10"
              size="lg"
              isLoading={state.isGenerating}
              onClick={generate}
              disabled={files.length === 0}
            >
              <RocketIcon />
              <span className="ml-2">Generate README</span>
            </Button>

            {state.error && (
              <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-400 text-sm">
                {state.error}
              </div>
            )}
          </div>

          {/* Editor/Preview Area */}
          <div className="lg:col-span-8 flex flex-col space-y-4 min-h-[600px]">
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
              <div className="h-12 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm font-medium text-slate-400">
                  <FileCodeIcon />
                  <span>README.md</span>
                </div>
                {state.output && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    <span>{copied ? 'Copied' : 'Copy Raw'}</span>
                  </button>
                )}
              </div>

              <div 
                ref={outputRef}
                className="flex-1 p-8 overflow-y-auto no-scrollbar font-mono text-sm leading-relaxed"
              >
                {!state.output && !state.isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <SparklesIcon />
                    <div>
                      <h4 className="font-semibold text-slate-300">Your README will appear here</h4>
                      <p className="text-slate-500 text-sm max-w-xs">Upload your project files and click generate to see the magic happen.</p>
                    </div>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-indigo-100 selection:bg-indigo-500/30">
                    {state.output}
                    {state.isGenerating && <span className="inline-block w-2 h-5 bg-indigo-500 animate-pulse ml-1 align-middle" />}
                  </pre>
                )}
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-start space-x-4">
              <div className="bg-indigo-500/10 p-2 rounded-lg">
                <SparklesIcon />
              </div>
              <div className="text-sm">
                <p className="text-slate-200 font-medium">Pro Tip</p>
                <p className="text-slate-400">For the best results, include your main entry point, a package manifest (e.g., package.json), and any key modules.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 space-y-4 md:space-y-0">
          <p>© 2025 README Magic. Built with Gemini 3 Pro.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300">Privacy</a>
            <a href="#" className="hover:text-slate-300">Terms</a>
            <a href="#" className="hover:text-slate-300">Feedback</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
