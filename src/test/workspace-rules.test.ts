import {describe,it,expect} from "vitest";
import {approvalState,safeAttachmentPath,validateRecord,chatInput,allowedSyncEndpoint} from "@/lib/workspace/validation";
import {nextRoutineTime} from "@/lib/workspace/schedule";
describe("Workspace rules",()=>{
 it("calculates daily routine timing in UTC",()=>{expect(nextRoutineTime("Daily at 09:00",new Date("2026-11-20T08:00:00Z"))).toBe("2026-11-20T09:00:00.000Z");expect(()=>nextRoutineTime("invalid")).toThrow()});
 it("never sends private sync data to unapproved or insecure endpoints",()=>{expect(allowedSyncEndpoint("https://connected.example/hook",["https://connected.example"])).toBe(true);expect(allowedSyncEndpoint("https://other.example/hook",["https://connected.example"])).toBe(false);expect(allowedSyncEndpoint("http://connected.example/hook",["http://connected.example"])).toBe(false);expect(allowedSyncEndpoint("https://localhost/hook",["https://localhost"])).toBe(false)});
 it("keeps supplied agent required fields",()=>{expect(()=>validateRecord("Agent",{name:"A"})).toThrow();expect(validateRecord("Agent",{name:"A",role_title:"Researcher"})["role_title"]).toBe("Researcher")});
 it("keeps optional marketing consent out of agent data",()=>{expect(()=>validateRecord("Agent",{name:"A",role_title:"Researcher",marketing_consent:true})).toThrow()});
 it("only allows explicit approval decisions",()=>{expect(approvalState("approved")).toBe(true);expect(approvalState("declined")).toBe(true);expect(approvalState("changes")).toBe(true);expect(approvalState("pending")).toBe(false)});
 it("does not allow another user's upload folder",()=>{expect(safeAttachmentPath("owner/file.txt","owner")).toBe(true);expect(safeAttachmentPath("other/file.txt","owner")).toBe(false);expect(safeAttachmentPath("owner/../other/file","owner")).toBe(false)});
 it("keeps the supplied three-session rehab default",()=>{expect(validateRecord("RehabProtocol",{name:"Knee"})["weekly_sessions"]).toBe(3)});
 it("keeps group conversations bounded without accepting roles",()=>{expect(()=>chatInput.parse({content:"hello",requestId:"00000000-0000-4000-8000-000000000000",agentIds:Array(9).fill("00000000-0000-4000-8000-000000000000")})).toThrow()});
});