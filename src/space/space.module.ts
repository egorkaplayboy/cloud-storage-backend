import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
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
