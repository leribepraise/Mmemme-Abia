import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/components/context/AuthContext';
import { api, allPages } from '@/lib/api';
import RichTextEditor from './RichTextEditor';
import BlogSiteFrame from './BlogSiteFrame';
import { useTheme } from '@/components/context/ThemeContext';
import { toast } from '@/hooks/use-toast';
import { blogSaveMessage, validateBlogAction } from './blog-actions';
import './blog-editor.css';

const emptyArticle = name => ({ title: '', slug: '', author_name: name, body: '', page_title: '', meta_description: '', canonical_url: '', featured_image: '', featured_image_alt: '', categories: [], tags: [], status: 'DRAFT', scheduled_at: null });
const slugify = title => title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 200);
const list = value => value.split(',').map(x => x.trim()).filter(Boolean);
const lagosInput = value => value ? new Date(new Date(value).getTime() + 3600000).toISOString().slice(0, 16) : '';

function Shell({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  return <BlogSiteFrame><header className="editor-header"><Link to="/blog-editor">Blog studio</Link><nav><a href="/blog" target="_blank" rel="noreferrer">View blog</a><button onClick={async () => { try { await logout(); navigate('/blog-editor/login'); } catch (e) { setError(e.message); } }}>Log out</button></nav></header>{error && <p role="alert">{error}</p>}<main>{children}</main></BlogSiteFrame>;
}

export function BlogLogin() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (loading) return <p className="p-8">Loading…</p>;
  if (user?.can_manage_blog) return <Navigate to="/blog-editor" replace />;
return <BlogSiteFrame><main className="editor-login"><a href="/">Mmemme Abia</a><h1>Blog editor login</h1><p>Sign in with your approved blog editor account.</p><form onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); const data = new FormData(e.currentTarget); try { const account = await login({ email: data.get('email'), password: data.get('password') }); if (!account.can_manage_blog) throw new Error('This account has no blog editor access. Ask your administrator to grant it.'); navigate('/blog-editor'); } catch (err) { setError(err.message); } finally { setBusy(false); } }}><label>Email<input name="email" type="email" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p role="alert" className="editor-error">{error}</p>}<button disabled={busy} className="primary">{busy ? 'Signing in…' : 'Sign in'}</button><Link to="/reset-password">Forgot password?</Link></form></main></BlogSiteFrame>;
}

export function BlogGuard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8">Loading…</p>;
  if (!user) return <Navigate to="/blog-editor/login" replace />;
  if (!user.can_manage_blog) return <BlogSiteFrame><main><h1>Blog access required</h1><p>Your administrator must approve your account as a blog editor.</p><Link to="/blog-editor/login">Use another account</Link></main></BlogSiteFrame>;
  return children;
}

export default function BlogDashboard() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [busy, setBusy] = useState(null);
  const load = async () => { const rows = await allPages('/blog-editor/articles/'); setArticles(rows); };
  useEffect(() => { load().catch(e => setError(e.message)).finally(() => setLoading(false)); }, []);
  const change = async (article, remove = false) => {
    if (remove && !window.confirm(`Delete “${article.title}”? This permanently deletes the article.`)) return;
    setBusy(article.id); setError('');
    try { await api(`/blog-editor/articles/${article.id}/`, { method: remove ? 'DELETE' : 'PATCH', body: remove ? undefined : { status: 'DRAFT' } }); toast({ title: remove ? 'Article deleted' : 'Draft saved', description: remove ? `“${article.title}” was deleted.` : blogSaveMessage('DRAFT', article.status) }); await load(); } catch (e) { setError(e.message); toast({ title: 'Action could not be completed', description: e.message, variant: 'destructive' }); } finally { setBusy(null); }
  };
  return <Shell><div className="editor-heading"><div><h1>Your blog</h1><p>Create stories, manage drafts, and plan what comes next.</p></div><Link className="primary" to="/blog-editor/new">Create article</Link></div><div className="editor-filters">{['ALL', 'DRAFT', 'SCHEDULED', 'PUBLISHED'].map(status => <button key={status} aria-pressed={filter === status} onClick={() => setFilter(status)}>{status.charAt(0) + status.slice(1).toLowerCase()}</button>)}</div>{error && <p className="editor-error" role="alert">{error}</p>}{loading ? <p>Loading articles…</p> : articles.filter(a => filter === 'ALL' || a.status === filter).length === 0 ? <div className="editor-card"><h2>No articles here yet</h2><p>Create your first article or choose another status.</p></div> : <div className="editor-post-list">{articles.filter(a => filter === 'ALL' || a.status === filter).map(article => <article className="editor-card" key={article.id}><div><span className={'editor-status ' + article.status.toLowerCase()}>{article.status}</span><h2><Link to={`/blog-editor/posts/${article.id}`}>{article.title}</Link></h2><p>{article.author_name}{article.status === 'SCHEDULED' && article.scheduled_at ? ` · Scheduled ${new Date(article.scheduled_at).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })} WAT` : article.published_at ? ` · ${new Date(article.published_at).toLocaleDateString('en-NG')}` : ''}</p></div><div className="editor-actions"><Link to={`/blog-editor/posts/${article.id}`}>Edit</Link>{article.status === 'PUBLISHED' && <a href={`/blog/${article.slug}`} target="_blank" rel="noreferrer">View</a>}{article.status !== 'DRAFT' && <button disabled={busy === article.id} onClick={() => change(article)}>{article.status === 'SCHEDULED' ? 'Cancel schedule' : 'Unpublish'}</button>}<button className="danger" disabled={busy === article.id} onClick={() => change(article, true)}>Delete</button></div></article>)}</div>}</Shell>;
}

