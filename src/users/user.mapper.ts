import { UserBriefInfo } from 'src/dto/user.dto';
import { UsersEntity } from 'src/db/entities/users.entity';

export class MapperUser {
  static toBriefInfo(e: UsersEntity): UserBriefInfo {
    return {
      id: e.id,
      login: e.login,
      name: e.name,
    };
  }

  static toBriefInfos(e: UsersEntity[]) {
    e.map((item) => MapperUser.toBriefInfo(item));
  }
}
