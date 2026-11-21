ALTER TABLE public.account_preferences ADD COLUMN auto_analyze_meals boolean NOT NULL DEFAULT false;
ALTER TABLE public.account_preferences ADD COLUMN meal_consent_asked boolean NOT NULL DEFAULT false;
CREATE TABLE public.meals (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 conversation_id uuid NOT NULL REFERENCES public.workspace_records(id),
 request_id uuid NOT NULL UNIQUE,
 photo_path text NOT NULL,
 food_items jsonb NOT NULL,
 calories numeric NOT NULL,
 protein numeric NOT NULL,
 carbs numeric NOT NULL,
 fats numeric NOT NULL,
 uncertainty text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.meals TO authenticated;
GRANT ALL ON public.meals TO service_role;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY meals_owner_read ON public.meals FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY meals_owner_delete ON public.meals FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE FUNCTION public.complete_meal_analysis(p_user_id uuid,p_conversation_id uuid,p_request_id uuid,p_photo_path text,p_analysis jsonb,p_content text,p_run_id uuid) RETURNS uuid LANGUAGE plpgsql SET search_path = public AS $$
DECLARE meal_id uuid;
BEGIN
 IF NOT EXISTS (SELECT 1 FROM public.workspace_records WHERE id=p_conversation_id AND owner_id=p_user_id AND entity='Conversation') THEN RAISE EXCEPTION 'Conversation unavailable'; END IF;
 INSERT INTO public.meals(user_id,conversation_id,request_id,photo_path,food_items,calories,protein,carbs,fats,uncertainty) VALUES(p_user_id,p_conversation_id,p_request_id,p_photo_path,p_analysis->'food_items',(p_analysis->>'calories')::numeric,(p_analysis->>'protein')::numeric,(p_analysis->>'carbs')::numeric,(p_analysis->>'fats')::numeric,p_analysis->>'uncertainty') RETURNING id INTO meal_id;
 INSERT INTO public.workspace_records(entity,owner_id,data) VALUES('Message',p_user_id,jsonb_build_object('conversation_id',p_conversation_id,'role','agent','kind','meal','content',p_content,'meal_id',meal_id,'analysis',p_analysis,'status','none'));
 UPDATE public.execution_runs SET status='completed',result=p_content WHERE id=p_run_id AND owner_id=p_user_id;
 RETURN meal_id;
END;
$$;
REVOKE ALL ON FUNCTION public.complete_meal_analysis(uuid,uuid,uuid,text,jsonb,text,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.complete_meal_analysis(uuid,uuid,uuid,text,jsonb,text,uuid) TO service_role;