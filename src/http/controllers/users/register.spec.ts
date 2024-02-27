import { beforeEach, describe, expect, it } from "vitest"
import { app } from "@/app"
import request from "supertest"
import { afterEach } from "node:test"

describe('Register (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toEqual(201)
  })
})