import { User } from "./common.dto";

export interface GetOrCreateUserResponseDto {
  user: User;
  isNew: boolean;
}
