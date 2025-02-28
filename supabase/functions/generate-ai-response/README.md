
# Groq AI Response Generator

This edge function handles communication with the Groq AI API to generate character responses based on the conversation context.

## Setup

Make sure to set the `GROQ_API_KEY` environment variable in the Supabase dashboard.

## Usage

This function expects a POST request with the following JSON body:

```json
{
  "characterName": "Character Name",
  "characterDescription": "Character Description",
  "characterPersonality": "Character Personality Traits",
  "userMessage": "The user's most recent message",
  "conversationHistory": [
    {
      "sender": "user|ai",
      "content": "Message content"
    }
  ]
}
```

## Response

The function returns a JSON response with the generated AI message:

```json
{
  "aiResponse": "The generated AI response"
}
```

## Error Handling

If an error occurs, the function returns a JSON response with an error message:

```json
{
  "error": "Error message"
}
```
