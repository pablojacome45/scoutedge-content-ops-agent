import { NextResponse } from "next/server";
import { updateDraft } from "@/lib/content-store";
import { draftUpdateSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const input = draftUpdateSchema.parse(await request.json());
    const draft = await updateDraft(id, input);
    return NextResponse.json({ draft });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
