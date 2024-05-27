import { UserBriefInfo } from 'src/dto/user.dto';

export class BaseContext {
  readonly user?: UserBriefInfo;
}
