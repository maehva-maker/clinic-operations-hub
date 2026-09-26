-- 20260926040000_storage_buckets.sql
-- Phase 10: Storage. Four private buckets for the file types the PRD's
-- "File Attachment" functional requirement names (fax confirmations,
-- general attachments, PDFs, screenshots). All are private — the app reads
-- files through short-lived signed URLs (lib/supabase/storage.ts), never a
-- public bucket URL, since these can contain patient-identifying file names.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('fax-confirmations', 'fax-confirmations', false, 10485760, array['application/pdf', 'image/png', 'image/jpeg']),
  ('attachments', 'attachments', false, 10485760, null),
  ('pdfs', 'pdfs', false, 10485760, array['application/pdf']),
  ('screenshots', 'screenshots', false, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

-- Every object path is written as "<bucket>/<user_id>/<file>" by
-- lib/supabase/storage.ts, so a folder-based policy keyed on the first path
-- segment matching auth.uid() is enough to keep each HVA's uploads private
-- to their own account (and ready for a second account later).

create policy "fax_confirmations_owner_all" on storage.objects
  for all to authenticated
  using (bucket_id = 'fax-confirmations' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'fax-confirmations' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "attachments_owner_all" on storage.objects
  for all to authenticated
  using (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'attachments' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "pdfs_owner_all" on storage.objects
  for all to authenticated
  using (bucket_id = 'pdfs' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'pdfs' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "screenshots_owner_all" on storage.objects
  for all to authenticated
  using (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);
