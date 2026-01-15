import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { auth } from "./auth";
import { getAuthUserId } from "@convex-dev/auth/server";
import { streamText, gateway, convertToModelMessages, tool, stepCountIs } from "ai";
import { internal } from "./_generated/api";
import { z } from "zod/v4";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
    path: "/api/chat",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Vary": "origin",
        };

        try {
            const userId = await getAuthUserId(ctx);
            if (!userId) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders,
                    },
                });
            }

            const body = await req.json();
            const messages = body.messages || [];

            // Convert messages to model format (this is async in AI SDK v6)
            const modelMessages = await convertToModelMessages(messages);

            const result = streamText({
                model: gateway("google/gemini-2.5-flash-lite"),
                system: `You are a helpful assistant that searches through and answers questions about the user's notes.

IMPORTANT: When the user asks about their notes, what they've written, or any information that could be in their notes, you MUST use the findRelevantNotes tool to search their notes first. Only respond based on actual note content.

If no relevant notes are found, tell the user you couldn't find that information in their notes.

You can use markdown formatting. Provide links to relevant notes using: '/notes?noteId=<note-id>'
Keep responses concise.`,
                messages: modelMessages,
                tools: {
                    findRelevantNotes: tool({
                        description: "Search the user's notes database to find relevant notes for answering their question. Use this whenever the user asks about their notes or any information that might be stored in their notes.",
                        inputSchema: z.object({
                            query: z.string().describe("The search query to find relevant notes"),
                        }),
                        execute: async ({ query }) => {
                            const relevantNotes = await ctx.runAction(
                                internal.notesActions.findRelevantNotes,
                                {
                                    query,
                                    userId: userId as Id<"users">,
                                }
                            )
                            return relevantNotes.map(note => ({
                                id: note._id as string,
                                title: note.title,
                                body: note.body,
                                creationTime: note._creationTime
                            }))
                        }
                    })
                },
                stopWhen: stepCountIs(3),
                onError(error) {
                    console.error("streamText error", error);
                },
            });

            return result.toTextStreamResponse({
                headers: corsHeaders,
            });
        } catch (error) {
            console.error("Chat API error:", error);
            return new Response(JSON.stringify({ error: "Internal server error" }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            });
        }
    }),
});

http.route({
    path: "/api/chat",
    method: "OPTIONS",
    handler: httpAction(async (_, request) => {
        const headers = request.headers;
        if (
            headers.get("Origin") !== null &&
            headers.get("Access-Control-Request-Method") !== null &&
            headers.get("Access-Control-Request-Headers") !== null
        ) {
            return new Response(null, {
                headers: new Headers({
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST",
                    "Access-Control-Allow-Headers": "Content-Type, Digest, Authorization",
                    "Access-Control-Max-Age": "86400",
                }),
            });
        } else {
            return new Response();
        }
    }),
});

export default http;
