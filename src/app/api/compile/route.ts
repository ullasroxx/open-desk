import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import os from "os";

// Helper to run commands with timeout
const runCommand = (command: string, timeoutMs: number): Promise<{ stdout: string; stderr: string; code: number }> => {
  return new Promise((resolve) => {
    const child = exec(command, { timeout: timeoutMs, killSignal: "SIGKILL" }, (error, stdout, stderr) => {
      resolve({
        stdout: stdout || "",
        stderr: stderr || "",
        code: error?.code || 0,
      });
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    const { language, code, stdin } = await req.json();

    if (!language || !code) {
      return NextResponse.json({ error: "Language and code required" }, { status: 400 });
    }

    const tempDir = path.join(os.tmpdir(), `opendesk_compile_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
    await mkdir(tempDir, { recursive: true });

    let output = "";
    let exitCode = 0;
    const startTime = Date.now();
    let truncated = false;

    // We pipe the stdin if provided
    const inputRedirect = stdin ? `echo ${JSON.stringify(stdin)} | ` : "";

    try {
      if (language === "c") {
        const filePath = path.join(tempDir, "main.c");
        const outPath = path.join(tempDir, "a.out");
        await writeFile(filePath, code);
        
        const compile = await runCommand(`gcc "${filePath}" -o "${outPath}"`, 5000);
        if (compile.code !== 0) {
          exitCode = compile.code;
          output = compile.stderr;
        } else {
          const run = await runCommand(`${inputRedirect}"${outPath}"`, 5000);
          exitCode = run.code;
          output = run.stderr ? run.stderr + "\n" + run.stdout : run.stdout;
        }
      } 
      else if (language === "cpp") {
        const filePath = path.join(tempDir, "main.cpp");
        const outPath = path.join(tempDir, "a.out");
        await writeFile(filePath, code);
        
        const compile = await runCommand(`g++ "${filePath}" -o "${outPath}"`, 5000);
        if (compile.code !== 0) {
          exitCode = compile.code;
          output = compile.stderr;
        } else {
          const run = await runCommand(`${inputRedirect}"${outPath}"`, 5000);
          exitCode = run.code;
          output = run.stderr ? run.stderr + "\n" + run.stdout : run.stdout;
        }
      } 
      else if (language === "python") {
        const filePath = path.join(tempDir, "main.py");
        await writeFile(filePath, code);
        
        // Use python3 on Mac/Linux
        const run = await runCommand(`${inputRedirect}python3 "${filePath}"`, 5000);
        exitCode = run.code;
        output = run.stderr ? run.stderr + "\n" + run.stdout : run.stdout;
      } 
      else if (language === "javascript") {
        const filePath = path.join(tempDir, "main.js");
        await writeFile(filePath, code);
        
        const run = await runCommand(`${inputRedirect}node "${filePath}"`, 5000);
        exitCode = run.code;
        output = run.stderr ? run.stderr + "\n" + run.stdout : run.stdout;
      } 
      else if (language === "java") {
        const filePath = path.join(tempDir, "Main.java");
        await writeFile(filePath, code);
        
        const compile = await runCommand(`javac "${filePath}"`, 5000);
        if (compile.code !== 0) {
          exitCode = compile.code;
          output = compile.stderr;
        } else {
          const run = await runCommand(`${inputRedirect}java -cp "${tempDir}" Main`, 5000);
          exitCode = run.code;
          output = run.stderr ? run.stderr + "\n" + run.stdout : run.stdout;
        }
      } 
      else {
        return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
      }
    } catch (e: any) {
      exitCode = 1;
      output = `Execution Failed: ${e.message}`;
    }

    // Clean output
    if (output.length > 50000) {
      output = output.substring(0, 50000) + "\n...[Output Truncated]";
      truncated = true;
    }

    return NextResponse.json({
      success: exitCode === 0,
      output: output || "(No output)",
      exitCode,
      signal: null,
      executionTimeMs: Date.now() - startTime,
      language,
      version: "local",
      truncated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal execution error" }, { status: 500 });
  }
}
