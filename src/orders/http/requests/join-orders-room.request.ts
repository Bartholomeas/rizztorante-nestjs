import { IsString } from "class-validator";

export class JoinOrdersRoomRequest {
  @IsString()
  roomId: string;
}
