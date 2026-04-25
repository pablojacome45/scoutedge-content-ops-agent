import { NextResponse } from "next/server";
import { setDraftApprovalStatus } from "@/lib/content-store";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const draft = await setDraftApprovalStatus(id, "approved");
    return NextResponse.json({ draft });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to approve draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
