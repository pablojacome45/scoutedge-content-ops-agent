"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { platforms } from "@/lib/content-types";
import { createSourceWithDrafts, setDraftApprovalStatus, updateDraft } from "@/lib/content-store";
import { draftUpdateSchema, sourceInputSchema } from "@/lib/validators";

function getSelectedPlatforms(formData: FormData) {
  const selected = formData.getAll("platforms").map(String);
  return platforms.filter((platform) => selected.includes(platform));
}

export async function createContentSourceAction(formData: FormData) {
  const input = sourceInputSchema.parse({
    title: formData.get("title"),
    sourceType: formData.get("sourceType") || undefined,
    rawInput: formData.get("rawInput"),
    audience: formData.get("audience") || undefined,
    cta: formData.get("cta") || undefined,
    tone: formData.get("tone") || undefined,
    mediaUrl: formData.get("mediaUrl") || undefined,
    contentMode: formData.get("contentMode") || undefined,
    platforms: getSelectedPlatforms(formData)
  });

  const result = await createSourceWithDrafts(input);
  redirect(`/updates/${result.source.id}`);
}

export async function saveDraftAction(formData: FormData) {
  const draftId = String(formData.get("draftId") || "");
  const sourceId = String(formData.get("sourceId") || "");
  const hashtags = String(formData.get("hashtags") || "")
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean);

  if (!draftId || !sourceId) {
    throw new Error("Draft and source IDs are required.");
  }

  const updates = draftUpdateSchema.parse({
    draftText: formData.get("draftText"),
    hook: formData.get("hook") || undefined,
    cta: formData.get("cta") || undefined,
    hashtags
  });

  await updateDraft(draftId, updates);
  revalidatePath(`/updates/${sourceId}`);
  revalidatePath("/queue");
  revalidatePath("/logs");
}

async function setStatusFromForm(formData: FormData, status: "approved" | "rejected" | "held") {
  const draftId = String(formData.get("draftId") || "");
  const sourceId = String(formData.get("sourceId") || "");

  if (!draftId || !sourceId) {
    throw new Error("Draft and source IDs are required.");
  }

  await setDraftApprovalStatus(draftId, status);
  revalidatePath(`/updates/${sourceId}`);
  revalidatePath("/queue");
  revalidatePath("/logs");
}

export async function approveDraftAction(formData: FormData) {
  await setStatusFromForm(formData, "approved");
}

export async function rejectDraftAction(formData: FormData) {
  await setStatusFromForm(formData, "rejected");
}

export async function holdDraftAction(formData: FormData) {
  await setStatusFromForm(formData, "held");
}
