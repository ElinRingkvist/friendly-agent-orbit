import {createServerFn} from "@tanstack/react-start";
import {z} from "zod";
import {requireSupabaseAuth} from "@/integrations/supabase/auth-middleware";
import {allowedSyncEndpoint,validateRecord} from "./validation";
export const runSync=createServerFn({method:"POST"}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.string().uuid(),requestId:z.string().uuid()})).handler(async({data,context})=>{
 const row=await context.supabase.from("workspace_records").select("*").eq("id",data.id).eq("entity","SyncJob").eq("owner_id",context.userId).single();
 if(row.error)throw new Error("Sync unavailable.");
 const details=z.object({endpoint:z.string().url(),direction:z.enum(["pull","push","two-way"]),enabled:z.boolean().default(true)}).passthrough().parse(row.data.data);
 if(!details.enabled)throw new Error("This sync is paused.");
 const allowed=(process.env["SYNC_ALLOWED_ORIGINS"]??"").split(",").map(x=>x.trim()).filter(Boolean);
 if(!allowedSyncEndpoint(details.endpoint,allowed))throw new Error("This destination is not connected yet. The app owner must authorize its HTTPS address before syncing private data.");
 const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
 const run=await supabaseAdmin.from("execution_runs").insert({owner_id:context.userId,record_id:row.data.id,request_id:data.requestId}).select("id").single();
 if(run.error)throw new Error("This sync request has already been started.");
 try{
  const own=await context.supabase.from("workspace_records").select("id,data").eq("entity","MemoryNote").eq("owner_id",context.userId).limit(100);
  if(own.error)throw new Error(own.error.message);
  const response=await fetch(details.endpoint,{method:"POST",redirect:"error",headers:{"Content-Type":"application/json","Idempotency-Key":data.requestId,...(process.env["SYNC_BEARER_TOKEN"]?{Authorization:`Bearer ${process.env["SYNC_BEARER_TOKEN"]}`}:{})},body:JSON.stringify({direction:details.direction,notes:details.direction==="pull"?[]:own.data})});
  if(!response.ok)throw new Error(`Sync destination returned ${response.status}.`);
  if(details.direction!=="push"){
   const imported=z.object({notes:z.array(z.unknown()).max(100)}).parse(await response.json());
   const records=imported.notes.map(note=>({entity:"MemoryNote",owner_id:context.userId,data:validateRecord("MemoryNote",note)}));
   if(records.length){const saved=await context.supabase.from("workspace_records").insert(records);if(saved.error)throw new Error(saved.error.message)}
  }
  const payload=z.record(z.unknown()).parse(row.data.data);
  const updated=await context.supabase.from("workspace_records").update({data:validateRecord("SyncJob",{...payload,last_run:new Date().toISOString()})}).eq("id",row.data.id);
  if(updated.error)throw new Error(updated.error.message);
  await supabaseAdmin.from("execution_runs").update({status:"completed",result:"Sync completed"}).eq("id",run.data.id);
  return {success:true};
 }catch(error){await supabaseAdmin.from("execution_runs").update({status:"unknown"}).eq("id",run.data.id);throw error;}
});