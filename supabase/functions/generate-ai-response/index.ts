
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }

    const { characterName, characterDescription, characterPersonality, userMessage, conversationHistory } = await req.json();

    // Create the system prompt based on character information
    const systemPrompt = `You are ${characterName}, a character with the following description: "${characterDescription}". 
Your personality traits are: ${characterPersonality}.
Respond to the user in a way that reflects your character's personality and background.
Keep your responses engaging but concise (1-3 paragraphs maximum).`;

    // Prepare the messages for the API call
    const messages = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history (excluding the latest user message)
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((message: any) => {
        messages.push({
          role: message.sender === 'user' ? 'user' : 'assistant',
          content: message.content
        });
      });
    }

    // Add the latest user message
    messages.push({ role: "user", content: userMessage });

    console.log("Sending request to Groq API with the following messages:", JSON.stringify(messages));

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Groq's Llama 3 8B model
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Groq API error:", data);
      throw new Error(`Groq API error: ${data.error?.message || JSON.stringify(data)}`);
    }

    const aiResponse = data.choices[0].message.content;
    console.log("Groq API response:", aiResponse);

    return new Response(JSON.stringify({ aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in generate-ai-response function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
