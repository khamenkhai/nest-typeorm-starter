import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entity/user.entity';
import { JwtPayload } from 'src/modules/auth/types/jwt-payload';
import { jwtConstants } from 'src/common/const/const';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.usersService.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.create({
      email: createUserDto.email,
      username: createUserDto.username,
      role: createUserDto.role,
      password: hashedPassword,
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      const { password, refreshToken, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserEntity) {
    // 1. Construct the payload using your interface
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role
    };

    // 2. Sign tokens using the typed payload
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: jwtConstants.accessTokenExpiresIn }),
      this.jwtService.signAsync(payload, { expiresIn: jwtConstants.refreshTokenExpiresIn }),
    ]);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(user.id, { refreshToken: hashedRefreshToken });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Access denied');
    }

    // Pass the actual user entity to login to maintain types
    return this.login(user);
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null as any });
  }
}
