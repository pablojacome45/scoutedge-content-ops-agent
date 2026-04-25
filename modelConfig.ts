import { AppHeader } from "@/components/app-header";
import { appConfig, hasSupabasePublicConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

function ConfigRow({ label, configured }: { label: string; configured: boolean }) {
  return (
    <div className="status-pill">
      <strong>{label}</strong>
      <span className={configured ? "status-approved" : "status-held"}>{configured ? "Configured" : "Missing"}</span>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <main className="shell">
      <AppHeader eyebrow="Settings / Integrations" title="Environment Status" />

      <section className="layout page-section">
        <div className="panel stack">
          <h2>Core Services</h2>
          <ConfigRow label="Supabase public config" configured={hasSupabasePublicConfig()} />
          <ConfigRow label="Supabase service role" configured={Boolean(appConfig.supabaseServiceRoleKey)} />
          <ConfigRow label="OpenAI API key" configured={Boolean(appConfig.openAiApiKey)} />
          <ConfigRow label="OpenAI draft model" configured={Boolean(appConfig.openAiModel)} />
          <ConfigRow label="OpenAI fast model" configured={Boolean(appConfig.openAiFastModel)} />
        </div>

        <div className="panel stack">
          <h2>Publishing Integrations</h2>
          <ConfigRow label="X credentials" configured={Boolean(appConfig.xApiKey && appConfig.xApiSecret && appConfig.xAccessToken && appConfig.xAccessTokenSecret)} />
          <ConfigRow label="Facebook Page credentials" configured={Boolean(appConfig.metaPageId && appConfig.metaPageAccessToken)} />
          <ConfigRow label="LinkedIn credentials" configured={Boolean(appConfig.linkedInClientId && appConfig.linkedInClientSecret && appConfig.linkedInAccessToken)} />
          <p className="muted">V1 keeps publishing disabled even when credentials exist.</p>
        </div>
      </section>
    </main>
  );
}
