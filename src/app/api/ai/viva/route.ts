import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic, subjectName, previousAnswers, difficulty } = await req.json();

    const systemPrompt = `You are an AI viva examiner for "${subjectName || "Computer Science"}".
Generate a viva question about "${topic || "data structures"}".

Current difficulty level: ${difficulty || "medium"}
${previousAnswers?.length ? `The student has already answered ${previousAnswers.length} questions.` : "This is the first question."}

Return JSON with:
{
  "question": "your question here",
  "topic": "specific topic",
  "difficulty": "easy|medium|hard",
  "expectedKeyPoints": ["key point 1", "key point 2"],
  "followUpHint": "a hint if the student struggles"
}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }],
      max_tokens: 512,
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Viva Question Error:", error);
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
  }
}
