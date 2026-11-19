import {createFileRoute} from '@tanstack/react-router';
import {Collection} from '@/components/workspace/collection';
import {entities,entityPaths,type Entity} from '@/lib/workspace/entities';
import {pageHead} from '@/lib/workspace/meta';
export const Route=createFileRoute('/$collection')({head:({params})=>pageHead(`${params.collection.replaceAll('-',' ')} — Private workspace`,`Manage your private ${params.collection.replaceAll('-',' ')} records.`),component:Page});
const titles:Record<Entity,string>={Agent:'Agents',ApprovalRule:'Approvals',BioLearning:'Learnings',Conversation:'Conversations',EngineKey:'Engine keys',MealLog:'Meals',MemoryNote:'Memory',Message:'Messages',RehabProtocol:'Rehab',Routine:'Routines',SyncJob:'Syncs',AgentAction:'Activity',WaitlistSignup:'Waitlist'};
function Page(){const {collection}=Route.useParams();const entity=entities.find(item=>entityPaths[item]===collection);return entity?<Collection entity={entity} title={titles[entity]}/>:<div className="p-10">Page not found</div>}
