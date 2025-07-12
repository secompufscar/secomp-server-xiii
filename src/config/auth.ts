export const auth = {
  secret_token: process.env.JWT_SECRET as string,
  expires_in_token: process.env.EXPIRES_IN_TOKEN as string,
};
