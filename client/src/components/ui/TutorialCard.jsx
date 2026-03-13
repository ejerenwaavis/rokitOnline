import { Link } from 'react-router-dom';

export default function TutorialCard({ tutorial }) {
  const thumb = tutorial.thumbnail || '/assets/images/strip-1.jpg';
  const date = tutorial.publishedAt
    ? new Date(tutorial.publishedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <Link to={`/tutorials/${tutorial.slug}`} className="group block bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:border-rokit-orange/20 transition-all duration-300 overflow-hidden">
      <div className="overflow-hidden aspect-[16/9] bg-gray-100">
        <img
          src={thumb}
          alt={tutorial.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        {tutorial.category && (
          <span className="text-xs font-medium tracking-[0.15em] uppercase text-rokit-orange mb-2 block">
            {tutorial.category}
          </span>
        )}
        <h3 className="font-bold text-rokit-dark group-hover:text-rokit-orange transition-colors leading-snug mb-2">
          {tutorial.title}
        </h3>
        <p className="text-rokit-body text-xs">{date}</p>
      </div>
    </Link>
  );
}
