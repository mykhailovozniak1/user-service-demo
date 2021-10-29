import {
  BadRequestException,
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class CurrentUserIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = req?.params?.id;

    if (String(req?.user?._id) !== id) {
      throw new BadRequestException('id mismatch');
    }

    next();
  }
}
