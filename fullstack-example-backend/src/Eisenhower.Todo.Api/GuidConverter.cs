using System.Text.Json;
using System.Text.Json.Serialization;

namespace Eisenhower.Todo.Api;

public class GuidConverter : JsonConverter<Guid>
{
    public override bool CanConvert(Type objectType)
    {
        return typeof(Guid) == objectType;
    }

    public override Guid Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        switch (reader.TokenType)
        {
            case JsonTokenType.Null:
                return Guid.Empty;
            case JsonTokenType.String:
                var str = reader.GetString();
                if (string.IsNullOrEmpty(str))
                {
                    return Guid.Empty;
                }
                else
                {
                    return new Guid(str);
                }
            default:
                throw new FormatException("Json value is not a supported guid format.");
        }
        
    }

    public override void Write(Utf8JsonWriter writer, Guid value, JsonSerializerOptions options)
        {
            if (Guid.Empty.Equals(value))
            {
                writer.WriteStringValue("");
            }
            else
            {
                writer.WriteStringValue((Guid)value);
            }
        }
}



