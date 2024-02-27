import { beforeEach, describe, expect, it } from "vitest"
import { app } from "@/app"
import request from "supertest"
import { afterEach } from "node:test"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user"
import { prisma } from "@/lib/prisma"

describe('Check-in History (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to list the history of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -27.0292052,
        longitude: -49.6401091,
      }
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gymId: gym.id,
          userId: user.id,
        },
        {
          gymId: gym.id,
          userId: user.id,
        },
      ]
    })

    const response = await request(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gymId: gym.id,
        userId: user.id,
      }),
      expect.objectContaining({
        gymId: gym.id,
        userId: user.id,
      })
    ])
  })
})