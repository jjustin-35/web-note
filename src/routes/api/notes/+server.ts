import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import type { RequestEvent } from "@sveltejs/kit";

const prisma = new PrismaClient();

export const GET = async ({ url }: RequestEvent) => {
  try {
    const search = url.searchParams.get("search") || "";
    const website = url.searchParams.get("website") || "";

    const notes = await prisma.note.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
              { tags: { hasSome: search ? [search] : [] } }
            ]
          },
          website ? { website: { contains: website, mode: 'insensitive' } } : {}
        ]
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch notes" }), {
      status: 500,
    });
  }
};
