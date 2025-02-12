import type { Note } from '$lib/types';
import { API_BASE_URL } from '../../config';

interface FetchNotesParams {
  search?: string;
  website?: string;
}

export async function getNotes(params: FetchNotesParams = {}): Promise<Note[]> {
  const queryParams = new URLSearchParams({
    search: params.search || '',
    website: params.website || ''
  }).toString();

  const response = await fetch(`${API_BASE_URL}/notes?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }
  return response.json();
}

export async function postNote(note: Partial<Note>): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error('Failed to create note');
  }
  return response.json();
}

export async function putNote(id: string, note: Partial<Note>): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error('Failed to update note');
  }
  return response.json();
}

export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete note');
  }
}
