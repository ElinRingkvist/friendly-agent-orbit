import {createFileRoute} from '@tanstack/react-router';
import {ChatWorkspace} from '@/components/workspace/chat';
import {pageHead} from '@/lib/workspace/meta';
export const Route=createFileRoute('/')({head:()=>pageHead('Chat — Your private workspace','Chat with your assistant and work with your agents, memory and routines.'),component:ChatWorkspace});
