'use client';
import { LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function SignOut() {
  return (
    <div className="flex w-full justify-center items-center">
      <LogOutIcon className="mr-2 h-4 w-4 hover:text-white" />

      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="w-full  hover:bg-red-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium text-left items-center flex"
      >
        Sign Out
      </button>
    </div>
  );
}
