import { z } from "zod";

// Password complexity validation
const passwordComplexity = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password must be at most 128 characters long")
  .refine(
    (password) => /[a-z]/.test(password),
    "Password must contain at least one lowercase letter"
  )
  .refine(
    (password) => /[A-Z]/.test(password),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (password) => /\d/.test(password),
    "Password must contain at least one number"
  )
  .refine(
    (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    "Password must contain at least one special character"
  )
  .refine(
    (password) => !/\s/.test(password),
    "Password must not contain spaces"
  )
  .refine(
    (password) => {
      // Common weak passwords to avoid
      const commonPasswords = [
        "password", "123456", "123456789", "qwerty", "abc123",
        "password123", "admin", "letmein", "welcome", "monkey"
      ];
      return !commonPasswords.includes(password.toLowerCase());
    },
    "Password is too common, please choose a stronger password"
  );

export const LoginSchema = z.object({
  email: z
    .email("Please enter a valid email address"),
  password: passwordComplexity,
});

export type LoginData = z.infer<typeof LoginSchema>;
