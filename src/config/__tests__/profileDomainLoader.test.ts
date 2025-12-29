import { describe, expect, it } from "vitest";
import {
  getApplicationStageMeta,
  getProfileConfig,
  getProfileDomains,
  getProfilePhases,
  getTabDomainMapping,
} from "../profileLoader";

describe("DFSA profile domain scaffolding", () => {
  const domains = getProfileDomains();
  const phases = getProfilePhases();
  const tabMap = getTabDomainMapping();
  const tabs = getProfileConfig().tabs;

  it("sums domain question counts to 463", () => {
    const total = domains.reduce((sum, d) => sum + (d.questionCount || 0), 0);
    expect(total).toBe(463);
  });

  it("assigns each domain to a known phase", () => {
    const phaseIds = new Set(phases.map((p) => p.id));
    domains.forEach((domain) => {
      expect(phaseIds.has(domain.phaseId)).toBe(true);
    });
  });

  it("maps only known tabs and domains", () => {
    const tabIds = new Set(tabs.map((t) => t.id));
    const domainCodes = new Set(domains.map((d) => d.code));
    tabMap.forEach((entry) => {
      expect(tabIds.has(entry.tabId)).toBe(true);
      entry.domains.forEach((code) => {
        expect(domainCodes.has(code)).toBe(true);
      });
    });
  });

  it("exposes an application stage for the declarations tab", () => {
    const stage = getApplicationStageMeta();
    expect(stage.id).toBe("applicationTransaction");
    expect(stage.name).toContain("Application Transaction");
  });
});
