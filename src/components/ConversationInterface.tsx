
import {useState, useEffect, useRef, useContext} from 'react';
import { Send } from 'lucide-react';
import MessageBubble, { Message } from './MessageBubble';
import { Character } from './CharacterCard';
import { useConversation } from '../context/ConversationContext';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import {AuthContext} from "@/context/AuthContext.tsx";
import {API} from "@/services/api.ts";

interface ConversationInterfaceProps {
  character: Character;
}

const ConversationInterface: React.FC<ConversationInterfaceProps> = ({ character }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getConversation, addMessage, fetchConversations } = useConversation();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const api = new API();
  const [loading, setLoading] = useState(false);

  
  // Load conversation from context on mount
  useEffect(() => {
    const savedMessages = getConversation(character.id);
    
    // If there are no saved messages, add an initial greeting
    if (savedMessages.length === 0) {
      const greeting: Message = {
        id: uuidv4(),
        content: `Hello, I'm ${character.name}. ${character.description} How can I help you today?`,
        sender: 'ai',
        timestamp: new Date(),
        characterId: character.id
      };
      
      addMessage(character.id, greeting);
      setMessages([greeting]);
    } else {
      setMessages(savedMessages);
    }
  }, [character, getConversation, addMessage]);

  const handleScroll = ()=>{
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
  useEffect(() => {
    setLoading(true);
    fetchConversations().then(()=> {
      setLoading(false);
      setTimeout(handleScroll, 1000)
    });
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(handleScroll, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      characterId: character.id
    };
    
    // Add message to context (which saves to Supabase)
    addMessage(character.id, userMessage);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    // Set typing indicator
    setIsTyping(true);
    
    // Get AI response from Groq via edge function
    generateAIResponse(input);
  };

  const generateAIResponse = async (userInput: string) => {
    try {
      const response = await api.sendChat(
          character.id,
          user.username,
          user.password,
          userInput
      )
      // Get recent conversation history (last 10 messages)
      // const recentMessages = messages.slice(-10).map(msg => ({
      //   sender: msg.sender,
      //   content: msg.content
      // }));

      // Call our edge function to get the AI response
      // const { data, error } = await supabase.functions.invoke('generate-ai-response', {
      //   body: {
      //     characterName: character.name,
      //     characterDescription: character.description,
      //     characterPersonality: character.personality,
      //     userMessage: userInput,
      //     conversationHistory: recentMessages
      //   }
      // });
      //
      // if (error) {
      //   throw new Error(error.message);
      // }

      // Create AI message with the response
      const aiMessage: Message = {
        id: uuidv4(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        characterId: character.id
      };
      
      // Add AI message to context (which saves to Supabase)
      addMessage(character.id, aiMessage);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Create a fallback message
      const fallbackMessage: Message = {
        id: uuidv4(),
        content: "I'm sorry, I'm having trouble responding right now. Could you try again later?",
        sender: 'ai',
        timestamp: new Date(),
        characterId: character.id
      };
      
      addMessage(character.id, fallbackMessage);
      setMessages((prev) => [...prev, fallbackMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to generate AI response',
        variant: 'destructive',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden rounded-xl bg-white shadow-subtle">
      {/* Chat header */}
      <div className="px-4 py-3 border-b flex items-center">
        <div className="flex-1">
          <h2 className="font-semibold">{character.name}</h2>
          <p className="text-xs text-muted-foreground">{character.personality}</p>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{maxHeight: 'calc(100vh - 300px)'}}>
        {messages.map((message) => (
            <MessageBubble
                key={message.id}
                message={message}
                isTyping={isTyping && message === messages[messages.length - 1] && message.sender === 'ai'}
          />
        ))}
        <div ref={messagesEndRef}></div>
        {
            loading && <div className="flex items-center justify-center p-5">
              <p className="font-light"><i>Loading Conversations ...</i></p>
            </div>
        }
        
        {isTyping && (
          <div className="flex w-full justify-start mb-4">
            <div className="bg-secondary text-secondary-foreground px-4 py-3 rounded-2xl rounded-bl-none">
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex items-center rounded-full border bg-white overflow-hidden pr-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 focus:outline-none resize-none max-h-32"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={input.trim() === '' || isTyping}
            className={`rounded-full p-2 ${
              input.trim() === '' || isTyping
                ? 'text-gray-400'
                : 'text-primary hover:bg-primary/10'
            } transition-colors`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationInterface;
