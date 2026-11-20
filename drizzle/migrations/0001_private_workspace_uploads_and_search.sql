CREATE POLICY own_workspace_upload ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='workspace-files' AND (storage.foldername(name))[1]=auth.uid()::text);
CREATE POLICY own_workspace_file_read ON storage.objects FOR SELECT TO authenticated USING(bucket_id='workspace-files' AND (storage.foldername(name))[1]=auth.uid()::text);
CREATE POLICY own_workspace_file_delete ON storage.objects FOR DELETE TO authenticated USING(bucket_id='workspace-files' AND (storage.foldername(name))[1]=auth.uid()::text);
CREATE FUNCTION public.search_workspace(search_term text) RETURNS SETOF public.workspace_records LANGUAGE sql STABLE SECURITY INVOKER SET search_path=public AS $$ SELECT * FROM public.workspace_records WHERE data::text ILIKE '%' || replace(replace(search_term,'%',''),'_','') || '%' ORDER BY updated_at DESC LIMIT 100 $$;
REVOKE ALL ON FUNCTION public.search_workspace(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_workspace(text) TO authenticated;