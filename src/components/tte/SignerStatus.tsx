import React from 'react';

interface SignerStatusProps {
  name: string;
  email?: string;
  status: string;
}

const statusColor = {
  SIGNED: 'bg-green-100 text-green-700',
  WAITING: 'bg-yellow-100 text-yellow-700',
  REJECTED: 'bg-red-100 text-red-700',
  DEFAULT: 'bg-gray-100 text-gray-700',
};

export const SignerStatus: React.FC<SignerStatusProps> = ({
  name,
  email,
  status,
}) => {
  const colorClass =
    statusColor[status as keyof typeof statusColor] || statusColor.DEFAULT;
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="font-medium">{name}</span>
      {email && <span className="text-xs text-gray-500">({email})</span>}
      <span className={`px-2 py-1 rounded text-xs ${colorClass}`}>
        {status}
      </span>
    </div>
  );
};

export default SignerStatus;
