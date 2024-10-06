import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getAllClients(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/allClients',
      {
        schema: {
          tags: ['Clients'],
          summary: 'Obter todos os clientes da organização sem paginação',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              clients: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  active: z.boolean().nullable(),
                  email: z.string().email().nullable(),
                  phoneNumber: z.string(),
                  birthday: z.coerce.date().nullable(),
                  street: z.string().nullable(),
                  complement: z.string().nullable(),
                  city: z.string().nullable(),
                  state: z.string().nullable(),
                  createdAt: z.date(),
                  author: z
                    .object({
                      id: z.string(),
                      name: z.string().nullable(),
                      email: z.string().email().nullable(),
                      avatarUrl: z.string().nullable(),
                    })
                    .nullable(),
                }),
              ),
              totalCount: z.number(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const { organization, membership } =
          await request.getUserMembership(slug)
        const { cannot } = getUserPermissions(
          membership.userId,
          membership.role,
        )

        if (cannot('get', 'Client')) {
          throw new UnauthorizedError(
            'Você não tem permissão para visualizar clientes.',
          )
        }

        // Busca todos os clientes da organização
        const clients = await prisma.client.findMany({
          select: {
            createdAt: true,
            active: true,
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            birthday: true,
            street: true,
            complement: true,
            city: true,
            state: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        // Conta o total de registros encontrados
        const totalCount = clients.length

        return reply.status(200).send({
          clients,
          totalCount,
        })
      },
    )
}
