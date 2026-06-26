import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If testing without auth, you can temporarily bypass this
    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is missing" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { topic, subjectName, previousAnswers, difficulty } = await req.json();

    const systemPrompt = `You are an AI viva examiner for "${subjectName || "Computer Science"}".
Generate a viva question about "${topic || "data structures"}".

Current difficulty level: ${difficulty || "medium"}
${previousAnswers?.length ? `The student has already answered ${previousAnswers.length} questions.` : "This is the first question."}

Return ONLY valid JSON matching this structure:
{
  "question": "your question here",
  "topic": "specific topic",
  "difficulty": "easy|medium|hard",
  "expectedKeyPoints": ["key point 1", "key point 2"],
  "followUpHint": "a hint if the student struggles"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
        maxOutputTokens: 512,
      }
    });

    const result = JSON.parse(response.text || "{}");
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Viva Question Error:", error);
    return NextResponse.json({ error: `Failed to generate question: ${error.message}` }, { status: 500 });
  }
}
