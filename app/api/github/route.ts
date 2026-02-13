import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, owner, repo } = await req.json();

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  try {
    const commitsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=20`,
      { headers }
    );

    const workflowsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=20`,
      { headers }
    );

    const commits = await commitsRes.json();
    const workflows = await workflowsRes.json();

    return NextResponse.json({ commits, workflows });
  } catch (error) {
    return NextResponse.json(
      { error: "GitHub fetch failed" },
      { status: 500 }
    );
  }
}
