
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Character } from '../components/CharacterCard';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface CharacterContextType {
  defaultCharacters: Character[];
  userCharacters: Character[];
  isLoading: boolean;
  createCharacter: (character: Omit<Character, 'id'>) => Promise<Character | null>;
  deleteCharacter: (characterId: string) => Promise<boolean>;
  refreshCharacters: () => Promise<void>;
}

// Sample character data
const sampleCharacters: Character[] = [
  {
    id: "philosopher",
    name: "Sophia",
    description: "A philosophical mind that encourages deep thinking and introspection.",
    imageSrc: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80",
    personality: "Thoughtful, wise, patient"
  },
  {
    id: "creative",
    name: "Leo",
    description: "A creative spirit to inspire your artistic endeavors and imagination.",
    imageSrc: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80",
    personality: "Creative, enthusiastic, inspiring"
  },
  {
    id: "coach",
    name: "Alex",
    description: "A motivational coach to help you achieve your goals and stay focused.",
    imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
    personality: "Motivating, direct, supportive"
  },
  {
    id: "friend",
    name: "Jamie",
    description: "A friendly companion for everyday conversations and light-hearted chats.",
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
    personality: "Friendly, warm, attentive"
  },
  {
    id: "advisor",
    name: "Morgan",
    description: "A practical advisor for problem-solving and strategic thinking.",
    imageSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
    personality: "Analytical, clear, practical"
  },
  {
    id: "historian",
    name: "Harper",
    description: "A history enthusiast with knowledge spanning various periods and cultures.",
    imageSrc: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80",
    personality: "Knowledgeable, detailed, curious"
  }
];

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [userCharacters, setUserCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserCharacters();
    } else {
      setUserCharacters([]);
    }
  }, [user]);

  const fetchUserCharacters = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Convert from Supabase format to Character format
      const characters: Character[] = data.map(char => ({
        id: char.id,
        name: char.name,
        description: char.description,
        personality: char.personality,
        imageSrc: char.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80', // Default image
      }));
      
      setUserCharacters(characters);
    } catch (error) {
      console.error('Error fetching user characters:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your characters',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCharacter = async (characterData: Omit<Character, 'id'>): Promise<Character | null> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please login to create characters',
        variant: 'destructive',
      });
      return null;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          name: characterData.name,
          description: characterData.description,
          personality: characterData.personality,
          image_url: characterData.imageSrc,
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newCharacter: Character = {
        id: data.id,
        name: data.name,
        description: data.description,
        personality: data.personality,
        imageSrc: data.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
      };
      
      setUserCharacters(prev => [...prev, newCharacter]);
      
      toast({
        title: 'Character created',
        description: `${newCharacter.name} has been created successfully`,
      });
      
      return newCharacter;
    } catch (error) {
      console.error('Error creating character:', error);
      toast({
        title: 'Error',
        description: 'Failed to create character',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCharacter = async (characterId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', characterId)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Also delete any associated conversations
      await supabase
        .from('conversations')
        .delete()
        .eq('character_id', characterId)
        .eq('user_id', user.id);
      
      setUserCharacters(prev => prev.filter(char => char.id !== characterId));
      
      toast({
        title: 'Character deleted',
        description: 'Character has been removed successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting character:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete character',
        variant: 'destructive',
      });
      return false;
    }
  };

  const refreshCharacters = async () => {
    await fetchUserCharacters();
  };

  return (
    <CharacterContext.Provider 
      value={{ 
        defaultCharacters: sampleCharacters,
        userCharacters,
        isLoading,
        createCharacter,
        deleteCharacter,
        refreshCharacters
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
