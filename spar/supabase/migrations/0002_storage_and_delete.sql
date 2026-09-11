-- Private bucket for rep recordings. Objects are stored under "<user_id>/...",
-- which is what the policies below key off.
insert into storage.buckets (id, name, public)
values ('rep-audio', 'rep-audio', false)
on conflict (id) do nothing;

create policy rep_audio_select on storage.objects for select
  using (bucket_id = 'rep-audio' and (select auth.uid())::text = (storage.foldername(name))[1]);
create policy rep_audio_insert on storage.objects for insert
  with check (bucket_id = 'rep-audio' and (select auth.uid())::text = (storage.foldername(name))[1]);
create policy rep_audio_delete on storage.objects for delete
  using (bucket_id = 'rep-audio' and (select auth.uid())::text = (storage.foldername(name))[1]);

-- "Delete all my data" in Settings. Deleting the auth user cascades every table
-- above; the audio objects have no FK to cascade through, so they go explicitly
-- and they go first — an orphaned recording is the one failure we cannot undo.
create function public.delete_all_my_data() returns void
  language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  delete from storage.objects
   where bucket_id = 'rep-audio' and (storage.foldername(name))[1] = uid::text;

  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_all_my_data() from public, anon;
grant execute on function public.delete_all_my_data() to authenticated;
