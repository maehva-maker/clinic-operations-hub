// lib/supabase/storage.ts
// Thin helpers over the four private Storage buckets created in
// supabase/migrations/20260926040000_storage_buckets.sql (fax-confirmations,
// attachments, pdfs, screenshots). Every bucket is private, so nothing here
// ever returns a public URL — only short-lived signed URLs, generated on
// demand when a file is actually opened. Objects are stored under
// `<user_id>/<filename>` because the Storage RLS policies key access off
// that first path segment.

import { createClient } from "@/lib/supabase/client";

export type StorageBucket = "fax-confirmations" | "attachments" | "pdfs" | "screenshots";

/** Uploads a file into the given bucket under the signed-in user's own folder, returning its storage path. */
export async function uploadFile(bucket: StorageBucket, file: File): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to upload a file.");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(`Couldn't upload file: ${error.message}`);

  return path;
}

/** A short-lived signed URL (10 minutes) for viewing/downloading a stored object. */
export async function getSignedUrl(bucket: StorageBucket, path: string, expiresInSeconds = 600): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  if (error) throw new Error(`Couldn't create a link for this file: ${error.message}`);
  return data.signedUrl;
}
