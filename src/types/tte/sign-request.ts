import type {
  SignRequest as PrismaSignRequest,
  Signatory,
  User,
} from '@prisma/client';

export interface SignatoryWithUser
  extends Pick<Signatory, 'id' | 'userId' | 'status' | 'signedAt'> {
  user: Pick<User, 'id' | 'name' | 'email'>;
}

export interface SignRequest extends PrismaSignRequest {
  user: Pick<User, 'id' | 'name' | 'email'>;
  signatory: Array<SignatoryWithUser>;
}

export interface SignRequestForUser extends PrismaSignRequest {
  user: Pick<User, 'id' | 'name' | 'email'>;
  signatory: Pick<Signatory, 'id' | 'userId' | 'status' | 'signedAt'>;
}
