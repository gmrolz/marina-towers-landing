import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createLead, getAllLeads } from "./db";
import { notifyOwner } from "./_core/notification";

// ─── Evolution API WhatsApp Notification ─────────────────────────────────────
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || "";
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || "";
const EVOLUTION_INSTANCE = "lead-bot";
const NOTIFY_NUMBER = "201080488822"; // Client's WhatsApp number

async function sendWhatsAppNotification(lead: {
  name: string;
  phone: string;
  email?: string;
  unitType?: string;
  timeline?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  leadId: number;
}) {
  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) return;
  const message = [
    `*New Marina Towers Lead #${lead.leadId}*`,
    ``,
    `*Name:* ${lead.name}`,
    `*Phone:* ${lead.phone}`,
    lead.email ? `*Email:* ${lead.email}` : null,
    lead.unitType ? `*Unit Interest:* ${lead.unitType}` : null,
    lead.timeline ? `*Timeline:* ${lead.timeline}` : null,
    ``,
    `*Source:* Marina Towers Landing Page`,
    lead.utmSource ? `*Ad Source:* ${lead.utmSource}` : null,
    lead.utmMedium ? `*Ad Medium:* ${lead.utmMedium}` : null,
    lead.utmCampaign ? `*Campaign:* ${lead.utmCampaign}` : null,
    `*Time:* ${new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" })}`,
  ].filter(Boolean).join("\n");

  try {
    const res = await fetch(
      `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          number: NOTIFY_NUMBER,
          text: message,
        }),
      }
    );
    if (!res.ok) {
      const err = await res.text();
      console.warn("[WhatsApp] Failed to send notification:", err);
    } else {
      console.log("[WhatsApp] Lead notification sent successfully");
    }
  } catch (e) {
    console.warn("[WhatsApp] Error sending notification:", e);
  }
}

const leadInputSchema = z.object({
  // Contact
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email().optional().or(z.literal("")),

  // Desire
  personalityType: z.string().optional(),
  primaryMotivation: z.string().optional(),
  dreamLifestyle: z.string().optional(),

  // Need
  useCase: z.string().optional(),
  timeline: z.string().optional(),
  unitType: z.string().optional(),

  // Ability
  budgetRange: z.string().optional(),
  downPaymentReady: z.string().optional(),
  financingMethod: z.string().optional(),

  // Attribution
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  leads: router({
    submit: publicProcedure
      .input(leadInputSchema)
      .mutation(async ({ input }) => {
        const leadId = await createLead({
          name: input.name,
          phone: input.phone,
          email: input.email || undefined,
          personalityType: input.personalityType || undefined,
          primaryMotivation: input.primaryMotivation || undefined,
          dreamLifestyle: input.dreamLifestyle || undefined,
          useCase: input.useCase || undefined,
          timeline: input.timeline || undefined,
          unitType: input.unitType || undefined,
          budgetRange: input.budgetRange || undefined,
          downPaymentReady: input.downPaymentReady || undefined,
          financingMethod: input.financingMethod || undefined,
          utmSource: input.utmSource || undefined,
          utmMedium: input.utmMedium || undefined,
          utmCampaign: input.utmCampaign || undefined,
          agreeToContact: 1,
        });

        // Send WhatsApp notification to client
        try {
          await sendWhatsAppNotification({
            name: input.name,
            phone: input.phone,
            email: input.email || undefined,
            unitType: input.unitType || undefined,
            timeline: input.timeline || undefined,
            utmSource: input.utmSource || undefined,
            utmMedium: input.utmMedium || undefined,
            utmCampaign: input.utmCampaign || undefined,
            leadId,
          });
        } catch (e) {
          console.warn("[WhatsApp] Notification error:", e);
        }

        // Notify owner of new lead
        try {
          await notifyOwner({
            title: `🏆 New Marina Towers Lead: ${input.name}`,
            content: `
**New EOI Registration**

**Contact:** ${input.name} | ${input.phone} | ${input.email || "No email"}

**Personality:** ${input.personalityType || "—"} | Motivation: ${input.primaryMotivation || "—"}
**Use Case:** ${input.useCase || "—"} | Timeline: ${input.timeline || "—"}
**Budget:** ${input.budgetRange || "—"} | EOI Ready: ${input.downPaymentReady || "—"}
**Unit Type:** ${input.unitType || "—"} | Financing: ${input.financingMethod || "—"}

Lead ID: #${leadId}
            `.trim(),
          });
        } catch (e) {
          console.warn("Failed to notify owner:", e);
        }

        return { success: true, leadId };
      }),

    list: publicProcedure.query(async () => {
      return getAllLeads();
    }),
  }),
});

export type AppRouter = typeof appRouter;
