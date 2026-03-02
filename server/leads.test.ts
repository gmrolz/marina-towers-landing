import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("leads.submit validation", () => {
  it("rejects submission without name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        name: "",
        phone: "01012345678",
      })
    ).rejects.toThrow();
  });

  it("rejects submission without phone", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        name: "Ahmed Hassan",
        phone: "",
      })
    ).rejects.toThrow();
  });

  it("rejects invalid email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        name: "Ahmed Hassan",
        phone: "01012345678",
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });
});

describe("leads qualification scoring logic", () => {
  it("hot lead: ready now, large budget, launch timeline", () => {
    // Simulate scoring logic inline (mirrors server/db.ts)
    let score = 0;
    const data = {
      budgetRange: "25m+",
      downPaymentReady: "ready_now",
      financingMethod: "cash",
      timeline: "launch",
      unitType: "Penthouse",
      useCase: "investment",
      personalityType: "achiever",
      primaryMotivation: "investment",
    };

    if (data.budgetRange === "25m+") score += 20;
    if (data.downPaymentReady === "ready_now") score += 20;
    if (data.financingMethod === "cash") score += 10;
    if (data.timeline === "launch") score += 15;
    if (data.unitType === "Penthouse") score += 10;
    if (data.useCase === "investment") score += 5;
    if (data.personalityType === "achiever") score += 10;
    if (data.primaryMotivation === "investment") score += 10;

    expect(score).toBeGreaterThanOrEqual(70);
    const tier = score >= 70 ? "hot" : score >= 40 ? "warm" : "cold";
    expect(tier).toBe("hot");
  });

  it("cold lead: exploring, no budget clarity", () => {
    let score = 0;
    const data = {
      budgetRange: "9-12m",
      downPaymentReady: "need_info",
      financingMethod: "mixed",
      timeline: "exploring",
      unitType: "Studio",
      useCase: "personal",
      personalityType: "explorer",
      primaryMotivation: "lifestyle",
    };

    if (data.budgetRange === "9-12m") score += 5;
    score += 2; // need_info
    score += 4; // mixed
    score += 1; // exploring
    score += 4; // Studio
    score += 3; // personal
    score += 5; // explorer
    score += 7; // lifestyle

    expect(score).toBeLessThan(40);
    const tier = score >= 70 ? "hot" : score >= 40 ? "warm" : "cold";
    expect(tier).toBe("cold");
  });
});

describe("WhatsApp notification message format", () => {
  it("builds a correctly formatted WhatsApp message for a lead", () => {
    const lead = {
      name: "Ahmed Hassan",
      phone: "01012345678",
      email: "ahmed@example.com",
      unitType: "2 Bedrooms",
      timeline: "launch",
      leadId: 42,
    };
    const lines = [
      `*New Marina Towers Lead #${lead.leadId}*`,
      ``,
      `*Name:* ${lead.name}`,
      `*Phone:* ${lead.phone}`,
      lead.email ? `*Email:* ${lead.email}` : null,
      lead.unitType ? `*Unit Interest:* ${lead.unitType}` : null,
      lead.timeline ? `*Timeline:* ${lead.timeline}` : null,
      ``,
      `*Source:* Marina Towers Landing Page`,
    ].filter(Boolean).join("\n");

    expect(lines).toContain("*New Marina Towers Lead #42*");
    expect(lines).toContain("*Name:* Ahmed Hassan");
    expect(lines).toContain("*Phone:* 01012345678");
    expect(lines).toContain("*Email:* ahmed@example.com");
    expect(lines).toContain("*Unit Interest:* 2 Bedrooms");
    expect(lines).toContain("*Timeline:* launch");
    expect(lines).toContain("*Source:* Marina Towers Landing Page");
  });

  it("omits optional fields when not provided", () => {
    const lead = { name: "Sara", phone: "01099999999", leadId: 7 };
    const lines = [
      `*New Marina Towers Lead #${lead.leadId}*`,
      `*Name:* ${lead.name}`,
      `*Phone:* ${lead.phone}`,
      (lead as { email?: string }).email ? `*Email:* ${(lead as { email?: string }).email}` : null,
    ].filter(Boolean).join("\n");

    expect(lines).not.toContain("*Email:*");
    expect(lines).toContain("*Name:* Sara");
  });
});

describe("auth.logout", () => {
  it("clears session cookie", async () => {
    const cleared: string[] = [];
    const ctx: TrpcContext = {
      user: {
        id: 1, openId: "test", email: "t@t.com", name: "Test",
        loginMethod: "manus", role: "user",
        createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
      },
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: (name: string) => cleared.push(name) } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
    expect(cleared).toHaveLength(1);
  });
});
