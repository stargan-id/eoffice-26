import { DefaultSession } from 'next-auth';

// nextauth.d.ts

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id: string;
    nip?: string | null;
    nik?: string | null;
    organisasiId?: string | null;
    organisasiNama?: string | null;
    organisasiNamaSingkat?: string | null;
    roles?: string[];
    permissions?: string[];
  }
  interface Session {
    user: User & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string;
    nip?: string | null;
    nik?: string | null;
    roles: string[];
    organisasiId?: string | null;
    organisasiNama?: string | null;
    organisasiNamaSingkat?: string | null;
    permissions?: string[];
  }
}
