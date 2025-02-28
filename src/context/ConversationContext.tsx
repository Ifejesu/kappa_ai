
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Message } from '../components/MessageBubble';
import { Character } from '../components/CharacterCard';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { Json } from '@/integrations/supabase/types';

interface ConversationContextType {
  conversations: Record<string, Message[]>;
  addMessage: (characterId: string, message: Message) => void;
  getConversation: (characterId: string) => Message[];
  clearConversation: (characterId: string) => void;
  activeCharacter: Character | null;
  setActiveCharacter: (character: Character | null) => void;
  isLoading: boolean;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

// Helper function to serialize Message objects to plain JavaScript objects for storage
const serializeMessages = (messages: Message[]): Json => {
  return messages.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender: msg.sender,
    timestamp: msg.timestamp.toISOString(),
    characterId: msg.characterId
  })) as Json;
};

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch conversations from Supabase when user logs in
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Convert from Supabase format to local format
      const conversationsMap: Record<string, Message[]> = {};
      data.forEach(conversation => {
        // Process messages to convert string timestamps back to Date objects
        const messagesArray = Array.isArray(conversation.messages) ? conversation.messages : [];
        const messages = messagesArray.map((message: any) => ({
          ...message,
          timestamp: new Date(message.timestamp)
        }));
        
        conversationsMap[conversation.character_id] = messages;
      });
      
      setConversations(conversationsMap);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveConversationToSupabase = async (characterId: string, messages: Message[]) => {
    if (!user) return;
    
    try {
      // Serialize messages to plain objects for storage
      const serializedMessages = serializeMessages(messages);
      
      // Check if conversation exists
      const { data, error } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('character_id', characterId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Update existing conversation
        await supabase
          .from('conversations')
          .update({
            messages: serializedMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
      } else {
        // Create new conversation
        await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            character_id: characterId,
            messages: serializedMessages
          });
      }
    } catch (error) {
      console.error('Error saving conversation to Supabase:', error);
      toast({
        title: 'Error',
        description: 'Failed to save conversation',
        variant: 'destructive',
      });
    }
  };

  const addMessage = (characterId: string, message: Message) => {
    setConversations(prev => {
      const existingConversation = prev[characterId] || [];
      const updatedConversation = [...existingConversation, message];
      
      // Store in localStorage as a fallback
      try {
        localStorage.setItem(`conversation_${characterId}`, JSON.stringify(updatedConversation));
      } catch (error) {
        console.error('Error saving conversation to localStorage:', error);
      }
      
      // Store in Supabase if user is logged in
      if (user) {
        saveConversationToSupabase(characterId, updatedConversation);
      }
      
      return {
        ...prev,
        [characterId]: updatedConversation
      };
    });
  };

  const getConversation = (characterId: string): Message[] => {
    // If we already have the conversation in state, return it
    if (conversations[characterId]) {
      return conversations[characterId];
    }
    
    // Try to load from localStorage as a fallback
    try {
      const savedConversation = localStorage.getItem(`conversation_${characterId}`);
      if (savedConversation) {
        const parsedConversation = JSON.parse(savedConversation) as Message[];
        // Convert string timestamps back to Date objects
        const processedConversation = parsedConversation.map(message => ({
          ...message,
          timestamp: new Date(message.timestamp)
        }));
        
        // Update state with the loaded conversation
        setConversations(prev => ({
          ...prev,
          [characterId]: processedConversation
        }));
        
        return processedConversation;
      }
    } catch (error) {
      console.error('Error loading conversation from localStorage:', error);
    }
    
    return [];
  };

  const clearConversation = async (characterId: string) => {
    if (!user) {
      // Just clear from local state if not logged in
      setConversations(prev => {
        const newConversations = { ...prev };
        delete newConversations[characterId];
        
        // Remove from localStorage
        try {
          localStorage.removeItem(`conversation_${characterId}`);
        } catch (error) {
          console.error('Error removing conversation from localStorage:', error);
        }
        
        return newConversations;
      });
      return;
    }
    
    // Clear from both local state and Supabase
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('user_id', user.id)
        .eq('character_id', characterId);
      
      if (error) {
        throw error;
      }
      
      setConversations(prev => {
        const newConversations = { ...prev };
        delete newConversations[characterId];
        
        // Also remove from localStorage
        try {
          localStorage.removeItem(`conversation_${characterId}`);
        } catch (error) {
          console.error('Error removing conversation from localStorage:', error);
        }
        
        return newConversations;
      });
      
      toast({
        title: 'Conversation cleared',
        description: 'Your conversation has been deleted',
      });
    } catch (error) {
      console.error('Error clearing conversation from Supabase:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear conversation',
        variant: 'destructive',
      });
    }
  };

  return (
    <ConversationContext.Provider 
      value={{ 
        conversations, 
        addMessage, 
        getConversation, 
        clearConversation,
        activeCharacter,
        setActiveCharacter,
        isLoading
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};
