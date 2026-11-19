import {createFileRoute} from '@tanstack/react-router';
import {ChatWorkspace} from '@/components/workspace/chat';
import {pageHead} from '@/lib/workspace/meta';
export const Route=createFileRoute('/chat/$id')({head:()=>pageHead('Conversation — Private agent chat','Continue your private assistant conversation.'),component:Page});
function Page(){return <ChatWorkspace conversationId={Route.useParams().id}/>}
