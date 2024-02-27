import { beforeEach, describe, expect, it } from "vitest"
import { app } from "@/app"
import request from "supertest"
import { afterEach } from "node:test"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user"

describe('Profile (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
      })
    )
  })
})