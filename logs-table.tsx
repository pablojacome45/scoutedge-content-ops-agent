import { AppHeader } from "@/components/app-header";
import { LogsTable } from "@/components/logs-table";
import { listLogs, listPublishJobs } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const [logs, jobs] = await Promise.all([listLogs(75), listPublishJobs(75)]);

  return (
    <main className="shell">
      <AppHeader eyebrow="Publish Jobs / Logs" title="Audit Trail" />
      <section className="page-section">
        <LogsTable logs={logs} jobs={jobs} />
      </section>
    </main>
  );
}
