import { useCallback, useEffect, useRef, useState } from 'react';
import { Link as LinkIcon, MessageCircle, Share2 } from 'lucide-react';
import { useAuth } from '../../components/context/AuthContext';
import { api, apiPage } from '../../lib/api';
import { authPagePath } from '../../lib/authNavigation';
import { articleShareLinks, copyArticleLink, shareArticle } from './article-sharing';

export function ArticleShare({ article }) {
  const [message, setMessage] = useState('');
  const [fallback, setFallback] = useState('');
  const [busy, setBusy] = useState(false);
  async function run(action) {
    if (busy) return;
    setBusy(true);
    try {
      const result = await action();
      if (result.cancelled) return;
      setFallback(result.fallback || '');
      setMessage(result.copied ? 'Article link copied.' : result.shared ? 'Article shared.' : 'Select and copy the article link below.');
    } finally { setBusy(false); }
  }
  return <section className="blog-engagement blog-share" aria-labelledby="blog-share-heading">
    <h2 id="blog-share-heading">Share this article</h2>
    <p className="meta">Know someone who would enjoy this? Pass it on.</p>
    <div className="blog-share-actions">
      <button type="button" disabled={busy} onClick={() => run(() => shareArticle(article))}><Share2 size={18} aria-hidden="true" />Share</button>
      {articleShareLinks(article.title, article.url).map(network => <a key={network.name} href={network.url} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${network.name}`}>{network.name}</a>)}
      <button type="button" className="blog-secondary" disabled={busy} onClick={() => run(() => copyArticleLink(article.url))}><LinkIcon size={18} aria-hidden="true" />Copy link</button>
    </div>
    <p className="blog-feedback" role="status">{message}</p>
    {fallback && <label className="blog-copy-fallback">Article link
      <input readOnly value={fallback} onFocus={event => event.target.select()} onClick={event => event.currentTarget.select()} />
    </label>}
  </section>;
}

export function ArticleComments({ article }) {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState(article.comments);
  const [page, setPage] = useState(article.page);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const operation = useRef(false);
  const requestNumber = useRef(0);
  const endpoint = `/blog/articles/${encodeURIComponent(article.slug)}/comments/`;
  const returnTo = `/blog/${article.slug}#comments`;

  const load = useCallback(async (number, signal) => {
    const current = ++requestNumber.current;
    setLoading(true);
    setError('');
    try {
      const data = await apiPage(`${endpoint}?page=${number}`, { signal });
      if (current === requestNumber.current) setComments(data);
    } catch (err) {
      if (signal?.aborted || current !== requestNumber.current) return;
      // Removing the last comment on a page can make that page disappear.
      if (err.status === 404 && number > 1) setPage(number - 1);
      else setError(err.message || 'Comments could not load. Please try again.');
    } finally {
      if (current === requestNumber.current) setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    const controller = new AbortController();
    load(page, controller.signal);
    return () => { requestNumber.current += 1; controller.abort(); };
  }, [load, page, user?.id]);

  async function submit(event) {
    event.preventDefault();
    if (operation.current) return;
    if (!body.trim()) { setError('Write a comment before posting.'); return; }
    operation.current = true;
    setBusy(true); setError(''); setNotice('');
    try {
      await api(endpoint, { method: 'POST', body: { body: body.trim() } });
      setBody(''); setNotice('Your comment has been posted.');
      if (page !== 1) setPage(1);
      else await load(1);
    } catch (err) {
      setError(err.status === 401 ? 'Your session has expired. Log in again to post your comment.' : err.message);
    } finally { operation.current = false; setBusy(false); }
  }

  async function remove(id) {
    if (operation.current) return;
    operation.current = true;
    setBusy(true); setError(''); setNotice('');
    try {
      await api(`${endpoint}${id}/`, { method: 'DELETE' });
      setConfirmation(null); setNotice('Comment removed.');
      await load(page);
    } catch (err) { setError(err.message); }
    finally { operation.current = false; setBusy(false); }
  }

  return <section id="comments" className="blog-engagement blog-comments" aria-labelledby="blog-comments-heading">
    <h2 id="blog-comments-heading"><MessageCircle size={24} aria-hidden="true" />Comments ({comments.count})</h2>
    <p className="meta">Join the conversation. Keep your comments thoughtful and respectful.</p>
    {authLoading ? <p role="status">Checking your account…</p> : user ? <form className="blog-comment-form" onSubmit={submit}>
      <label htmlFor="blog-comment-body">Comment as {user.fullName || user.first_name || 'a Mmemme reader'}</label>
      <textarea id="blog-comment-body" value={body} onChange={event => setBody(event.target.value)} maxLength={2000} rows={4} required disabled={busy} aria-describedby="blog-comment-limit" placeholder="What did you think of this article?" />
      <div className="blog-comment-form-footer"><small id="blog-comment-limit" className="meta">{body.length}/2,000 characters</small><button type="submit" disabled={busy || !body.trim()}>{busy ? 'Saving…' : 'Post comment'}</button></div>
    </form> : <p className="blog-comment-signin"><a href={authPagePath('/login', returnTo)}>Log in</a> or <a href={authPagePath('/signup', returnTo)}>create an account</a> to leave a comment.</p>}
    <div className="blog-feedback" aria-live="polite">
      {notice && <p role="status">{notice}</p>}
      {error && <p className="blog-error" role="alert">{error} <button type="button" className="blog-secondary" disabled={loading || busy} onClick={() => load(page)}>Refresh comments</button></p>}
      {loading && <p role="status">Loading comments…</p>}
    </div>
    <ol className="blog-comment-list" aria-busy={loading}>
      {comments.results.map(comment => <li key={comment.id} className="blog-comment">
        <div className="blog-comment-heading"><strong>{comment.author.name}</strong><time dateTime={comment.created_at}>{new Date(comment.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos' })}</time></div>
        <p className="blog-comment-body">{comment.body}</p>
        {user && (comment.author.id === user.id || user.can_manage_blog || user.is_staff) && <div className="blog-comment-remove">
          {confirmation === comment.id ? <><span>Remove this comment?</span><button type="button" disabled={busy} onClick={() => remove(comment.id)}>Remove comment</button><button type="button" className="blog-secondary" disabled={busy} onClick={() => setConfirmation(null)}>Cancel</button></> : <button type="button" className="blog-secondary" disabled={busy} onClick={() => setConfirmation(comment.id)} aria-label={`Remove comment by ${comment.author.name}`}>Remove</button>}
        </div>}
      </li>)}
    </ol>
    {!comments.count && <p className="meta">No comments yet. Be the first to join the conversation.</p>}
    {(comments.previous || comments.next) && <nav className="pagination" aria-label="Comment pages">
      <button type="button" className="blog-secondary" disabled={page === 1 || loading || busy} onClick={() => { setConfirmation(null); setPage(page - 1); }}>Newer comments</button>
      <span>Page {page}</span>
      <button type="button" className="blog-secondary" disabled={!comments.next || loading || busy} onClick={() => { setConfirmation(null); setPage(page + 1); }}>Older comments</button>
    </nav>}
  </section>;
}
