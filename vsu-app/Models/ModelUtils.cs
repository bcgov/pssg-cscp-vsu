#nullable enable
using System;
using System.Text.Json;
using System.Text.Json.Serialization;

/// <summary>
/// A JSON converter that converts empty strings to null values.
/// </summary>
/// <example>
/// <code>
/// [JsonConverter(typeof(EmptyStringToNullConverter))]
/// public string? SomeProperty { get; set; }
/// </code>
/// </example>
public class EmptyStringToNullConverter : JsonConverter<string>
{
    public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            var value = reader.GetString();
            return string.IsNullOrWhiteSpace(value) ? null : value;
        }

        return reader.TokenType == JsonTokenType.Null ? null : throw new JsonException();
    }

    public override void Write(Utf8JsonWriter writer, string? value, JsonSerializerOptions options)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            writer.WriteNullValue();
        }
        else
        {
            writer.WriteStringValue(value);
        }
    }
}
