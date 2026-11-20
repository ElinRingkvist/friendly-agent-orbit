import {CronExpressionParser} from "cron-parser";
export function nextRoutineTime(schedule:string,after:Date=new Date()):string {
 const normalized=schedule.trim().toLowerCase();
 const clock=/(?:daily|every day)\s+(?:at\s+)?(\d{1,2}):(\d{2})/.exec(normalized);
 const expression=clock?`${Number(clock[2])} ${Number(clock[1])} * * *`:normalized==="hourly"||normalized==="every hour"?"0 * * * *":normalized==="daily"?"0 9 * * *":schedule;
 return CronExpressionParser.parse(expression,{currentDate:after,tz:"UTC"}).next().toISOString()??"";
}