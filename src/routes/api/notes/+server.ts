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

export const POST = async ({ request }: RequestEvent) => {
  try {
    const noteData = await request.json();
    
    const note = await prisma.note.create({
      data: {
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags || [],
        website: noteData.website,
        color: noteData.color,
        position: noteData.position
      }
    });

    return json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    return new Response(JSON.stringify({ error: "Failed to create note" }), {
      status: 500,
    });
  }
};

export const PUT = async ({ request, params }: RequestEvent) => {
  try {
    const noteId = params.noteId;
    const noteData = await request.json();
    
    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags || [],
        website: noteData.website,
        color: noteData.color,
        position: noteData.position
      }
    });

    return json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    return new Response(JSON.stringify({ error: "Failed to update note" }), {
      status: 500,
    });
  }
};

export const DELETE = async ({ params }: RequestEvent) => {
  try {
    const noteId = params.noteId;
    await prisma.note.delete({
      where: { id: noteId }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting note:", error);
    return new Response(JSON.stringify({ error: "Failed to delete note" }), {
      status: 500,
    });
  }
};
