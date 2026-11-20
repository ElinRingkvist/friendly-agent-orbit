import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { entitySchema, recordMutation, validateRecord, approvalState } from "./validation";
import {nextRoutineTime} from "./schedule";

export const listRecords = createServerFn({method:"POST"}).middleware([requireSupabaseAuth]).inputValidator(z.object({entity:entitySchema.optional(),conversationId:z.string().uuid().optional(),search:z.string().trim().max(200).optional(),offset:z.number().int().min(0).default(0)})).handler(async({data,context})=>{
  if(data.search){const result=await context.supabase.rpc("search_workspace",{search_term:data.search});if(result.error)throw new Error(result.error.message);return result.data;}
  let query=context.supabase.from("workspace_records").select("*").order("updated_at",{ascending:false}).range(data.offset,data.offset+99);
  if(data.entity) query=query.eq("entity",data.entity);
  if(data.conversationId) query=query.eq("data->>conversation_id",data.conversationId);
  const result=await query;
  if(result.error) throw new Error(result.error.message);
  return result.data;
});

export const saveRecord = createServerFn({method:"POST"}).middleware([requireSupabaseAuth]).inputValidator(recordMutation).handler(async({data,context})=>{
  if(["Message","AgentAction","EngineKey"].includes(data.entity)) throw new Error("This record is controlled by the server.");
  const record=validateRecord(data.entity,data.data);
  if(data.entity === "Routine" && record["trigger_type"] !== "event" && typeof record["schedule"] === "string" && record["schedule"]){record["next_run_at"]=nextRoutineTime(record["schedule"]);}
  for(const key of ["agent_id","conversation_id"]){
    const id=record[key];
    if(typeof id !== "string" || !id) continue;
    const linked=await context.supabase.from("workspace_records").select("id").eq("id",id).eq("entity",key === "agent_id" ? "Agent" : "Conversation").maybeSingle();
    if(linked.error || !linked.data) throw new Error("Linked record is unavailable.");
  }
  const result=data.id ? await context.supabase.from("workspace_records").update({data:record}).eq("id",data.id).eq("entity",data.entity).select().single() : await context.supabase.from("workspace_records").insert({entity:data.entity,owner_id:context.userId,data:record}).select().single();
  if(result.error) throw new Error(result.error.message);
  return result.data;
});

export const deleteRecord = createServerFn({method:"POST"}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.string().uuid()})).handler(async({data,context})=>{
  const record=await context.supabase.from("workspace_records").select("id,entity").eq("id",data.id).single();
  if(record.error) throw new Error("Record unavailable.");
  if(record.data.entity === "Conversation") {
    const messages=await context.supabase.from("workspace_records").delete().eq("entity","Message").eq("data->>conversation_id",data.id);
    if(messages.error) throw new Error(messages.error.message);
  }
  const result=await context.supabase.from("workspace_records").delete().eq("id",data.id).select("id").single();
  if(result.error) throw new Error(result.error.message);
  return {success:true};
});

export const decideApproval = createServerFn({method:"POST"}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.string().uuid(),status:z.string().refine(approvalState)})).handler(async({data,context})=>{
  const row=await context.supabase.from("workspace_records").select("*").eq("id",data.id).eq("entity","Message").eq("owner_id",context.userId).single();
  if(row.error) throw new Error("Approval unavailable.");
  const payload=z.object({kind:z.literal("approval"),status:z.literal("pending")}).passthrough().parse(row.data.data);
  const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
  const result=await supabaseAdmin.from("workspace_records").update({data:{...payload,status:data.status}}).eq("id",data.id).eq("data->>status","pending").select().single();
  if(result.error) throw new Error("Approval has already been decided.");
  return result.data;
});

export const savePreferences = createServerFn({method:"POST"}).middleware([requireSupabaseAuth]).inputValidator(z.object({marketing_consent:z.boolean(),theme:z.enum(["light","dark"])})).handler(async({data,context})=>{
  const result=await context.supabase.from("account_preferences").upsert({...data,user_id:context.userId,updated_at:new Date().toISOString()});
  if(result.error) throw new Error(result.error.message);
  return {success:true};
});