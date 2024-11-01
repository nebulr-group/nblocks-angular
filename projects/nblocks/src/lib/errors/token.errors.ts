export class TokenVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenVerificationError';
  }
}

export class TokenExpiredError extends TokenVerificationError {
  constructor() {
    super('Token has expired');
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends TokenVerificationError {
  constructor(details?: string) {
    super(`Invalid token${details ? `: ${details}` : ''}`);
    this.name = 'InvalidTokenError';
  }
}

export class JwksError extends TokenVerificationError {
  constructor(details?: string) {
    super(`Failed to fetch or validate JWKS${details ? `: ${details}` : ''}`);
    this.name = 'JwksError';
  }
} 