import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  // Override canActivate method to include custom logic
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Call the parent's canActivate method to perform the standard JWT validation
    const result = super.canActivate(context);
    // Check if it is a Promise or Observable
    if (result instanceof Observable) {
      return result
        .toPromise()
        .then((value) => this.handleResult(value, context));
    }
    if (result instanceof Promise) {
      return result.then((value) => this.handleResult(value, context));
    }
    return this.handleResult(result, context);
  }

  // Custom logic for handling result
  private handleResult(result: boolean, context: ExecutionContext): boolean {
    if (!result) {
      throw new UnauthorizedException('Unauthorized access'); // Custom error message
    }
    // Optionally, you can add custom logic or logging here
    console.log('JWT Guard is active and user is authorized');
    return result;
  }
}
