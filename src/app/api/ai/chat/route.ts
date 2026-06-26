import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { message, code, language, history = [] } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        reply: "To use the AI Assistant, please add your GEMINI_API_KEY to the .env.local file in your project root.",
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are a Context-Aware AI Tutor built into the OpenDesk Academic Platform. 
Your role is to guide students to write better code without just giving them the full answer immediately. 
You are currently helping a student writing code in ${language}.
Current Code Context:
\`\`\`${language}
${code}
\`\`\`
Give concise, helpful hints, point out syntax errors, or explain concepts clearly. Use markdown formatting.`;

    const contents = [];
    for (const msg of history) {
      contents.push({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.text }]
      });
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini AI Chat Error:", error);
    return NextResponse.json({
      error: `Gemini Error: ${error.message || "Unknown error occurred"}`,
    }, { status: 500 });
  }
}
