import {createFileRoute} from "@tanstack/react-router";
import {authenticateCronRequest} from "@/integrations/supabase/cron-auth";
import {z} from "zod";
import {nextRoutineTime} from "@/lib/workspace/schedule";
export const Route=createFileRoute('/api/public/jobs/routines')({server:{handlers:{POST:async({request})=>{
 const failure=await authenticateCronRequest(request);if(failure)return failure;
 const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
 const {generateResponse,GatewayError}=await import("@lovable.dev/ai-gateway");
 const rows=await supabaseAdmin.from("workspace_records").select("*").eq("entity","Routine").eq("data->>enabled","true").limit(100);
 if(rows.error)return Response.json({error:"Could not load routines"},{status:500});
 let completed=0;
 for(const row of rows.data){
  const parsed=z.object({name:z.string(),description:z.string().default(""),schedule:z.string(),trigger_type:z.string().default("time"),next_run_at:z.string().optional(),agent_id:z.string().optional()}).passthrough().safeParse(row.data);
  if(!parsed.success||parsed.data.trigger_type!=="time")continue;
  const details=parsed.data;let next:string;try{next=nextRoutineTime(details.schedule)}catch{continue;}
  if(!details.next_run_at){await supabaseAdmin.from("workspace_records").update({data:{...details,next_run_at:next}}).eq("id",row.id);continue;}
  if(new Date(details.next_run_at)>new Date())continue;
  const run=await supabaseAdmin.from("execution_runs").insert({owner_id:row.owner_id,record_id:row.id,request_id:crypto.randomUUID()}).select("id").single();if(run.error)continue;
  const claimed=await supabaseAdmin.from("workspace_records").update({data:{...details,next_run_at:next}}).eq("id",row.id).eq("data->>next_run_at",details.next_run_at).select("id").maybeSingle();if(!claimed.data)continue;
  try{
   const memory=await supabaseAdmin.from("workspace_records").select("data").eq("owner_id",row.owner_id).eq("entity","MemoryNote").limit(30);
   const result=await generateResponse({model:"openai/gpt-6.1-sol",input:details.description||details.name,instructions:`Complete this scheduled assistant task. You cannot send emails, spend money, or perform external actions. Never claim those happened. Context: ${JSON.stringify(memory.data)}`});
   const text=result.output.flatMap(item=>item.type==="message"?item.content.flatMap(part=>part.type==="output_text"?[part.text]:[]):[]).join("\n");if(!text)throw new Error("Empty result");
   const thread=await supabaseAdmin.from("workspace_records").insert({owner_id:row.owner_id,entity:"Conversation",data:{title:details.name,preview:text.slice(0,120),mode:"direct",agent_ids:details.agent_id?[details.agent_id]:[]}}).select("id").single();if(thread.error)throw thread.error;
   const message=await supabaseAdmin.from("workspace_records").insert({owner_id:row.owner_id,entity:"Message",data:{conversation_id:thread.data.id,role:"agent",kind:"proactive",content:text,status:"none"}});if(message.error)throw message.error;
   await supabaseAdmin.from("execution_runs").update({status:"completed",result:text}).eq("id",run.data.id);completed++;
  }catch(error){await supabaseAdmin.from("execution_runs").update({status:"unknown"}).eq("id",run.data.id);if(error instanceof GatewayError){await supabaseAdmin.from("workspace_records").update({data:{...details,next_run_at:next,enabled:false}}).eq("id",row.id);break;}}
 }
 return Response.json({completed});
}}}});