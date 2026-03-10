const colorMap = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-indigo-100 text-indigo-700',
  review: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  paid: 'bg-green-100 text-green-700',
  unpaid: 'bg-yellow-100 text-yellow-700',
};

export default function StatusBadge({ status }) {
  const cls = colorMap[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${cls}`}>
      {status?.replace(/-/g, ' ')}
    </span>
  );
}
