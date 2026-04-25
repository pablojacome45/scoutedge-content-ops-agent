import { AppHeader } from "@/components/app-header";
import { getDashboardStats } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <main className="shell">
      <AppHeader eyebrow="ScoutEdge Content Ops Agent" title="Dashboard" />

      <section className="metric-grid" aria-label="Content operations status">
        <div className="panel">
          <div className="muted">Waiting for review</div>
          <div className="metric">{stats.waitingForReview}</div>
        </div>
        <div className="panel">
          <div className="muted">Approved drafts</div>
          <div className="metric">{stats.approvedDrafts}</div>
        </div>
        <div className="panel">
          <div className="muted">Posted drafts</div>
          <div className="metric">{stats.postedDrafts}</div>
        </div>
        <div className="panel">
          <div className="muted">Failed jobs</div>
          <div className="metric">{stats.failedJobs}</div>
        </div>
      </section>

      <section className="layout dashboard-body">
        <div className="panel stack">
          <span className="tag">V1 Approval First</span>
          <h2>Product update to reviewed drafts</h2>
          <p className="muted">
            Create one source update, generate platform-specific drafts for X, Facebook, and LinkedIn, then approve, reject, or hold each draft.
          </p>
          <p>
            <a className="button-link" href="/intake">Create New Content Source</a>
          </p>
        </div>

        <div className="panel stack">
          <h2>Recent Activity</h2>
          {stats.recentLogs.length === 0 ? (
            <p className="muted">No activity yet.</p>
          ) : (
            stats.recentLogs.map((log) => (
              <div key={log.id} className="activity-row">
                <strong>{log.eventType.replaceAll("_", " ")}</strong>
                <span className="muted">{log.message}</span>
                <span className="muted">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
