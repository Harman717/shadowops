import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const { metrics } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `You are an engineering reliability system generating an automated CI incident report.

Analyze these metrics:

Total runs (7d): ${metrics.totalRuns}
Failed runs (7d): ${metrics.failedRuns}
Success rate: ${metrics.successRate}
Risk score: ${metrics.riskScore}/100
Risk level: ${metrics.riskLevel}

Respond STRICTLY in this format:

EXECUTIVE_SUMMARY: <one concise sentence about system health>

PRIMARY_RISK_DRIVER: <one sentence identifying the root cause>

IMMEDIATE_ACTION: <one specific, actionable technical step>

FULL_ANALYSIS:
<detailed structured explanation with numbered sections covering: risk justification, failure dynamics, and 3 remediation steps>

REQUIREMENTS:
- Keep tone analytical and confident
- Avoid generic platitudes
- Reference actual metrics in your analysis
- Make immediate action specific and technical
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 700,
    });

    return NextResponse.json({
      explanation: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI error:", error);
    return NextResponse.json(
      { error: "AI analysis failed" },
      { status: 500 }
    );
  }
}
