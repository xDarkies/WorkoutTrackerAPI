import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';

describe('WorkoutsController', () => {
  let controller: WorkoutsController;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateSchedule: jest.fn(),
      markAs: jest.fn(),
      listWorkouts: jest.fn(),
      report: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutsController],
      providers: [{ provide: WorkoutsService, useValue: mockService }],
    }).compile();

    controller = module.get<WorkoutsController>(WorkoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
