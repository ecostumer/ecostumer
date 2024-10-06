import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'

export async function getProducts(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/products',
      {
        schema: {
          tags: ['Products'],
          summary: 'List Products with Pagination',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            pageIndex: z.coerce.number().min(0).default(0),
            pageSize: z.coerce.number().min(1).max(100).default(10),
            searchTerm: z.string().default(''),
            search: z.string().optional(),
            status: z.boolean().optional(),
            minPrice: z.number().optional(),
            maxPrice: z.number().optional(),
          }),
          response: {
            200: z.object({
              products: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  description: z.string().nullable(),
                  status: z.boolean(),
                  price: z.number(),
                }),
              ),
              totalCount: z.number(),
              totalPages: z.number(),
              currentPage: z.number(),
              pageSize: z.number(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { pageIndex, pageSize, searchTerm, status, minPrice, maxPrice } =
          request.query

        const { organization } = await request.getUserMembership(slug)

        const whereClause: {
          organizationId: string
          name?: { contains: string; mode: 'insensitive' }
          status?: boolean
          price?: { gte?: number; lte?: number }
        } = {
          organizationId: organization.id,
        }

        // Aplicar filtros dinamicamente
        if (searchTerm) {
          whereClause.name = {
            contains: searchTerm,
            mode: 'insensitive',
          }
        }

        if (status !== undefined) {
          whereClause.status = status
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
          whereClause.price = {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          }
        }

        // Consultar o número total de produtos
        const totalCount = await prisma.product.count({
          where: whereClause,
        })

        // Consultar produtos com paginação e filtros aplicados
        const products = await prisma.product.findMany({
          where: whereClause,
          skip: pageIndex * pageSize, // Pular produtos para a página atual
          take: pageSize, // Limitar ao tamanho da página
          orderBy: {
            createdAt: 'desc', // Ordenar por data de criação
          },
        })

        // Calcular o número total de páginas
        const totalPages = Math.ceil(totalCount / pageSize)

        return reply.status(200).send({
          products,
          totalCount,
          totalPages,
          currentPage: pageIndex,
          pageSize,
        })
      },
    )
}
