import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/components/context/AuthContext';
import { api, allPages } from '@/lib/api';
import RichTextEditor from './RichTextEditor';
import './blog-editor.css';

const emptyArticle = name => ({ title: '', slug: '', author_name: name, body: '', page_title: '', meta_description: '', canonical_url: '', featured_image: '', featured_image_alt: '', categories: [], tags: [], status: 'DRAFT', scheduled_at: null });
const slugify = title => title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 200);
const list = value => value.split(',').map(x => x.trim()).filter(Boolean);
const lagosInput = value => value ? new Date(new Date(value).getTime() + 3600000).toISOString().slice(0, 16) : '';

function Shell({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  return <div className="blog-editor"><header className="editor-header"><Link to="/blog-editor">Mmemme Abia <span>Blog studio</span></Link><nav><a href="/blog" target="_blank" rel="noreferrer">View blog</a><button onClick={async () => { try { await logout(); navigate('/blog-editor/login'); } catch (e) { setError(e.message); } }}>Log out</button></nav></header>{error && <p role="alert">{error}</p>}<main>{children}</main></div>;
}

export function BlogLogin() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (loading) return <p className="p-8">Loading…</p>;
  if (user?.can_manage_blog) return <Navigate to="/blog-editor" replace />;
return <div className="blog-editor"><main className="editor-login"><a href="/">Mmemme Abia</a><h1>Blog editor login</h1><p>Sign in with your approved blog editor account.</p><form onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); const data = new FormData(e.currentTarget); try { const account = await login({ email: data.get('email'), password: data.get('password') }); if (!account.can_manage_blog) throw new Error('This account has no blog editor access. Ask your administrator to grant it.'); navigate('/blog-editor'); } catch (err) { setError(err.message); } finally { setBusy(false); } }}><label>Email<input name="email" type="email" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p role="alert" className="editor-error">{error}</p>}<button disabled={busy} className="primary">{busy ? 'Signing in…' : 'Sign in'}</button><Link to="/reset-password">Forgot password?</Link></form></main></div>;
}

export function BlogGuard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8">Loading…</p>;
  if (!user) return <Navigate to="/blog-editor/login" replace />;
  if (!user.can_manage_blog) return <div className="blog-editor"><main><h1>Blog access required</h1><p>Your administrator must approve your account as a blog editor.</p><Link to="/blog-editor/login">Use another account</Link></main></div>;
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
    try { await api(`/blog-editor/articles/${article.id}/`, { method: remove ? 'DELETE' : 'PATCH', body: remove ? undefined : { status: 'DRAFT' } }); await load(); } catch (e) { setError(e.message); } finally { setBusy(null); }
  };
  return <Shell><div className="editor-heading"><div><h1>Your blog</h1><p>Create stories, manage drafts, and plan what comes next.</p></div><Link className="primary" to="/blog-editor/new">Create article</Link></div><div className="editor-filters">{['ALL', 'DRAFT', 'SCHEDULED', 'PUBLISHED'].map(status => <button key={status} aria-pressed={filter === status} onClick={() => setFilter(status)}>{status.charAt(0) + status.slice(1).toLowerCase()}</button>)}</div>{error && <p className="editor-error" role="alert">{error}</p>}{loading ? <p>Loading articles…</p> : articles.filter(a => filter === 'ALL' || a.status === filter).length === 0 ? <div className="editor-card"><h2>No articles here yet</h2><p>Create your first article or choose another status.</p></div> : <div className="editor-post-list">{articles.filter(a => filter === 'ALL' || a.status === filter).map(article => <article className="editor-card" key={article.id}><div><span className={'editor-status ' + article.status.toLowerCase()}>{article.status}</span><h2><Link to={`/blog-editor/posts/${article.id}`}>{article.title}</Link></h2><p>{article.author_name}{article.status === 'SCHEDULED' && article.scheduled_at ? ` · Scheduled ${new Date(article.scheduled_at).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })} WAT` : article.published_at ? ` · ${new Date(article.published_at).toLocaleDateString('en-NG')}` : ''}</p></div><div className="editor-actions"><Link to={`/blog-editor/posts/${article.id}`}>Edit</Link>{article.status === 'PUBLISHED' && <a href={`/blog/${article.slug}`} target="_blank" rel="noreferrer">View</a>}{article.status !== 'DRAFT' && <button disabled={busy === article.id} onClick={() => change(article)}>{article.status === 'SCHEDULED' ? 'Cancel schedule' : 'Unpublish'}</button>}<button className="danger" disabled={busy === article.id} onClick={() => change(article, true)}>Delete</button></div></article>)}</div>}</Shell>;
}

