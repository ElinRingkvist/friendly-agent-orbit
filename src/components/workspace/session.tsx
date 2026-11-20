import {createContext,useContext,useEffect,useState,type ReactNode} from "react";
import type {User} from "@supabase/supabase-js";
import {supabase} from "@/integrations/supabase/client";
const SessionContext=createContext<{user:User|null;ready:boolean}>({user:null,ready:false});
export function SessionProvider({children}:{children:ReactNode}) {
  const [user,setUser]=useState<User|null>(null);const [ready,setReady]=useState(false);
  useEffect(()=>{supabase.auth.getUser().then(({data})=>{setUser(data.user);setReady(true)});const {data}=supabase.auth.onAuthStateChange((_event,session)=>{setUser(session?.user??null);setReady(true)});return()=>data.subscription.unsubscribe()},[]);
  useEffect(()=>{let active=true;if(!user){document.documentElement.classList.remove("dark");return}supabase.from("account_preferences").select("theme").eq("user_id",user.id).maybeSingle().then(({data})=>{if(active)document.documentElement.classList.toggle("dark",data?.theme==="dark")});return()=>{active=false}},[user]);
  return <SessionContext.Provider value={{user,ready}}>{children}</SessionContext.Provider>;
}
export const useSession=()=>useContext(SessionContext);