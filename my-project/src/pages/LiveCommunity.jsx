import SiteImage from '@/components/SiteImage';
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/components/context/AuthContext';
import ShareApp from '@/components/ShareApp';
import toast from 'react-hot-toast';

const button = 'rounded-lg bg-[#3F783D] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50';
const input = 'w-full rounded-lg border border-gray-200 bg-white p-3 text-sm';
function ErrorState({ state }) { return state.error ? <p role="alert" className="rounded-lg bg-red-50 p-3">{state.error.message} <button onClick={state.reload} className="underline">Retry</button></p> : state.loading ? <p role="status">Loading…</p> : null; }
function Pages({ page, setPage, data }) { return <div className="flex justify-between gap-4 py-4"><button disabled={page===1} onClick={()=>setPage(page-1)} className="disabled:opacity-40">Previous</button><span>Page {page}</span><button disabled={!data?.next} onClick={()=>setPage(page+1)} className="disabled:opacity-40">Next</button></div>; }

function Comments({ post, onAdded }) {
  const [page, setPage] = useState(1);
  const state = useApi(`/community/posts/${post}/comments/?page=${page}`);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [newComments, setNewComments] = useState([]);
  const send = async event => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const created = await api(`/community/posts/${post}/comments/`, {method:'POST',body:{body}});
      setNewComments(rows => [created, ...rows]);
      setBody('');
      setPage(1);
      onAdded();
    } catch(error) { toast.error(error.message); }
    finally { setBusy(false); }
  };
  const rows = page === 1 ? [...newComments, ...(state.data?.results || [])] : state.data?.results || [];
  return <div className="mt-4 space-y-3 border-t pt-4"><ErrorState state={state}/>{rows.map(comment=><div key={comment.id} className="rounded-lg bg-gray-50 p-3 text-sm"><strong>{comment.author.name}</strong><p className="whitespace-pre-wrap break-words">{comment.body}</p></div>)}<Pages page={page} setPage={setPage} data={state.data}/><form onSubmit={send} className="flex gap-2"><input required maxLength={2000} aria-label="Comment" placeholder="Write a comment…" value={body} onChange={e=>setBody(e.target.value)} className={input}/><button disabled={busy} className={button}>Send</button></form></div>;
}

function PostCard({ post, onRemove, blog=false }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(false);
  const [report, setReport] = useState(false);
  const [reason, setReason] = useState('');
  const [busy,setBusy]=useState(false);
  const [reaction, setReaction] = useState({ liked: !!post.liked, count: post.like_count || 0 });
  const [commentCount, setCommentCount] = useState(post.comment_count || 0);
  const like = async () => {
    if (busy) return;
    const previous = reaction;
    const wanted = !previous.liked;
    setReaction({ liked: wanted, count: Math.max(0, previous.count + (wanted ? 1 : -1)) });
    setBusy(true);
    try {
      const confirmed = await api(`/community/posts/${post.id}/like/`, { method: 'POST', body: { liked: wanted } });
      setReaction({ liked: confirmed.liked, count: confirmed.like_count });
    } catch (error) { setReaction(previous); toast.error(error.message); }
    finally { setBusy(false); }
  };
  const submitReport = async event => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await api(`/community/posts/${post.id}/report/`, {method:'POST', body:{reason}});
      setReport(false);
      setReason('');
      toast.success('Report sent to moderators.');
    } catch(error) { toast.error(error.message); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    if (busy || !window.confirm('Remove this post from the feed?')) return;
    setBusy(true);
    try { await api(`/community/posts/${post.id}/`, {method:'DELETE'}); onRemove(post.id); }
    catch(error) { toast.error(error.message); setBusy(false); }
  };
  return <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">{post.image&&<SiteImage src={post.image} alt="" className="max-h-96 w-full object-cover"/>}<div className="space-y-4 p-5"><div className="flex items-center gap-3">{post.author.avatar&&<SiteImage src={post.author.avatar} alt="" className="h-10 w-10 rounded-full object-cover"/>}<div><p className="font-bold">{post.author.name}</p><time className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</time></div>{post.status!=='PUBLISHED'&&<span className="ml-auto rounded-full bg-orange-50 px-3 py-1 text-xs">{post.status}</span>}</div>{post.title&&<h2 className="text-2xl font-bold text-[#172033]"><Link to={blog?`/blog/${post.id}`:`/community/posts/${post.id}`}>{post.title}</Link></h2>}<p className="whitespace-pre-wrap break-words leading-7">{post.body}</p><div className="flex flex-wrap gap-4 text-sm">{user&&post.status==='PUBLISHED'&&<><button type="button" disabled={busy} aria-label={reaction.liked?'Unlike post':'Like post'} aria-pressed={reaction.liked} onClick={like} className={reaction.liked?'font-bold text-red-600':''}>♥ {reaction.count}</button><button type="button" onClick={()=>setComments(!comments)}>Comments ({commentCount})</button><button type="button" onClick={()=>setReport(!report)}>Report</button></>}<ShareApp path={blog?`/blog/${post.id}`:`/community/posts/${post.id}`} title={post.title||'Mmemme Abia community'} label="Share"/>{user?.id===post.author.id&&<button type="button" disabled={busy} onClick={remove}>Remove</button>}</div>{report&&<form onSubmit={submitReport} className="flex gap-2"><input required maxLength={1000} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Tell moderators what is wrong" aria-label="Report reason" className={input}/><button disabled={busy} className={button}>Report</button></form>}{comments&&<Comments post={post.id} onAdded={()=>setCommentCount(value=>value+1)}/>}</div></article>;
}

