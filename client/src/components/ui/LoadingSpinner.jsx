export default function LoadingSpinner({ size = 'md', center = false }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  const spinner = (
    <div className={`animate-spin rounded-full border-4 border-rokit-orange/20 border-t-rokit-orange ${sizes[size]}`} />
  );
  if (center) {
    return <div className="flex items-center justify-center w-full py-16">{spinner}</div>;
  }
  return spinner;
}
