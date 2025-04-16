import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

export const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>("JWT_SECRET"),
    signOptions: {
      expiresIn: parseInt(
        configService.getOrThrow<string>("ACCESS_TOKEN_VALIDITY_DURATION_IN_SECONDS"),
      ),
    },
  }),
  inject: [ConfigService],
});
