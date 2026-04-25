import { AppHeader } from "@/components/app-header";
import { DraftStatus, DraftStatusFilter, draftStatuses, draftStatusLabels } from "@/lib/content-types";
import { listSourcesWithDrafts } from "@/lib/content-store";
import { StatusBadge } from "@/components/status-badge";

export const dynamic = "force-dynamic";

interface QueuePageProps {
  searchParams?: Promise<{ status?: string }>;
}

function getStatusFilter(status?: string): DraftStatusFilter {
  if (status && draftStatuses.includes(status as DraftStatus)) {
    return status as DraftStatus;
  }

  return "all";
}

export default async function QueuePage({ searchParams }: QueuePageProps) {
  const params = await searchParams;
  const statusFilter = getStatusFilter(params?.status);
  const records = await listSourcesWithDrafts(statusFilter);
  const filterLinks = [
    { label: "All", href: "/queue", active: statusFilter === "all" },
    ...draftStatuses.map((status) => ({
      label: draftStatusLabels[status],
      href: `/queue?status=${status}`,
      active: statusFilter === status
    }))
  ];

  return (
    <main className="shell">
      <AppHeader eyebrow="Approval Queue" title="Review Drafts by Status" />

      <section className="status-filter-bar" aria-label="Draft status filters">
        {filterLinks.map((link) => (
          <a key={link.label} className={`filter-tab${link.active ? " active" : ""}`} href={link.href}>
            {link.label}
          </a>
        ))}
      </section>

      <section className="stack page-section">
        {records.length === 0 ? (
          <div className="panel">No drafts found for this status.</div>
        ) : (
          records.map(({ source, drafts }) => (
            <article key={source.id} className="panel stack">
              <div className="queue-item-header">
                <div>
                  <h2>{source.title}</h2>
                  <div className="muted">{new Date(source.createdAt).toLocaleString()}</div>
                </div>
                <a className="button-link secondary" href={`/updates/${source.id}`}>Review Drafts</a>
              </div>
              <div className="draft-status-row">
                {drafts.map((draft) => (
                  <div key={draft.id} className="status-pill">
                    <strong>{draft.platform}</strong>
                    <StatusBadge status={draft.approvalStatus} />
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
