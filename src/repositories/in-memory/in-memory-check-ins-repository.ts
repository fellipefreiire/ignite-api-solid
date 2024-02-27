import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findById(id: string) {
    return this.items.find((checkIn) => checkIn.id === id) ?? null
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfDay = dayjs(date).startOf('date')
    const endOfDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate = checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay)

      return checkIn.userId === userId && isOnSameDate
    })

    return checkInOnSameDate ?? null
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((checkIn) => checkIn.userId === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async countByUserId(userId: string) {
    return this.items.filter((checkIn) => checkIn.userId === userId).length
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      userId: data.userId,
      gymId: data.gymId,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)

    if (checkInIndex === -1) {
      throw new ResourceNotFoundError
    }

    this.items[checkInIndex] = checkIn

    return checkIn
  }
}