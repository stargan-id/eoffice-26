import {
  SignRequest as PrismaSignRequest,
  Signatory,
  User,
} from '@prisma/client';

export interface SignRequest extends PrismaSignRequest {
  user: Pick<User, 'id' | 'name' | 'email'>;
}

export interface SignRequestForUser extends PrismaSignRequest {
  user: Pick<User, 'id' | 'name' | 'email'>;
  signatory: Pick<Signatory, 'id' | 'userId' | 'status' | 'signedAt'>;
}
