import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Eye, Calendar } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function TutorialPost() {
  const { slug } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api.get(`/tutorials/${slug}`, { signal: controller.signal })
      .then(res => {
        if (res.data && typeof res.data === 'object' && res.data.title) setTutorial(res.data);
        else setError(true);
      })
      .catch(() => { setError(true); });
    return () => controller.abort();
  }, [slug]);

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rokit-tan">
      <h2 className="text-2xl font-black mb-4">Tutorial Not Found</h2>
      <Link to="/tutorials" className="btn-primary">Back to Tutorials</Link>
    </div>
  );

  if (!tutorial) return <LoadingSpinner center />;

  const dateStr = tutorial.publishedAt
    ? new Date(tutorial.publishedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <>
      <Helmet>
        <title>{`${tutorial.title} – Rokit Media Tutorials`}</title>
        <meta name="description" content={tutorial.title} />
      </Helmet>

      <div className="bg-rokit-dark pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/tutorials" className="inline-flex items-center gap-2 text-rokit-orange hover:underline text-sm mb-6">
            <ArrowLeft size={16} /> All Tutorials
          </Link>
          {tutorial.category && (
            <span className="text-xs font-bold uppercase tracking-widest text-rokit-orange mb-3 block">{tutorial.category}</span>
          )}
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">{tutorial.title}</h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            {dateStr && <span className="flex items-center gap-1"><Calendar size={14} /> {dateStr}</span>}
            <span className="flex items-center gap-1"><Eye size={14} /> {tutorial.views || 0} views</span>
          </div>
        </div>
      </div>

      {tutorial.thumbnail && (
        <div className="bg-rokit-tan">
          <div className="max-w-4xl mx-auto">
            <img src={tutorial.thumbnail} alt={tutorial.title} className="w-full max-h-80 object-cover" />
          </div>
        </div>
      )}

      <article className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div
            className="tiptap-content"
            dangerouslySetInnerHTML={{ __html: tutorial.content }}
          />

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
            <Link to="/tutorials" className="btn-outline">← Back to Tutorials</Link>
            <Link to="/portal/quote" className="btn-primary">Get a Quote</Link>
          </div>
        </div>
      </article>
    </>
  );
}