export function BlogArticleEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(() => emptyArticle(user.fullName || user.email));
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (!id) return;
    api(`/blog-editor/articles/${id}/`).then(a => { setArticle(a); setCategories(a.categories.join(', ')); setTags(a.tags.join(', ')); }).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [id]);
  useEffect(() => { const warn = e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [dirty]);
  const update = (field, value) => { setArticle(a => ({ ...a, [field]: value })); setDirty(true); setMessage(''); };
  const payload = status => ({ ...article, categories: list(categories), tags: list(tags), status });
  const save = async status => {
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await api(id ? `/blog-editor/articles/${id}/` : '/blog-editor/articles/', { method: id ? 'PATCH' : 'POST', body: payload(status) });
      setArticle(result); setDirty(false); setMessage(status === 'PUBLISHED' ? 'Article published.' : status === 'SCHEDULED' ? 'Article scheduled.' : 'Draft saved.');
      if (!id) navigate(`/blog-editor/posts/${result.id}`, { replace: true });
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const upload = async (file, alt) => {
    const data = new FormData(); data.append('image', file); data.append('alt', alt);
    return api('/blog-editor/articles/images/', { method: 'POST', body: data });
  };
  const previewPost = async () => { setBusy(true); setError(''); try { const result = await api('/blog-editor/articles/preview/', { method: 'POST', body: payload('DRAFT') }); setPreview(result.html); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  if (loading) return <Shell><p>Loading article…</p></Shell>;
  if (id && !article.id) return <Shell><p role="alert">{error || 'Article unavailable.'}</p><Link to="/blog-editor">Back to articles</Link></Shell>;
  return <Shell><a href="/blog-editor" onClick={e => { if (dirty && !window.confirm('Leave without saving your changes?')) e.preventDefault(); }}>← All articles</a><div className="editor-heading"><div><h1>{id ? 'Edit article' : 'Create article'}</h1><span className={'editor-status ' + article.status.toLowerCase()}>{article.status}</span>{dirty && <span> · Unsaved changes</span>}</div><button disabled={busy} onClick={previewPost}>Preview</button></div>{error && <p className="editor-error" role="alert">{error}</p>}{message && <p className="editor-success" role="status">{message}</p>}<fieldset disabled={busy} className="editor-grid"><section className="editor-card"><label>Article title<input value={article.title} maxLength={200} onChange={e => { update('title', e.target.value); if (!id && (!article.slug || article.slug === slugify(article.title))) update('slug', slugify(e.target.value)); }} /></label><label>Author name<input value={article.author_name} maxLength={150} onChange={e => update('author_name', e.target.value)} /></label><label>Article content</label><RichTextEditor value={article.body} onChange={value => update('body', value)} upload={upload} onError={setError} /><label>Categories <small>Separate with commas</small><input value={categories} onChange={e => { setCategories(e.target.value); setDirty(true); }} placeholder="Culture, Events" /></label><label>Tags <small>Separate with commas</small><input value={tags} onChange={e => { setTags(e.target.value); setDirty(true); }} placeholder="Abia, Festivals" /></label></section><aside><section className="editor-card"><h2>Featured image</h2>{article.featured_image && <><img className="featured-preview" src={article.featured_image} alt={article.featured_image_alt} /><button onClick={() => update('featured_image', '')}>Remove image</button></>}<label>Image alt text<input value={article.featured_image_alt} maxLength={300} onChange={e => update('featured_image_alt', e.target.value)} placeholder="Describe the image" /></label><label>Upload image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={async e => { const file = e.target.files[0]; e.target.value = ''; if (!file) return; if (!article.featured_image_alt.trim()) { setError('Add image alt text before uploading.'); return; } setBusy(true); setError(''); try { const image = await upload(file, article.featured_image_alt); update('featured_image', image.url); } catch (err) { setError(err.message); } finally { setBusy(false); } }} /></label><small>JPEG, PNG or WebP · up to 5 MB</small></section><section className="editor-card"><h2>Search appearance</h2><label>Page title<input value={article.page_title} maxLength={200} onChange={e => update('page_title', e.target.value)} placeholder="Defaults to article title" /></label><label>Meta description<textarea value={article.meta_description} maxLength={320} onChange={e => update('meta_description', e.target.value)} rows={4} /><small>{article.meta_description.length}/320 characters</small></label><label>URL slug<input value={article.slug} maxLength={200} onChange={e => update('slug', e.target.value)} /><small>/blog/{article.slug || 'your-article'}</small></label><label>Canonical URL<input type="url" value={article.canonical_url} onChange={e => update('canonical_url', e.target.value)} placeholder="Defaults to this article’s URL" /></label></section><section className="editor-card"><h2>Publishing</h2><p>Preview your article before publishing.</p><label>Schedule date and time (Nigeria · WAT)<input type="datetime-local" value={lagosInput(article.scheduled_at)} onChange={e => update('scheduled_at', e.target.value ? new Date(e.target.value + ':00+01:00').toISOString() : null)} /></label><div className="publish-actions"><button onClick={() => save('DRAFT')}>{article.status === 'PUBLISHED' ? 'Save and unpublish' : 'Save draft'}</button>{article.status === 'PUBLISHED' && <button className="primary" onClick={() => save('PUBLISHED')}>Save published changes</button>}{article.status !== 'PUBLISHED' && <button className="primary" onClick={() => save('PUBLISHED')}>Publish now</button>}<button disabled={!article.scheduled_at} onClick={() => save('SCHEDULED')}>Schedule post</button></div></section></aside></fieldset>{preview && <div className="preview-modal" role="dialog" aria-modal="true" aria-label="Article preview"><div className="preview-panel"><button autoFocus onClick={() => setPreview('')}>Close preview</button><iframe title="Private article preview" sandbox="" srcDoc={preview} /></div></div>}</Shell>;
}
