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

    const { message, context, submissionId, codeSnippet, behavioralState } = await req.json();

    // Build system prompt based on context
    let systemPrompt = "";

    if (context === "mentor") {
      systemPrompt = `You are Athena, an AI academic mentor for OpenDesk — an academic intelligence platform.
You help engineering students understand concepts, debug code, and build deeper understanding.

RULES:
- Never give direct code solutions unless the student has been struggling for a very long time.
- Guide with hints, analogies, and Socratic questions.
- Reference their behavioral data when relevant.
- Be encouraging but honest about mistakes.
- Keep responses concise and actionable.
- Use markdown formatting for code snippets.`;
    } else if (context === "lab_assistant") {
      systemPrompt = `You are a context-aware lab assistant integrated into a VS Code-style coding workspace.
You can see the student's code and behavioral patterns.

RULES:
- Provide conceptual hints, not direct solutions.
- Point out logical errors without fixing them.
- Suggest debugging strategies.
- Reference specific line numbers when applicable.
- If the student is in FLOW state, minimize interruption.
- If STRUGGLING, proactively offer guided hints.

${codeSnippet ? `CURRENT CODE:\n\`\`\`\n${codeSnippet}\n\`\`\`` : ""}
${behavioralState ? `BEHAVIORAL STATE: ${JSON.stringify(behavioralState)}` : ""}`;
    } else if (context === "viva") {
      systemPrompt = `You are an AI viva examiner for a practical lab course.
Ask follow-up questions based on the student's previous answers.
Evaluate depth of understanding, not just correctness.
Adjust difficulty based on performance.
Be professional but not intimidating.
Rate each answer on a scale of 1-10 for: accuracy, depth, and confidence.`;
    } else if (context === "reflection_analysis") {
      systemPrompt = `You analyze student reflections after lab sessions.
Score the reflection on:
- depth_score (1-100): How deeply did they think about what they learned?
- clarity_score (1-100): How clearly do they understand the concepts?
- authenticity_score (1-100): Does this seem like genuine reflection or filler?

Return JSON with these scores and a brief analysis.`;
    }

    // Fetch recent conversation history
    const { data: history } = await supabase
      .from("ai_messages")
      .select("role, content")
      .eq("student_id", user.id)
      .eq("context", context)
      .order("created_at", { ascending: false })
      .limit(10);

    const historyMessages = (history as { role: string; content: string }[] || [])
      .reverse()
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: message },
    ];

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "I couldn't generate a response.";
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Save both messages to database
    await supabase.from("ai_messages").insert([
      {
        student_id: user.id,
        submission_id: submissionId || null,
        context,
        role: "user",
        content: message,
        tokens_used: 0,
      },
      {
        student_id: user.id,
        submission_id: submissionId || null,
        context,
        role: "assistant",
        content: reply,
        tokens_used: tokensUsed,
        model: process.env.OPENAI_MODEL || "gpt-4o",
      },
    ]);

    return NextResponse.json({ reply, tokensUsed });
  } catch (error: unknown) {
    console.error("AI Chat Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
