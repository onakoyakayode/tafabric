export default function ProductSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-4/5 rounded-xl bg-ash-light" />
          <div className="mt-3 h-4 bg-ash-light rounded w-3/4" />
          <div className="mt-1.5 h-3 bg-ash-light rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}
