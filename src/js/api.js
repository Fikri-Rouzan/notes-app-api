const BASE_URL = "https://notes-api.dicoding.dev/v2";

async function fetchNotes() {
  const response = await fetch(`${BASE_URL}/notes`);
  if (!response.ok) throw new Error("Failed to fetch notes");
  const result = await response.json();
  return result.data;
}

async function fetchArchivedNotes() {
  const response = await fetch(`${BASE_URL}/notes/archived`);
  if (!response.ok) throw new Error("Failed to fetch archived notes");
  const result = await response.json();
  return result.data;
}

async function createNote({ title, body }) {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

async function deleteNote(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: "DELETE",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

async function getNoteDetail(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

async function archiveNote(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}/archive`, {
    method: "POST",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

async function unarchiveNote(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}/unarchive`, {
    method: "POST",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

export {
  fetchNotes,
  fetchArchivedNotes,
  createNote,
  deleteNote,
  getNoteDetail,
  archiveNote,
  unarchiveNote,
};
