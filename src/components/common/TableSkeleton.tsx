
export const TableSkeleton = ({ rows = 20 }) => {
    return (
        <div className="space-y-1">
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="h-5 w-full rounded animate-pulse bg-gray-200"></div>
            ))}
        </div>
    );
};
