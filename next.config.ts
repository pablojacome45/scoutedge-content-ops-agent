import { ContentOpsLog, ContentOpsPublishJob, platformLabels } from "@/lib/content-types";

interface LogsTableProps {
  logs: ContentOpsLog[];
  jobs: ContentOpsPublishJob[];
}

export function LogsTable({ logs, jobs }: LogsTableProps) {
  return (
    <div className="stack">
      <section className="panel stack">
        <h2>Audit Trail</h2>
        {logs.length === 0 ? (
          <p className="muted">No log events yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Message</th>
                  <th>Reference</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.eventType.replaceAll("_", " ")}</td>
                    <td>{log.message || ""}</td>
                    <td>{log.draftId || log.sourceId || log.publishJobId || ""}</td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel stack">
        <h2>Publish Jobs</h2>
        {jobs.length === 0 ? (
          <p className="muted">No publish jobs in V1. Publishing is prepared but disabled.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Status</th>
                  <th>Error</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{platformLabels[job.platform]}</td>
                    <td>{job.jobStatus}</td>
                    <td>{job.errorMessage || ""}</td>
                    <td>{new Date(job.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
