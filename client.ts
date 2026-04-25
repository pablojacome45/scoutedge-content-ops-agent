import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { DraftReviewCard } from "@/components/draft-review-card";
import { platforms, platformLabels } from "@/lib/content-types";
import { getSourceWithDrafts } from "@/lib/content-store";

export const dynamic = "force-dynamic";

interface UpdateReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateReviewPage({ params }: UpdateReviewPageProps) {
  const { id } = await params;
  const record = await getSourceWithDrafts(id);

  if (!record) {
    notFound();
  }

  const { source, drafts } = record;

  return (
    <main className="shell">
      <AppHeader eyebrow="Draft Review" title={source.title} />

      <section className="panel stack source-panel">
        <div className="row">
          <div>
            <div className="muted">Source type</div>
            <strong>{source.sourceType?.replaceAll("_", " ") || "idea"}</strong>
          </div>
          <div>
            <div className="muted">Audience</div>
            <strong>{source.audience || "Not specified"}</strong>
          </div>
          <div>
            <div className="muted">Status</div>
            <span className="tag">{source.status.replaceAll("_", " ")}</span>
          </div>
        </div>
        <div>
          <div className="muted">Source update</div>
          <p className="source-copy">{source.rawInput}</p>
        </div>
      </section>

      <section className="platform-grid page-section">
        {platforms.map((platform) => {
          const draft = drafts.find((item) => item.platform === platform);
          return draft ? (
            <DraftReviewCard key={draft.id} draft={draft} />
          ) : (
            <div key={platform} className="panel">
              <div className="muted">{platformLabels[platform]}</div>
              <p>No draft generated for this platform.</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
