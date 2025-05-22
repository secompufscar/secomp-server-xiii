interface EmailConfig {
  email_secret: string;
}

export const email: EmailConfig = {
  email_secret: process.env.EMAIL_SECRET || 'your_email_secret_key',
};