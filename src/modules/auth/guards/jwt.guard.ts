import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('jwt guard is active');

    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    console.log(authHeader);

    if (!authHeader) return false;

    return super.canActivate(context);
  }
}
