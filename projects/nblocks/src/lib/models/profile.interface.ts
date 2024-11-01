export interface TenantInfo {
  id?: string;
  name?: string;
  locale?: string;
  logo?: string;
  onboarded?: boolean;
}

export interface Profile {
  id: string;
  username?: string;
  email?: string;
  emailVerified?: boolean;
  givenName?: string;
  familyName?: string;
  fullName?: string;
  locale?: string;
  onboarded?: boolean;
  multiTenantAccess?: boolean;
  tenant?: TenantInfo;
}

export interface IDToken {
  sub: string;
  preferred_username?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  email_verified?: boolean;
  locale?: string;
  onboarded?: boolean;
  tenant_id?: string;
  tenant_locale?: string;
  tenant_logo?: string;
  tenant_name?: string;
  tenant_onboarded?: boolean;
  multi_tenant?: boolean;
} 