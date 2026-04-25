:root {
  --bg: #f5f7fa;
  --panel: #ffffff;
  --line: #d8dee8;
  --text: #17202e;
  --muted: #667386;
  --brand: #176f7a;
  --brand-dark: #0f4f57;
  --accent: #c84727;
  --success: #156f43;
  --danger: #9f1d1d;
  --hold: #755b12;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
}

a {
  color: var(--brand-dark);
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin: 6px 0;
  font-size: 34px;
  line-height: 1.12;
}

h2 {
  font-size: 20px;
  line-height: 1.25;
}

main {
  min-height: 100vh;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 680px;
}

th,
td {
  border-bottom: 1px solid var(--line);
  padding: 12px;
  text-align: left;
  vertical-align: top;
}

th {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

.shell {
  width: min(1160px, calc(100% - 24px));
  margin: 0 auto;
}

.topbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 0;
  align-items: center;
  flex-wrap: wrap;
}

.nav,
.action-row,
.approval-actions,
.status-filter-bar,
.checkbox-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.nav a {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 9px 11px;
  background: white;
  text-decoration: none;
}

.layout,
.row,
.stack,
.metric-grid,
.platform-grid,
.draft-status-row {
  display: grid;
  gap: 16px;
}

.layout {
  grid-template-columns: minmax(260px, 0.8fr) minmax(320px, 1.2fr);
}

.row,
.metric-grid,
.draft-status-row {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.platform-grid {
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  align-items: start;
}

.page-section,
.dashboard-body {
  padding-bottom: 34px;
}

.source-panel {
  margin-bottom: 18px;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 20px;
}

.label {
  display: block;
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 6px;
}

.field {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px 14px;
  font: inherit;
  background: white;
}

.textarea {
  min-height: 120px;
  resize: vertical;
}

.tall-textarea {
  min-height: 220px;
}

.review-textarea {
  min-height: 250px;
}

.fieldset {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px;
}

.check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.button,
.button-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  background: var(--brand);
  color: white;
  padding: 12px 16px;
  font: inherit;
  cursor: pointer;
  text-decoration: none;
  min-height: 44px;
}

.button-link.secondary,
.secondary-button {
  background: #edf4f5;
  color: var(--brand-dark);
  border: 1px solid #bfd5d8;
}

.approve-button {
  background: var(--success);
}

.reject-button {
  background: var(--danger);
}

.hold-button {
  background: var(--hold);
}

.metric {
  font-size: 34px;
  font-weight: 700;
  margin-top: 6px;
}

.muted {
  color: var(--muted);
}

.tag {
  display: inline-flex;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 8px;
  background: #e7f3f4;
  color: var(--brand-dark);
  font-size: 12px;
  text-transform: uppercase;
}

.platform-card {
  display: grid;
  gap: 14px;
  align-content: start;
}

.platform-card-header,
.queue-item-header,
.activity-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  flex-wrap: wrap;
}

.source-copy {
  white-space: pre-wrap;
  line-height: 1.55;
  margin-bottom: 0;
}

.approval-actions {
  border-top: 1px solid var(--line);
  padding-top: 14px;
}

.status-filter-bar {
  margin-bottom: 18px;
}

.filter-tab {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text);
  text-decoration: none;
  background: white;
}

.filter-tab.active {
  border-color: var(--brand);
  background: #e7f3f4;
  color: var(--brand-dark);
}

.status-pill {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 12px;
  background: #fbfcfd;
  text-transform: capitalize;
}

.status-approved {
  color: var(--success);
}

.status-rejected,
.status-failed {
  color: var(--danger);
}

.status-held,
.status-scheduled {
  color: var(--hold);
}

.status-posted {
  color: var(--accent);
}

.table-wrap {
  overflow-x: auto;
}

@media (max-width: 760px) {
  h1 {
    font-size: 28px;
  }

  .layout {
    grid-template-columns: 1fr;
  }

  .button,
  .button-link {
    width: 100%;
  }
}
