import { json } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import type { RequestEvent, RequestHandler } from "@sveltejs/kit";

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ url, locals }) => {
  try {
    const session = await locals.auth();
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const search = url.searchParams.get("search") || "";
    const website = url.searchParams.get("website") || "";
    const noteId = url.searchParams.get("noteId") || "";

    const notes = await prisma.note.findMany({
      where: { 
        AND: [
          { userEmail: session.user.email },
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

export const POST: RequestHandler = async ({ request, locals }: RequestEvent) => {
  try {
    const session = await locals.auth();
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const noteData = await request.json();

    const note = await prisma.note.create({
      data: {
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags || [],
        website: noteData.website,
        color: noteData.color,
        position: noteData.position,
        userId: session.user.id || session.user.email,
        userEmail: session.user.email,
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

export const PUT: RequestHandler = async ({ request, locals }: RequestEvent) => {
  try {
    const session = await locals.auth();
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const noteData = await request.json();

    // Verify note ownership
    const existingNote = await prisma.note.findUnique({
      where: { id: noteData.id },
    });

    if (!existingNote || existingNote.userEmail !== session.user.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const note = await prisma.note.update({
      where: { id: noteData.id },
      data: {
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags || [],
        website: noteData.website,
        color: noteData.color,
        position: noteData.position,
        userEmail: session.user.email,
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

export const DELETE: RequestHandler = async ({ url, locals }) => {
  try {
    const session = await locals.auth();
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Note ID is required" }), {
        status: 400,
      });
    }

    // Verify note ownership
    const existingNote = await prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote || existingNote.userEmail !== session.user.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await prisma.note.delete({
      where: { id },
    });

    return json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return new Response(JSON.stringify({ error: "Failed to delete note" }), {
      status: 500,
    });
  }
};
