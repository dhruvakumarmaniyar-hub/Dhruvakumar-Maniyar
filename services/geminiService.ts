
import { GoogleGenAI } from "@google/genai";
import { ReadmeConfig, FileData } from "../types";

export class GeminiReadmeService {
  private ai: GoogleGenAI;

  constructor() {
    // Fix: Always use process.env.API_KEY directly for initialization
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateReadme(
    files: FileData[],
    config: ReadmeConfig,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const codeContext = files
        .map(f => `File: ${f.name}\n\`\`\`\n${f.content}\n\`\`\``)
        .join("\n\n");

      const prompt = `
        You are a world-class technical writer and developer advocate. 
        Your task is to generate a professional, high-quality README.md for the following project code:

        Project Name: ${config.projectName}
        Repository URL: ${config.repoUrl || 'Not provided'}
        Style: ${config.style}
        Include Badges: ${config.includeBadges}
        Include License: ${config.includeLicense}

        --- PROJECT CODE ---
        ${codeContext}
        --- END PROJECT CODE ---

        INSTRUCTIONS:
        1. Analyze the code to understand the project's purpose, main features, and dependencies.
        2. Write a professional README.md with the following sections:
           - Catchy Header (with badges if requested)
           - Clear Description (What is it?)
           - Features (Bullet points)
           - Installation (Step-by-step for a developer)
           - Usage (Code examples based on the provided input)
           - Roadmap (Future ideas based on logic)
           - Contributing (Standard block)
           - License (If requested)
        3. Use high-quality Markdown formatting (bold, italics, tables where appropriate).
        4. If the style is 'playful', use emojis and a more conversational tone.
        5. If 'minimal', keep it strictly functional.
        6. Return ONLY the Markdown content.
      `;

      // Fix: Call generateContentStream with valid Gemini 3 Pro config
      const response = await this.ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });

      for await (const chunk of response) {
        // Fix: Correctly access the .text property of the GenerateContentResponse chunk
        if (chunk.text) {
          onChunk(chunk.text);
        }
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to generate README");
    }
  }
}
