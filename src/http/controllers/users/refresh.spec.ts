import { beforeEach, describe, expect, it } from "vitest"
import { app } from "@/app"
import request from "supertest"
import { afterEach } from "node:test"

describe('Refresh Token (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String)
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken=')
    ])
  })
})