import { NextResponse } from "next/server";
import { createSource } from "@/lib/content-store";
import { sourceInputSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const input = sourceInputSchema.parse(await request.json());
    const source = await createSource(input);
    return NextResponse.json({ source }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create source.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
