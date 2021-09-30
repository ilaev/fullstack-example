import { DateTime } from "luxon";
import { User } from "../../models";

export function transformUserDTO(userDto: any): User {
    return new User(
      userDto.id,
      userDto.email,
      userDto.name,
      userDto.avatar,
      DateTime.fromISO(userDto.createdAt), // TODO: use luxon date lib
      DateTime.fromISO(userDto.modifiedAt)
    );
  }