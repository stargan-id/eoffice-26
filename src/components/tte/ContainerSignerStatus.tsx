'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Ban, CheckCircle2, Clock, Info, X } from 'lucide-react';
import { useState } from 'react';

export interface ContainerSignerStatusProps {
  signatories: Array<{
    user: { name: string; email?: string };
    userId: string;
    status: string;
  }>;
}

export const ContainerSignerStatus = ({
  signatories,
}: ContainerSignerStatusProps) => {
  const [expanded, setExpanded] = useState(false);
  if (!Array.isArray(signatories) || signatories.length === 0) {
    return null;
  }
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <Button
        variant="default"
        size="icon"
        aria-label={expanded ? 'Minimize signer info' : 'Show signer info'}
        className="rounded-full shadow-lg"
        onClick={() => setExpanded((e) => !e)}
        title={
          expanded ? 'Tutup info penandatangan' : 'Lihat info penandatangan'
        }
      >
        {expanded ? <X className="w-6 h-6" /> : <Info className="w-6 h-6" />}
      </Button>
      {expanded && (
        <Card className="mt-2 w-80 p-4 animate-fade-in">
          <div className="font-semibold mb-3 text-gray-800 text-base flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Penandatangan & Status
          </div>
          <ul className="divide-y divide-gray-100">
            {signatories.map((signer) => (
              <li key={signer.userId} className="py-2 flex items-center gap-3">
                {/* Avatar or initials */}
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {signer.user?.name
                    ? signer.user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {signer.user?.name || 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {signer.user?.email}
                  </div>
                </div>
                {/* Status badge with icon */}
                <span
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                    signer.status === 'SIGNED'
                      ? 'bg-green-100 text-green-700'
                      : signer.status === 'WAITING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : signer.status === 'REJECTED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  title={signer.status}
                >
                  {signer.status === 'SIGNED' && (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {signer.status === 'WAITING' && <Clock className="w-4 h-4" />}
                  {signer.status === 'REJECTED' && <Ban className="w-4 h-4" />}
                  {signer.status}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
