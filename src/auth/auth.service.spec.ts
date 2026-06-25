import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockJwt = { signAsync: jest.fn() };
    const mockUsers = { findByEmail: jest.fn(), create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwt },
        { provide: UsersService, useValue: mockUsers },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
