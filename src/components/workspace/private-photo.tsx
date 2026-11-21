import {useEffect,useState} from 'react';
import {supabase} from '@/integrations/supabase/client';

export function PrivatePhoto({path,name}:{path:string;name:string}){
 const [url,setUrl]=useState('');
 useEffect(()=>{let active=true;setUrl('');supabase.storage.from('workspace-files').createSignedUrl(path,300).then(({data})=>{if(active)setUrl(data?.signedUrl??'')});return()=>{active=false}},[path]);
 return url?<img src={url} alt={name} className="my-3 max-h-64 max-w-full rounded-lg object-contain"/>:<span className="text-sm text-muted-foreground">{name}</span>;
}