export function CreateLivePost() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const groups = useApi('/community/groups/?mine=true');
  const [body,setBody]=useState('');const [group,setGroup]=useState(params.get('group')||'');const [image,setImage]=useState(null);const [busy,setBusy]=useState(false);
  const submit=async event=>{event.preventDefault();setBusy(true);try{const form=new FormData();form.append('body',body);if(group)form.append('group',group);if(image)form.append('image',image);await api('/community/posts/',{method:'POST',body:form});toast.success('Your post is live.');navigate('/community?tab=mine');}catch(error){toast.error(error.message);}finally{setBusy(false);}};
  return <main className="mx-auto max-w-2xl space-y-5 p-6"><h1 className="text-2xl font-bold">Share with the community</h1><form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-6"><label className="block">Where to post<select value={group} onChange={e=>setGroup(e.target.value)} className={input}><option value="">Community feed</option>{groups.data?.results?.filter(g=>g.is_active).map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></label><textarea required maxLength={20000} rows={8} value={body} onChange={e=>setBody(e.target.value)} placeholder="Share your experience…" aria-label="Post" className={input}/><label className="block">Photo (optional, JPEG, PNG or WebP; up to 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setImage(e.target.files?.[0]||null)} className="block mt-2"/></label><p className="text-sm text-gray-500">Posts appear immediately to community members. Do not include private contact or payment information.</p><button disabled={busy} className={button}>Publish post</button> <Link to="/community">Cancel</Link></form></main>;
}

export function LiveGroups() {
  const [page,setPage]=useState(1);const state=useApi(`/community/groups/?page=${page}`);const [create,setCreate]=useState(false);const [busy,setBusy]=useState(false);
  const submit=async e=>{e.preventDefault();setBusy(true);const form=new FormData(e.currentTarget);try{await api('/community/groups/',{method:'POST',body:Object.fromEntries(form)});setCreate(false);state.reload();toast.success('Your group is ready.');}catch(error){toast.error(error.message);}finally{setBusy(false);}};
  return <main className="mx-auto max-w-4xl space-y-5 p-6"><div className="flex justify-between"><h1 className="text-2xl font-bold">Community groups</h1><button onClick={()=>setCreate(!create)} className={button}>Create group</button></div>{create&&<form onSubmit={submit} className="space-y-3 rounded-xl bg-white p-5"><input name="name" required maxLength={120} placeholder="Group name" aria-label="Group name" className={input}/><textarea name="description" required maxLength={2000} placeholder="What is this group about?" aria-label="Group description" className={input}/><button disabled={busy} className={button}>Create group</button></form>}<ErrorState state={state}/><div className="grid gap-4 sm:grid-cols-2">{state.data?.results?.map(group=><Link to={`/community/groups/${group.id}`} key={group.id} className="rounded-xl border bg-white p-5"><h2 className="font-bold">{group.name}</h2><p className="my-3 text-sm">{group.description}</p><p className="text-xs text-gray-500">{group.member_count} members · {group.is_active?(group.joined?'Joined':'Open group'):'Unavailable'}</p></Link>)}</div>{state.data?.count===0&&<p>No groups yet. Create the first one.</p>}<Pages page={page} setPage={setPage} data={state.data}/><Link to="/community" className="text-green-800 underline">Back to community</Link></main>;
}

