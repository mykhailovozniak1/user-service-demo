import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersRepository: UserRepository) {
    super({
      secretOrKey: process.env.SECRET || 'topSecret51',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  public async validate(payload) {
    const { email } = payload;
    const user = await this.usersRepository.findOne({ email }, {});

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
