import { Test, TestingModule } from '@nestjs/testing';
import { expect, jest, it} from "@jest/globals"
import { WorkoutsService } from './workouts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { describe } from 'node:test';
import { ForbiddenException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { WorkoutStatus } from '@prisma/client';

describe('WorkoutsService', () => {
  let service: WorkoutsService;
  let prisma: any;

  beforeEach(async () => {
    const mockPrisma = {
      workout: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
        groupBy: jest.fn(),
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutsService,
        {provide: PrismaService, useValue: mockPrisma}
      ],
    }).compile();

    service = module.get<WorkoutsService>(WorkoutsService);
    prisma = module.get(PrismaService)
    jest.clearAllMocks()
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates workout and returns result (with scheduledAt)', async () => {
      const dto = {
        userId: 'user-1',
        exercises: [{id: 'ex-1', sets: 3, reps: 10, weights: 50}],
        scheduledAt: new Date('2026-06-01T00:00:00Z')
      };

      const created = { id: 'w1', ...dto, workoutExercises: [] };
      prisma.workout.create.mockResolvedValue(created)

      const result = await service.create('user-1', dto);

      expect(prisma.workout.create).toHaveBeenCalled()
      expect(prisma.workout.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            user: {connect: {id: 'user-1' } },
            scheduledAt: dto.scheduledAt,
            workoutExercises: {
              create: [
                {
                  exercise: { connect: { id: 'ex-1' } },
                  sets: 3,
                  reps: 10,
                  weights: 50,
                },
              ]
            }
          }),
          include: {workoutExercises: { include: { exercise: true } } },
        })
      )
      expect(result).toBe(created)
    })

    it('throws ForbiddenException when reqUserId mismatches', async() => {
      const dto = { userId: 'other', exercises: [] };
      await expect(service.create('user-1', dto)).rejects.toBeInstanceOf(ForbiddenException)
      expect(prisma.workout.create).not.toHaveBeenCalled()
    })

    it('applies defaults for missing exercise fields', async () => {
      const dto = { userId: 'user-1', exercises: [{ id: 'ex-1' }] };
      prisma.workout.create.mockResolvedValue({id: 'w2'});

      await service.create('user-1', dto)

      const passed = prisma.workout.create.mock.calls[0][0].data;
      expect(passed.workoutExercises.create[0]).toMatchObject({
        exercise: { connect: { id: 'ex-1' } },
        sets: 1,
        reps: 8,
        weights: 0,
      });
    })

    it('does not include scheduledAt when not provided', async () => {
      const dto = { userId: 'user-1', exercises: [ {id: 'ex-1'}]};
      prisma.workout.create.mockResolvedValue({id: 'w3'})

      await service.create('user-1', dto)

      const passed = prisma.workout.create.mock.calls[0][0].data;
      expect(passed).not.toHaveProperty('scheduledAt');
    })

    it('re-throws Prisma errors', async () => {
      prisma.workout.create.mockRejectedValue(new Error('DB fail'))
      await expect(service.create('user-1', { userId: 'user-1', exercises: []})).rejects.toThrow('DB fail')
    })
  })

  describe('update', () => {
    it('updates workout when owner matches', async () => {
      const existing = { id: 'w1', userId: 'user-1' };
      const dto = { exercises: [{ id: 'ex-1', sets: 2, reps: 6, weights: 20 }], scheduledAt: new Date('2026-06-02T00:00:00Z') };

      prisma.workout.findUnique.mockResolvedValue(existing);
      const updated = { id: 'w1', ...dto, workoutExercises: [] };
      prisma.workout.update.mockResolvedValue(updated);

      const result = await service.update('user-1', dto, 'w1');

      expect(prisma.workout.findUnique).toHaveBeenCalledWith({ where: { id: 'w1' } });
      expect(prisma.workout.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'w1' },
          data: expect.objectContaining({
            user: { connect: { id: existing.userId } },
            scheduledAt: dto.scheduledAt,
            workoutExercises: expect.objectContaining({ deleteMany: {}, create: expect.any(Array) }),
          }),
        })
      );
      expect(result).toBe(updated);
    });

    it('throws NotFoundException when workout not found', async () => {
      prisma.workout.findUnique.mockResolvedValue(null);
      await expect(service.update('user-1', { exercises: [] }, 'w-no')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ForbiddenException when user mismatches', async () => {
      prisma.workout.findUnique.mockResolvedValue({ id: 'w1', userId: 'other' });
      await expect(service.update('user-1', { exercises: [] }, 'w1')).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('deletes when owner matches', async () => {
      prisma.workout.findUnique.mockResolvedValue({ id: 'w1', userId: 'user-1' });
      prisma.workout.delete.mockResolvedValue({ id: 'w1' });

      await expect(service.delete('user-1', 'w1')).resolves.toBeUndefined();
      expect(prisma.workout.delete).toHaveBeenCalledWith({ where: { id: 'w1' } });
    });

    it('throws NotFoundException when not found', async () => {
      prisma.workout.findUnique.mockResolvedValue(null);
      await expect(service.delete('user-1', 'w1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ForbiddenException when user mismatches', async () => {
      prisma.workout.findUnique.mockResolvedValue({ id: 'w1', userId: 'other' });
      await expect(service.delete('user-1', 'w1')).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('updateSchedule', () => {
    it('updates scheduledAt when owner matches', async () => {
      const dto = { date: new Date('2026-06-05T00:00:00Z') };
      prisma.workout.findUnique.mockResolvedValue({ id: 'w1', userId: 'user-1' });
      prisma.workout.update.mockResolvedValue({ id: 'w1', scheduledAt: dto.date });

      const result = await service.updateSchedule('user-1', dto, 'w1');

      expect(prisma.workout.update).toHaveBeenCalledWith({ where: { id: 'w1' }, data: { scheduledAt: dto.date } });
      expect(result).toEqual({ id: 'w1', scheduledAt: dto.date });
    });

    it('throws NotFoundException when not found', async () => {
      prisma.workout.findUnique.mockResolvedValue(null);
      await expect(service.updateSchedule('user-1', { date: new Date() }, 'w1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ForbiddenException when user mismatches', async () => {
      prisma.workout.findUnique.mockResolvedValue({ id: 'w1', userId: 'other' });
      await expect(service.updateSchedule('user-1', { date: new Date() }, 'w1')).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('markAs', () => {
    it('marks workout as given status when owner matches', async () => {
      prisma.workout.findUnique.mockResolvedValue({ id: 'w1', userId: 'user-1' });
      prisma.workout.update.mockResolvedValue({ id: 'w1', status: WorkoutStatus.COMPLETED });

      const result = await service.markAs('user-1', WorkoutStatus.COMPLETED, 'w1');

      expect(prisma.workout.update).toHaveBeenCalledWith({ where: { id: 'w1' }, data: { status: WorkoutStatus.COMPLETED } });
      expect(result).toEqual({ id: 'w1', status: WorkoutStatus.COMPLETED });
    });

    it('throws NotFoundException when not found', async () => {
      prisma.workout.findUnique.mockResolvedValue(null);
      await expect(service.markAs('user-1', WorkoutStatus.COMPLETED, 'w1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ForbiddenException when user mismatches', async () => {
      prisma.workout.findUnique.mockResolvedValue({ id: 'w1', userId: 'other' });
      await expect(service.markAs('user-1', WorkoutStatus.COMPLETED, 'w1')).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('listWorkouts', () => {
    it('lists workouts within date range with optional status', async () => {
      const dto = { startDate: new Date('2026-06-01T00:00:00Z'), endDate: new Date('2026-06-30T00:00:00Z') };
      const data = [{ id: 'w1' }, { id: 'w2' }];
      prisma.workout.findMany.mockResolvedValue(data);

      const result = await service.listWorkouts('user-1', dto);

      expect(prisma.workout.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ userId: 'user-1', scheduledAt: expect.objectContaining({ gte: dto.startDate, lte: dto.endDate }) }),
        include: { workoutExercises: { include: { exercise: true } } },
        orderBy: { scheduledAt: 'asc' },
      }));
      expect(result).toBe(data);
    });
  });

  describe('report', () => {
    it('builds report from groupBy counts', async () => {
      const group = [
        { status: 'COMPLETED', _count: { id: 2 } },
        { status: 'MISSED', _count: { id: 1 } },
      ];
      prisma.workout.groupBy.mockResolvedValue(group);

      const result = await service.report('user-1');

      expect(prisma.workout.groupBy).toHaveBeenCalled();
      const sum = 3;
      expect(result[0].count).toBe(2);
      expect(result[0].percent).toBe(((2 / sum) * 100) + "%");
      expect(result[1].count).toBe(1);
      expect(result[1].percent).toBe(((1 / sum) * 100) + "%");
      expect(result[2].count).toBe(0);
    });
  });
});