export function LivePeople() {
  const {id}=useParams();const [page,setPage]=useState(1);const [search,setSearch]=useState('');const state=useApi(id?`/community/people/${id}/`:`/community/people/?page=${page}&search=${encodeURIComponent(search)}`);const preferences=useApi('/community/people/preferences/');const navigate=useNavigate();const [busy,setBusy]=useState(false);
  const chat=async recipient=>{setBusy(true);try{const row=await api('/conversations/',{method:'POST',body:{recipient}});navigate(`/message?conversation=${row.id}`);}catch(error){toast.error(error.message);}finally{setBusy(false);}};
  const update=async(field,value)=>{try{await api('/community/people/preferences/',{method:'PATCH',body:{[field]:value}});preferences.reload();state.reload();}catch(error){toast.error(error.message);}};
  const rows=id?(state.data?[state.data]:[]):state.data?.results||[];
  return <main className="mx-auto max-w-4xl space-y-5 p-6"><h1 className="text-2xl font-bold">Community members</h1><section className="space-y-3 rounded-xl bg-white p-5"><h2 className="font-semibold">Your visibility</h2><p className="text-sm text-gray-600">The directory displays your name, photo and bio. Your email and phone number stay private.</p>{preferences.data&&<>{[['listed','Show my profile in the community directory'],['allow_messages','Allow community members to start a chat with me']].map(([key,label])=><label key={key} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={preferences.data[key]} onChange={e=>update(key,e.target.checked)}/>{label}</label>)}</>}</section>{!id&&<input type="search" value={search} onChange={e=>{setPage(1);setSearch(e.target.value);}} placeholder="Search members by name" aria-label="Search members" className={input}/>}<ErrorState state={state}/><div className="grid gap-4 sm:grid-cols-2">{rows.map(person=><section key={person.id} className="space-y-3 rounded-xl border bg-white p-5">{person.avatar&&<SiteImage src={person.avatar} alt="" className="h-14 w-14 rounded-full object-cover"/>}<h2 className="font-bold">{person.name}</h2><p className="whitespace-pre-wrap text-sm">{person.bio}</p>{person.allow_messages&&<button disabled={busy} onClick={()=>chat(person.id)} className={button}>Message</button>}</section>)}</div>{!state.loading&&!rows.length&&<p>No members found. Members appear when they opt into the directory.</p>}{!id&&<Pages page={page} setPage={setPage} data={state.data}/>}<Link to="/community" className="text-green-800 underline">Back to community</Link></main>;
}

export default function LiveCommunity({blog=false,detail=false,groupView=false}) {
  const {id}=useParams();const navigate=useNavigate();const [params,setParams]=useSearchParams();const tab=params.get('tab')||'feed';const [search,setSearch]=useState('');const [page,setPage]=useState(1);const [removed,setRemoved]=useState([]);
  const group=useApi(groupView?`/community/groups/${id}/`:null);
  const path=detail?`/community/posts/${id}/`:`/community/posts/${tab==='mine'?'mine/':''}?kind=${blog?'BLOG':'COMMUNITY'}&page=${page}&search=${encodeURIComponent(search)}${tab==='trending'?'&sort=trending':''}${groupView?`&group=${id}`:''}`;
  const state=useApi(path);const rows=detail?(state.data?[state.data]:[]):state.data?.results||[];const [busy,setBusy]=useState(false);
  const join=async()=>{setBusy(true);try{await api(`/community/groups/${id}/membership/`,{method:'POST',body:{joined:!group.data.joined}});group.reload();}catch(error){toast.error(error.message);}finally{setBusy(false);}};
  return <main className="mx-auto max-w-4xl space-y-5 px-4 py-8"><header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold text-[#172033]">{blog?'Mmemme Abia Blog':groupView?group.data?.name||'Community group':'Community'}</h1><p className="mt-2 text-gray-600">{blog?'Stories, news and guides from our team.':groupView?group.data?.description:'Share experiences and connect with people across Abia.'}</p></div>{!blog&&<Link to={`/community/create-post${groupView?`?group=${id}`:''}`} className={button}>Create post</Link>}</header>
    {!blog&&<nav className="flex flex-wrap gap-4 border-b pb-3 text-sm"><Link to="/community">Feed</Link><button onClick={()=>{setPage(1);setParams({tab:'trending'});}}>Trending</button><button onClick={()=>{setPage(1);setParams({tab:'mine'});}}>My posts</button><Link to="/community/groups">Groups</Link><Link to="/community/people">People</Link><Link to="/message">Chats</Link></nav>}
    {groupView&&group.data&&<button disabled={busy||!group.data.is_active} className={button} onClick={join}>{group.data.joined?'Leave group':'Join group'} · {group.data.member_count} members</button>}
    {!detail&&<input type="search" value={search} onChange={e=>{setPage(1);setSearch(e.target.value);}} aria-label="Search posts" placeholder={blog?'Search articles…':'Search posts…'} className={input}/>}
    <ErrorState state={state}/>{!state.loading&&!state.error&&!rows.length&&<div className="rounded-xl bg-white p-8 text-center">{blog?'No published articles yet. Check back soon.':tab==='mine'?'Your submitted posts will appear here.':'No published posts yet. Share your first experience.'}</div>}{rows.filter(post=>!removed.includes(post.id)).map(post=><PostCard key={post.id} post={post} onRemove={postId=>{setRemoved(ids=>[...ids,postId]);if(detail)navigate('/community');}} blog={blog}/>)}{!detail&&<Pages page={page} setPage={setPage} data={state.data}/>}<ShareApp/>
  </main>;
}
