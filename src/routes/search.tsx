import {useState} from 'react';
import {createFileRoute,Link} from '@tanstack/react-router';
import {useServerFn} from '@tanstack/react-start';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {WorkspaceShell} from '@/components/workspace/shell';
import {recordData,type WorkspaceRecord} from '@/components/workspace/chat';
import {useSession} from '@/components/workspace/session';
import {listRecords} from '@/lib/workspace/records.functions';
import {pageHead} from '@/lib/workspace/meta';
export const Route=createFileRoute('/search')({head:()=>pageHead('Search chats — Private workspace','Find your saved conversations and messages.'),component:Page});
function Page(){const {user}=useSession();const list=useServerFn(listRecords);const [term,setTerm]=useState('');const [rows,setRows]=useState<WorkspaceRecord[]>([]);const [error,setError]=useState('');const [busy,setBusy]=useState(false);return <WorkspaceShell title="Search chats"><section className="collection-page"><h1 className="text-2xl font-medium">Search chats</h1>{user?<><form className="mt-7 flex gap-3" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{setRows(await list({data:{search:term,offset:0}}))}catch(e){setError(e instanceof Error?e.message:'Search failed')}finally{setBusy(false)}}><Input aria-label="Search query" placeholder="Search your workspace…" value={term} onChange={e=>setTerm(e.target.value)}/><Button disabled={busy}>{busy?'Searching…':'Search'}</Button></form>{error&&<p role="alert" className="mt-4 text-destructive">{error}</p>}<div className="mt-8 divide-y">{rows.map(row=>{const d=recordData(row.data);return <article key={row.id} className="py-4"><p className="text-xs text-muted-foreground">{row.entity}</p>{row.entity==='Conversation'?<Link to="/chat/$id" params={{id:row.id}}>{String(d.title)}</Link>:row.entity==='Message'&&typeof d.conversation_id==='string'?<Link to="/chat/$id" params={{id:d.conversation_id}} className="block break-words">{String(d.content).slice(0,200)}</Link>:<p className="break-words">{String(d.title??d.name??d.content??'Record')}</p>}</article>})}</div></>:<Button asChild className="mt-8"><Link to="/auth">Sign in to search</Link></Button>}</section></WorkspaceShell>}
