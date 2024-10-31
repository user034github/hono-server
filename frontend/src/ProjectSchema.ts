import { z } from 'zod';

export const ProjectSchema = z.object({
    tittel: z.string().min(1, 'Tittel is required'),
    beskrivelse: z.string().optional(),
    publishedAt: z.string().optional(),
    status: z.enum(['draft', 'published']).optional(),
    tags: z.string().optional()
});

export type Project = z.infer<typeof ProjectSchema>; 