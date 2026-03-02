import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createLead, getAllLeads } from "./db";
import { notifyOwner } from "./_core/notification";

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
          agreeToContact: 1,
        });

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
