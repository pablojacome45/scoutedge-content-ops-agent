import { DraftStatus, draftStatusLabels } from "@/lib/content-types";

interface StatusBadgeProps {
  status: DraftStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`tag status-${status}`}>{draftStatusLabels[status]}</span>;
}
