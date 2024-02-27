import { beforeEach, describe, expect, it } from "vitest"
import { app } from "@/app"
import request from "supertest"
import { afterEach } from "node:test"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user"
import { prisma } from "@/lib/prisma"

describe('Create Check-in (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -27.0292052,
        longitude: -49.6401091,
      }
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.0292052,
        longitude: -49.6401091,
      })

    expect(response.statusCode).toEqual(201)
  })
})