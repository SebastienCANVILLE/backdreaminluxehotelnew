import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(email: string, password: string, id : number): Promise<any> {

    const emailGoodWrited = await User.findOneBy({ email })

    if (emailGoodWrited === null) { // permet de renvoyer un message d'erreur, si l'email est mal renseigné
      throw new HttpException("Mauvais Email ou password", HttpStatus.NOT_ACCEPTABLE);
    }

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}