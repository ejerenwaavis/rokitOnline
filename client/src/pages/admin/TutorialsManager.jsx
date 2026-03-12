import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TUTORIAL_CATEGORIES = ['design tips', 'printing', 'branding', 'web', 'business'];

function EditorToolbar({ editor }) {
  if (!editor) return null;
  const btn = (action, label, isActive) => (
    <button
      type="button"
      onClick={action}
      className={`px-2 py-1 text-xs font-bold border transition-colors ${isActive ? 'bg-rokit-orange text-white border-rokit-orange' : 'bg-white text-rokit-body border-gray-200 hover:border-rokit-orange'}`}
    >
      {label}
    </button>
  );
  return (
    <div className="flex flex-wrap gap-1 p-2 bg-rokit-tan border-b border-gray-200">
      {btn(() => editor.chain().focus().toggleBold().run(), 'B', editor.isActive('bold'))}
      {btn(() => editor.chain().focus().toggleItalic().run(), 'I', editor.isActive('italic'))}
      {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', editor.isActive('heading', { level: 2 }))}
      {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3', editor.isActive('heading', { level: 3 }))}
      {btn(() => editor.chain().focus().toggleBulletList().run(), '• List', editor.isActive('bulletList'))}
      {btn(() => editor.chain().focus().toggleOrderedList().run(), '1. List', editor.isActive('orderedList'))}
      {btn(() => editor.chain().focus().toggleBlockquote().run(), '" Quote', editor.isActive('blockquote'))}
    </div>
  );
}

function TutorialForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    category: initial?.category || '',
    status: initial?.status || 'draft',
    tags: initial?.tags?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write your tutorial content here…' }),
    ],
    content: initial?.content || '',
  });

  const handleSave = async () => {
    if (!form.title || !form.category) { toast.error('Title and category are required.'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        content: editor.getHTML(),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      };
      let res;
      if (initial?._id) {
        res = await api.put(`/tutorials/${initial._id}`, payload);
      } else {
        res = await api.post('/tutorials', payload);
      }
      toast.success(initial?._id ? 'Tutorial updated!' : 'Tutorial created!');
      onSaved(res.data);
    } catch {
      toast.error('Failed to save tutorial.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow-sm space-y-4">
      <h2 className="font-black text-rokit-dark text-xl">{initial?._id ? 'Edit Tutorial' : 'New Tutorial'}</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Title *</label>
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="form-input" placeholder="Tutorial title" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Category *</label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="form-input">
            <option value="">Select…</option>
            {TUTORIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-rokit-dark mb-1">Content *</label>
        <div className="border border-gray-200 min-h-[200px]">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} className="tiptap-content p-4 min-h-[160px] focus:outline-none" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Tags (comma-separated)</label>
          <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className="form-input" placeholder="e.g. design,tips,printing" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-rokit-dark mb-1">Status</label>
          <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="form-input">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save Tutorial'}</button>
        <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}

export default function TutorialsManager() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = hidden, 'new' = new form, tutorial object = edit form

  useEffect(() => {
    const controller = new AbortController();
    api.get('/tutorials/admin/all', { signal: controller.signal })
      .then(res => { setTutorials(Array.isArray(res.data) ? res.data : []); setLoading(false); })
      .catch(() => { setLoading(false); });
    return () => controller.abort();
  }, []);

  const handleSaved = (saved) => {
    setTutorials(prev => {
      const exists = prev.find(t => t._id === saved._id);
      return exists ? prev.map(t => t._id === saved._id ? saved : t) : [saved, ...prev];
    });
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tutorial?')) return;
    try {
      await api.delete(`/tutorials/${id}`);
      setTutorials(prev => prev.filter(t => t._id !== id));
      toast.success('Tutorial deleted.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <>
      <Helmet><title>Tutorials Manager – Rokit Media Admin</title></Helmet>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-rokit-dark">Tutorials Manager</h1>
          {!editing && (
            <button onClick={() => setEditing('new')} className="btn-primary">+ New Tutorial</button>
          )}
        </div>

        {editing && (
          <div className="mb-8">
            <TutorialForm
              initial={editing === 'new' ? null : editing}
              onSaved={handleSaved}
              onCancel={() => setEditing(null)}
            />
          </div>
        )}

        {loading ? <LoadingSpinner center /> : (
          <div className="bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-rokit-dark text-white text-xs uppercase tracking-wide text-left">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tutorials.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-rokit-body">No tutorials yet.</td></tr>
                ) : tutorials.map(t => (
                  <tr key={t._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{t.title}</td>
                    <td className="px-4 py-3 capitalize text-rokit-body">{t.category}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3 text-gray-400">{t.views || 0}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => setEditing(t)} className="text-rokit-orange text-xs font-semibold hover:underline">Edit</button>
                      <button onClick={() => handleDelete(t._id)} className="text-red-500 text-xs font-semibold hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
