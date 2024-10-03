export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  email: string;
  full_name: string;
  phone_number: string;
  avatar?: string;
};
