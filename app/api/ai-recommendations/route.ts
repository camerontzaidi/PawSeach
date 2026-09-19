import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

const requestSchema = z.object({
  dogName: z.string().trim().min(1).max(100),
  breed: z.string().trim().max(100).optional().default(""),
  size: z.string().trim().max(30).optional().default(""),
  city: z.string().trim().max(100).optional().default(""),
  zipCode: z.string().trim().max(10).optional().default(""),
  locationDescription: z.string().trim().max(300).optional().default(""),
  circumstances: z.string().trim().max(1500).optional().default(""),
});

const responseSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string().trim().min(1).max(160),
      explanation: z.string().trim().min(1).max(1000),
      priority: z.enum(["high", "medium", "low"]),
    }),
  ).min(1).max(6),
  strategy: z.array(z.string().trim().min(1).max(600)).min(1).max(8),
});

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function normalizePriority(value: unknown): "high" | "medium" | "low" {
  if (typeof value !== "string") {
    return "medium";
  }

  const normalized = value.trim().toLowerCase();

  if (normalized.includes("high")) return "high";
  if (normalized.includes("low")) return "low";
  return "medium";
}

function getString(
  record: Record<string, unknown>,
  keys: string[],
): string {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
}

function normalizeGeneratedResponse(value: unknown): unknown {
  const root = asRecord(value);

  if (!root) {
    return value;
  }

  const rawRecommendations =
    root.recommendations ??
    root.recommended_areas ??
    root.recommendedAreas ??
    root.areas ??
    root.locations;

  const rawStrategy =
    root.strategy ??
    root.search_strategy ??
    root.searchStrategy ??
    root.steps ??
    root.search_steps;

  const recommendations = Array.isArray(rawRecommendations)
    ? rawRecommendations
        .map((item) => {
          if (typeof item === "string") {
            return {
              title: item.trim(),
              explanation:
                "This area may be worth checking based on the information in the report.",
              priority: "medium" as const,
            };
          }

          const record = asRecord(item);

          if (!record) {
            return null;
          }

          const title = getString(record, [
            "title",
            "name",
            "area",
            "location",
            "category",
          ]);

          const explanation = getString(record, [
            "explanation",
            "reason",
            "description",
            "details",
            "why",
          ]);

          if (!title || !explanation) {
            return null;
          }

          return {
            title,
            explanation,
            priority: normalizePriority(record.priority),
          };
        })
        .filter(
          (
            item,
          ): item is {
            title: string;
            explanation: string;
            priority: "high" | "medium" | "low";
          } => item !== null,
        )
        .slice(0, 4)
    : [];

  const strategy = Array.isArray(rawStrategy)
    ? rawStrategy
        .map((item) => {
          if (typeof item === "string") {
            return item.trim();
          }

          const record = asRecord(item);

          if (!record) {
            return "";
          }

          return getString(record, [
            "step",
            "action",
            "text",
            "description",
            "instruction",
          ]);
        })
        .filter((item) => item.length > 0)
        .slice(0, 5)
    : [];

  return {
    recommendations,
    strategy,
  };
}

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured." },
      { status: 500 },
    );
  }

  // Protect the endpoint so anonymous visitors cannot consume the AI quota.
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "You must be signed in to request AI recommendations." },
      { status: 401 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid report information." },
      { status: 400 },
    );
  }

  const report = parsed.data;

  const prompt = `
Create practical search guidance for a missing dog using ONLY the report below.

REPORT
Dog name: ${report.dogName}
Breed: ${report.breed || "unknown"}
Size: ${report.size || "unknown"}
City: ${report.city || "unknown"}
ZIP code: ${report.zipCode || "unknown"}
Last known location: ${report.locationDescription || "not provided"}
Circumstances: ${report.circumstances || "not provided"}

Return JSON with exactly these top-level keys:
{
  "recommendations": [
    {
      "title": "short area/category title",
      "explanation": "1-3 concise sentences explaining why this area is worth checking for this specific report",
      "priority": "high | medium | low"
    }
  ],
  "strategy": [
    "concise step 1",
    "concise step 2",
    "concise step 3"
  ]
}

Requirements:
- Give 3 or 4 recommendations.
- Give 3 to 5 ordered search-strategy steps.
- Personalize the guidance to the supplied dog and circumstances when useful.
- Treat all recommendations as possibilities, never as known facts about where the dog is.
- Do not invent sightings, addresses, businesses, parks, trails, or other specific places not supplied in the report.
- Do not tell the user to trespass, enter unsafe locations, chase a frightened dog, or take other dangerous actions.
- Favor practical, nearby search actions.
- Do not include markdown. Return JSON only.
`.trim();

  let openRouterResponse: Response;

  try {
    openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Title": "PawSearch",
        },
        body: JSON.stringify({
          /*
           * Primary model: current free DeepSeek endpoint with
           * structured-output support.
           *
           * If that model/provider errors, OpenRouter automatically
           * tries the free router as a fallback within this same API call.
           */
          models: [
            "deepseek/deepseek-v4-flash-0731:free",
            "openrouter/free",
          ],
          messages: [
            {
              role: "system",
              content:
                "You provide cautious, practical missing-dog search guidance. Return only the requested JSON structure. Never claim to know where an animal actually is.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "pawsearch_recommendations",
              strict: true,
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  recommendations: {
                    type: "array",
                    minItems: 3,
                    maxItems: 4,
                    items: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        title: {
                          type: "string",
                        },
                        explanation: {
                          type: "string",
                        },
                        priority: {
                          type: "string",
                          enum: ["high", "medium", "low"],
                        },
                      },
                      required: [
                        "title",
                        "explanation",
                        "priority",
                      ],
                    },
                  },
                  strategy: {
                    type: "array",
                    minItems: 3,
                    maxItems: 5,
                    items: {
                      type: "string",
                    },
                  },
                },
                required: [
                  "recommendations",
                  "strategy",
                ],
              },
            },
          },
          /*
           * Free OpenRouter plugin that repairs malformed JSON before
           * it reaches PawSearch.
           */
          plugins: [
            {
              id: "response-healing",
            },
          ],
          provider: {
            require_parameters: true,
            allow_fallbacks: true,
          },
          temperature: 0.4,
          max_tokens: 900,
        }),
        cache: "no-store",
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Could not reach the AI service." },
      { status: 502 },
    );
  }

  let data: OpenRouterResponse;

  try {
    data = (await openRouterResponse.json()) as OpenRouterResponse;
  } catch {
    return NextResponse.json(
      {
        error:
          "OpenRouter returned an unreadable response. Please try again later.",
      },
      { status: 502 },
    );
  }

  if (!openRouterResponse.ok) {
    return NextResponse.json(
      {
        error:
          data.error?.message ??
          "OpenRouter could not generate recommendations.",
      },
      { status: openRouterResponse.status },
    );
  }

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    return NextResponse.json(
      { error: "The AI service returned an empty response." },
      { status: 502 },
    );
  }

  let generated: unknown;

  /*
   * Structured-output capable models should return clean JSON.
   * Free-router models can still occasionally wrap JSON in Markdown
   * fences or surrounding text, so clean those common cases before
   * treating the response as invalid.
   */
  try {
    const cleanedContent = content
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    generated = JSON.parse(cleanedContent);
  } catch {
    const firstBrace = content.indexOf("{");
    const lastBrace = content.lastIndexOf("}");

    if (
      firstBrace === -1 ||
      lastBrace === -1 ||
      lastBrace <= firstBrace
    ) {
      return NextResponse.json(
        {
          error:
            "The AI response could not be read as structured recommendations.",
        },
        { status: 502 },
      );
    }

    try {
      generated = JSON.parse(
        content.slice(
          firstBrace,
          lastBrace + 1,
        ),
      );
    } catch {
      return NextResponse.json(
        {
          error:
            "The AI response could not be read as structured recommendations.",
        },
        { status: 502 },
      );
    }
  }

  const normalized = normalizeGeneratedResponse(generated);
  const validated = responseSchema.safeParse(normalized);

  if (!validated.success) {
    console.error(
      "Unexpected OpenRouter response shape:",
      JSON.stringify(generated),
    );

    return NextResponse.json(
      {
        error:
          "The AI returned recommendations in a format PawSearch could not read.",
      },
      { status: 502 },
    );
  }

  /*
   * The prompt asks for 3-4 recommendations and 3-5 strategy steps.
   * If a free model returns fewer but otherwise valid items, keep the
   * useful content instead of failing the whole feature.
   */
  return NextResponse.json({
    recommendations: validated.data.recommendations,
    strategy: validated.data.strategy,
  });
}