export function BlogArticleEditor() {
  const { theme } = useTheme();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const operation = useRef(false);
  const [article, setArticle] = useState(() => emptyArticle(user.fullName || user.email));
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.blogFeedback || '');
  const [busy, setBusy] = useState(false);
  const [pendingAction, setPendingAction] = useState('');
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (location.state?.blogFeedback) navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);
  const reportError = message => {
    setMessage('');
    setError(message);
    toast({ title: 'Please check your article', description: message, variant: 'destructive' });
  };
  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    api(`/blog-editor/articles/${id}/`).then(a => { if (active) { setArticle(a); setCategories(a.categories.join(', ')); setTags(a.tags.join(', ')); } }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  useEffect(() => { const warn = e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [dirty]);
  const update = (field, value) => { setArticle(a => ({ ...a, [field]: value })); setDirty(true); setMessage(''); };
  const payload = status => ({ ...article, categories: list(categories), tags: list(tags), status });
  const save = async status => {
    if (operation.current) return;
    const validation = validateBlogAction(article, status);
    if (validation) {
      reportError(validation.message);
      document.getElementById(`blog-${validation.field}`)?.focus();
      return;
    }
    operation.current = true;
    setBusy(true); setPendingAction(status); setError(''); setMessage('');
    try {
      const result = await api(id ? `/blog-editor/articles/${id}/` : '/blog-editor/articles/', { method: id ? 'PATCH' : 'POST', body: payload(status) });
      const feedback = blogSaveMessage(status, article.status);
      setArticle(result); setDirty(false); setMessage(feedback);
      toast({ title: status === 'PUBLISHED' ? 'Published successfully' : status === 'SCHEDULED' ? 'Post scheduled' : 'Draft saved', description: feedback });
      if (!id) navigate(`/blog-editor/posts/${result.id}`, { replace: true, state: { blogFeedback: feedback } });
    } catch (e) { reportError(e.message); } finally { operation.current = false; setBusy(false); setPendingAction(''); }
  };
  const upload = async (file, alt) => {
    const data = new FormData(); data.append('image', file); data.append('alt', alt);
    return api('/blog-editor/articles/images/', { method: 'POST', body: data });
  };
  const previewPost = async () => { if (operation.current) return; operation.current = true; setBusy(true); setPendingAction('PREVIEW'); setError(''); try { const result = await api('/blog-editor/articles/preview/', { method: 'POST', body: { ...payload('DRAFT'), theme } }); setPreview(result.html); } catch (e) { reportError(e.message); } finally { operation.current = false; setBusy(false); setPendingAction(''); } };
  if (loading) return <Shell><p>Loading article…</p></Shell>;
  if (id && !article.id) return <Shell><p role="alert">{error || 'Article unavailable.'}</p><Link to="/blog-editor">Back to articles</Link></Shell>;
  return <Shell><a href="/blog-editor" onClick={e => { if (dirty && !window.confirm('Leave without saving your changes?')) e.preventDefault(); }}>← All articles</a><div className="editor-heading"><div><h1>{id ? 'Edit article' : 'Create article'}</h1><span className={'editor-status ' + article.status.toLowerCase()}>{article.status}</span>{dirty && <span> · Unsaved changes</span>}</div><button type="button" disabled={busy} onClick={previewPost}>{pendingAction === 'PREVIEW' ? 'Preparing preview…' : 'Preview'}</button></div>{error && <p className="editor-error" role="alert">{error}</p>}{message && <p className="editor-success" role="status">{message}</p>}<fieldset disabled={busy} aria-busy={busy} className="editor-grid"><section className="editor-card"><label>Article title <small>Required</small><input id="blog-title" value={article.title} maxLength={200} onChange={e => { update('title', e.target.value); if (!id && (!article.slug || article.slug === slugify(article.title))) update('slug', slugify(e.target.value)); }} /></label><label>Author name<input id="blog-author_name" value={article.author_name} maxLength={150} onChange={e => update('author_name', e.target.value)} /></label><label>Article content</label><RichTextEditor value={article.body} disabled={busy} onChange={value => update('body', value)} upload={upload} onError={reportError} onUploadingChange={uploading => { operation.current = uploading; setBusy(uploading); setPendingAction(uploading ? 'IMAGE' : ''); }} /><label>Categories <small>Separate with commas</small><input value={categories} onChange={e => { setCategories(e.target.value); setDirty(true); setMessage(''); }} placeholder="Culture, Events" /></label><label>Tags <small>Separate with commas</small><input value={tags} onChange={e => { setTags(e.target.value); setDirty(true); setMessage(''); }} placeholder="Abia, Festivals" /></label></section><aside><section className="editor-card"><h2>Featured image</h2>{article.featured_image && <><img className="featured-preview" src={article.featured_image} alt={article.featured_image_alt} /><button onClick={() => update('featured_image', '')}>Remove image</button></>}<label>Image alt text<input id="blog-featured_image_alt" value={article.featured_image_alt} maxLength={300} onChange={e => update('featured_image_alt', e.target.value)} placeholder="Describe the image" /></label><label>Upload image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={async e => { const file = e.target.files[0]; e.target.value = ''; if (!file) return; if (!article.featured_image_alt.trim()) { reportError('Add image alt text before uploading.'); return; } if (operation.current) return; operation.current = true; setBusy(true); setPendingAction('IMAGE'); setError(''); try { const image = await upload(file, article.featured_image_alt); update('featured_image', image.url); } catch (err) { reportError(err.message); } finally { operation.current = false; setBusy(false); setPendingAction(''); } }} /></label><small>JPEG, PNG or WebP · up to 5 MB</small></section><section className="editor-card"><h2>Search appearance</h2><label>Page title<input id="blog-page_title" value={article.page_title} maxLength={200} onChange={e => update('page_title', e.target.value)} placeholder="Defaults to article title" /></label><label>Meta description<textarea value={article.meta_description} maxLength={320} onChange={e => update('meta_description', e.target.value)} rows={4} /><small>{article.meta_description.length}/320 characters</small></label><label>URL slug <small>Required · used in your article link</small><input id="blog-slug" value={article.slug} maxLength={200} onChange={e => update('slug', e.target.value)} /><small>/blog/{article.slug || 'your-article'}</small></label><label>Canonical URL<input id="blog-canonical_url" type="url" value={article.canonical_url} onChange={e => update('canonical_url', e.target.value)} placeholder="Defaults to this article’s URL" /></label></section><section className="editor-card"><h2>Publishing</h2><p>{article.status === 'PUBLISHED' ? 'This article is live. Save published changes to update it.' : 'Save a private draft, preview your article, then publish now or choose a future date.'}</p><div className="publishing-feedback" aria-live="polite">{busy && <p role="status">{pendingAction === 'IMAGE' ? 'Uploading image…' : pendingAction === 'PREVIEW' ? 'Preparing preview…' : pendingAction === 'PUBLISHED' ? 'Publishing your article…' : pendingAction === 'SCHEDULED' ? 'Scheduling your article…' : 'Saving your draft…'}</p>}{error && <p className="editor-error">{error}</p>}{message && <p className="editor-success">{message}</p>}</div><label>Schedule date and time (Nigeria · WAT)<input id="blog-scheduled_at" type="datetime-local" value={lagosInput(article.scheduled_at)} onChange={e => update('scheduled_at', e.target.value ? new Date(e.target.value + ':00+01:00').toISOString() : null)} /></label><div className="publish-actions"><button type="button" onClick={() => save('DRAFT')}>{pendingAction === 'DRAFT' ? 'Saving draft…' : article.status === 'PUBLISHED' ? 'Unpublish and save draft' : article.status === 'SCHEDULED' ? 'Cancel schedule and save draft' : 'Save draft'}</button>{article.status === 'PUBLISHED' && <button type="button" className="primary" onClick={() => save('PUBLISHED')}>{pendingAction === 'PUBLISHED' ? 'Publishing…' : 'Save published changes'}</button>}{article.status !== 'PUBLISHED' && <button type="button" className="primary" onClick={() => save('PUBLISHED')}>{pendingAction === 'PUBLISHED' ? 'Publishing…' : 'Publish now'}</button>}<button type="button" disabled={!article.scheduled_at} onClick={() => save('SCHEDULED')}>{pendingAction === 'SCHEDULED' ? 'Scheduling…' : 'Schedule post'}</button></div>{!article.scheduled_at && <small>Choose a date and time to enable scheduling.</small>}{article.updated_at && <p className="editor-saved-time">Last saved {new Date(article.updated_at).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })} WAT</p>}{article.status === 'PUBLISHED' && <a href={`/blog/${article.slug}`} target="_blank" rel="noreferrer">View published article ↗</a>}</section></aside></fieldset>{preview && <div className="preview-modal" role="dialog" aria-modal="true" aria-label="Article preview"><div className="preview-panel"><button autoFocus onClick={() => setPreview('')}>Close preview</button><iframe title="Private article preview" sandbox="" srcDoc={preview} /></div></div>}</Shell>;
}
