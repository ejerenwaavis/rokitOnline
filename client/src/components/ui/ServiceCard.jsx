import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group bg-white border border-gray-100 hover:border-rokit-orange hover:shadow-lg transition-all duration-300 p-6 flex flex-col"
    >
      <h3 className="text-lg font-bold text-rokit-dark group-hover:text-rokit-orange transition-colors mb-2">
        {service.name}
      </h3>
      <p className="text-rokit-body text-sm leading-relaxed flex-grow">{service.shortDescription}</p>
      {service.startingPrice && (
        <p className="mt-4 text-rokit-orange font-semibold text-sm">
          From ₦{Number(service.startingPrice).toLocaleString()}
        </p>
      )}
      <span className="mt-3 text-rokit-orange text-sm font-semibold group-hover:underline">Explore →</span>
    </Link>
  );
}
