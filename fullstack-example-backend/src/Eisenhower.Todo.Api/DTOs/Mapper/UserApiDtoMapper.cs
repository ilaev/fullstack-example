namespace Eisenhower.Todo.Api.Dto;

public static class UserApiDtoMapper 
{
    public static UserDto toApiDto(Domain.User user)
    {
        return new UserDto(
            user.UserId.Id,
            user.Email,
            user.Name
        );
    }
}