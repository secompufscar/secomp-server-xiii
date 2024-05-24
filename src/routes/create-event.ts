import fastify, { FastifyInstance } from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from '../lib/prisma';
import { generateSlug } from '../utils/generate-slug'

export async function createEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events', {
            schema: {
                body: z.object({
                    titulo: z.string(),
                    detalhes: z.string().nullable(),
                    vagas: z.number().int().positive(),
                }),
                response: {
                    201: z.object({
                        eventId: z.string().uuid(),
                    })
                },
            },
        }, async (request, reply) => {
            const {
                titulo,
                detalhes,
                vagas,
            } = request.body

            const slug = generateSlug(titulo)

            const eventWithSameSlug = await prisma.event.findUnique({
                where: {
                    slug,
                }
            })

            if (eventWithSameSlug !== null) {
                throw new Error("Evento com mesmo título já existe")
            }

            const event = await prisma.event.create({
                data: {
                    titulo,
                    detalhes,
                    vagas,
                    slug,
                },
            })

            return reply.status(201).send({ eventId: event.id })
        })
}
