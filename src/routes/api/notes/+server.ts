import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import type { RequestEvent, RequestHandler } from "@sveltejs/kit";

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ url }) => {
  try {
    const search = url.searchParams.get("search") || "";
    const website = url.searchParams.get("website") || "";
    const noteId = url.searchParams.get("noteId") || "";

    const notes = await prisma.note.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
              { tags: { hasSome: search ? [search] : [] } },
              ...(noteId ? [{ id: { equals: noteId } }] : []),
            ],
          },
          website
            ? { website: { contains: website, mode: "insensitive" } }
            : {},
        ],
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

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
  try {
    const noteData = await request.json();

    const note = await prisma.note.create({
      data: {
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags || [],
        website: noteData.website,
        color: noteData.color,
        position: noteData.position,
      },
    });

    return json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    return new Response(JSON.stringify({ error: "Failed to create note" }), {
      status: 500,
    });
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  try {
    const noteData = await request.json();
    const noteId = noteData.id;

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags || [],
        website: noteData.website,
        color: noteData.color,
        position: noteData.position,
      },
    });

    return json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    return new Response(JSON.stringify({ error: "Failed to update note" }), {
      status: 500,
    });
  }
};

export const DELETE: RequestHandler = async ({ url }) => {
  try {
    const noteId = url.searchParams.get("noteId");
    if (!noteId) {
      return new Response(JSON.stringify({ error: "Missing noteId" }), {
        status: 400,
      });
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting note:", error);
    return new Response(JSON.stringify({ error: "Failed to delete note" }), {
      status: 500,
    });
  }
};
