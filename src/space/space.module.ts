import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { SpaceEntity } from 'src/db/entities/space.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { FileEntity } from 'src/db/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceEntity, FileEntity]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'JWT_SECRET',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule {}
