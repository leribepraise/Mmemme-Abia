import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { TableKit } from '@tiptap/extension-table';

export default function RichTextEditor({ value, onChange, upload, onError, disabled = false, onUploadingChange }) {
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false } }), Image, TableKit],
    content: value,
    editorProps: { attributes: { id: 'blog-body', class: 'article-body rich-editor', 'aria-label': 'Article content', role: 'textbox', 'aria-multiline': 'true' } },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });
  useEffect(() => { if (editor && editor.getHTML() !== value) editor.commands.setContent(value, { emitUpdate: false }); }, [editor, value]);
  useEffect(() => { editor?.setEditable(!disabled, false); }, [editor, disabled]);
  if (!editor) return null;
  const button = (label, command, active = false) => <button type="button" key={label} aria-pressed={active} onClick={command}>{label}</button>;
  return <div className="rich-editor-wrap"><div className="rich-toolbar" role="toolbar" aria-label="Formatting">
    {button('Paragraph', () => editor.chain().focus().setParagraph().run(), editor.isActive('paragraph'))}
    {[2, 3, 4].map(level => button(`H${level}`, () => editor.chain().focus().toggleHeading({ level }).run(), editor.isActive('heading', { level })))}
    {button('Bold', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
    {button('Italic', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
    {button('Bullets', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
    {button('Numbered list', () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
    {button('Quote', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}
    {button('Link', () => { const href = window.prompt('Link URL (https://…)', editor.getAttributes('link').href || 'https://'); if (href === null) return; if (!href.trim()) editor.chain().focus().extendMarkRange('link').unsetLink().run(); else if (/^https?:\/\//i.test(href)) editor.chain().focus().extendMarkRange('link').setLink({ href }).run(); else onError('Enter an HTTP or HTTPS link.'); }, editor.isActive('link'))}
    {button('Unlink', () => editor.chain().focus().extendMarkRange('link').unsetLink().run())}
    {button('Insert table', () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}
    {editor.isActive('table') && <>{button('Add row', () => editor.chain().focus().addRowAfter().run())}{button('Add column', () => editor.chain().focus().addColumnAfter().run())}{button('Delete row', () => editor.chain().focus().deleteRow().run())}{button('Delete column', () => editor.chain().focus().deleteColumn().run())}{button('Delete table', () => editor.chain().focus().deleteTable().run())}</>}
    {button('Undo', () => editor.chain().focus().undo().run())}{button('Redo', () => editor.chain().focus().redo().run())}
    {editor.isActive('image') && button('Edit image alt', () => { const alt = window.prompt('Describe this image', editor.getAttributes('image').alt || ''); if (alt?.trim()) editor.chain().focus().updateAttributes('image', { alt }).run(); })}
    <label className="inline-upload">{uploading ? 'Uploading…' : 'Add image'}<input type="file" disabled={uploading || disabled} accept="image/jpeg,image/png,image/webp" onChange={async e => { const file = e.target.files[0]; e.target.value = ''; if (!file) return; const alt = window.prompt('Describe this image (alt text)'); if (!alt?.trim()) return; setUploading(true); onUploadingChange?.(true); try { const image = await upload(file, alt.trim()); editor.chain().focus().setImage({ src: image.url, alt: image.alt }).run(); } catch (err) { onError(err.message); } finally { setUploading(false); onUploadingChange?.(false); } }} /></label>
  </div><EditorContent editor={editor} /></div>;
}
