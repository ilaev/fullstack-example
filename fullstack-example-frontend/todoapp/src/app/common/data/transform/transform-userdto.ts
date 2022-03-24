import { DateTime } from "luxon";
import { User } from "../../models";

export function transformFromUserDTO(userDto: any): User {
    return new User(
      userDto.id,
      userDto.email,
      userDto.name,
      DateTime.fromISO(userDto.createdAt),
      DateTime.fromISO(userDto.modifiedAt)
    );
  }