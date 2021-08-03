import { User } from "../../models";

export function transformUserDTO(userDto: any): User {
    return new User(
      userDto.id,
      userDto.email,
      userDto.name,
      userDto.avatar,
      new Date(userDto.createdAt), // TODO: use luxon date lib
      new Date(userDto.modifiedAt)
    )
  }