import { redirect } from "next/navigation";
import { OpsDashboard } from "@/components/OpsDashboard";
import { getEditorialAudits } from "@/lib/editorial-audit";
import { hasOpsAccess } from "@/lib/ops-auth";
import { getApplicationRuns, getCollectionRuns, getOperationsManifestStatus, getPublicRecords, getSourceHealth } from "@/lib/operations";
import { sites } from "@/lib/sites";

export const dynamic = "force-dynamic";

export default async function OpsPage() {
  if (!(await hasOpsAccess())) redirect("/ops/login");
  const [applicationRuns, collectionRuns, snapshots] = await Promise.all([
    getApplicationRuns(),
    getCollectionRuns(),
    Promise.all(sites.map(async (site) => {
      const snapshot = await getPublicRecords(site);
      return { siteSlug: site.slug, name: site.name, count: snapshot.records.length, live: snapshot.live };
    }))
  ]);
  const sourceHealth = sites.flatMap((site) => getSourceHealth(site.slug));
  const manifestStatus = getOperationsManifestStatus();
  return <OpsDashboard applicationRuns={applicationRuns} sourceHealth={sourceHealth} snapshots={snapshots} collectionRuns={collectionRuns} qualityAudits={getEditorialAudits()} manifestUpdatedAt={manifestStatus.updatedAt} />;
}
