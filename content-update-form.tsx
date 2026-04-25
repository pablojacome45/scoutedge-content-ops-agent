import { AppHeader } from "@/components/app-header";
import { ContentUpdateForm } from "@/components/content-update-form";

export default function IntakePage() {
  return (
    <main className="shell">
      <AppHeader eyebrow="Content Intake" title="Create a Source Update" />

      <section className="layout page-section">
        <div className="panel stack">
          <span className="tag">Generate Drafts</span>
          <h2>One factual source becomes review-ready platform drafts.</h2>
          <p className="muted">
            The source is saved first, OpenAI runs server-side only, and every draft starts in review status with an audit log entry.
          </p>
        </div>
        <ContentUpdateForm />
      </section>
    </main>
  );
}
