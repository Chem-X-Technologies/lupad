import { z } from 'zod';

/**
 * Update user profile schema
 */
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .nullable()
    .or(z.literal('')),
});

/**
 * Get user by ID params schema
 */
export const getUserParamsSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

/**
 * Type exports for controllers
 */
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserParams = z.infer<typeof getUserParamsSchema>;
