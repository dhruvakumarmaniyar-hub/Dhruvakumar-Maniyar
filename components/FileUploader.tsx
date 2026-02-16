
import React, { useRef } from 'react';
import { FileData } from '../types';
import { Button } from './Button';
import { FileCodeIcon, TrashIcon } from './Icons';

interface FileUploaderProps {
  files: FileData[];
  onFilesChange: (files: FileData[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ files, onFilesChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: FileData[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const content = await file.text();
      newFiles.push({ name: file.name, content });
    }

    onFilesChange([...files, ...newFiles]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Project Files</h3>
        <input
          type="file"
          multiple
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".js,.ts,.tsx,.py,.go,.rs,.java,.cpp,.c,.h,.css,.html,.json,.md"
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
        >
          Add Files
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto no-scrollbar">
        {files.length === 0 ? (
          <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-500 text-sm">No files uploaded. Add some code to get started.</p>
          </div>
        ) : (
          files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2 transition-colors hover:bg-slate-800/50"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <FileCodeIcon />
                <span className="text-sm text-slate-300 truncate font-medium">{file.name}</span>
              </div>
              <button
                onClick={() => removeFile(idx)}
                className="text-slate-500 hover:text-red-400 transition-colors p-1"
              >
                <TrashIcon />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
