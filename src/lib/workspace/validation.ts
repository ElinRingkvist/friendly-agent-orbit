import { z } from "zod";
import { definition, entities, type Entity } from "./entities";

export const entitySchema = z.custom<Entity>((value) => typeof value === "string" && entities.includes(value as Entity));
export function validateRecord(entity: Entity, input: unknown): Record<string, string | number | boolean | string[]> {
  const def = definition(entity);
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const [key, field] of Object.entries(def.properties)) {
    let schema: z.ZodTypeAny = field.type === "number" ? z.number().finite().min(0) : field.type === "boolean" ? z.boolean() : field.type === "array" ? z.array(z.string().max(2000)).max(100) : z.string().trim().max(key === "content" ? 30000 : 4000);
    if (field.enum) schema = z.string().refine((value) => field.enum?.includes(value), "Invalid choice");
    if (key === "email") schema = z.string().trim().email().max(255);
    if (def.required.includes(key) && field.type === "string") schema = schema.refine((value) => typeof value === "string" && value.length > 0, "Required");
    else if (field.default !== undefined) schema = schema.default(field.default);
    else schema = schema.optional();
    shape[key] = schema;
  }
  return z.object(shape).strict().parse(input);
}
export const recordMutation = z.object({entity:entitySchema,id:z.string().uuid().optional(), data:z.unknown()});
export const chatInput = z.object({conversationId:z.string().uuid().optional(),agentIds:z.array(z.string().uuid()).max(8).default([]), content:z.string().trim().min(1).max(30000), requestId:z.string().uuid(), attachment:z.object({path:z.string().min(1).max(500),name:z.string().max(200),type:z.string().max(100)}).optional(),meal:z.boolean().default(false),search:z.boolean().default(false)});
export function safeAttachmentPath(path:string,userId:string) { return path.startsWith(`${userId}/`) && !path.includes("..") && !path.includes("\\"); }
export function approvalState(status:string) { return status === "approved" || status === "declined" || status === "changes"; }
export function allowedSyncEndpoint(endpoint:string,allowed:string[]) {
  try { const url=new URL(endpoint); return url.protocol === "https:" && !url.username && !url.password && allowed.includes(url.origin) && !["localhost","127.0.0.1","[::1]"].includes(url.hostname); } catch { return false; }
}