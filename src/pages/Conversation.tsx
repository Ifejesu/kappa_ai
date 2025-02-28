
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ConversationInterface from '../components/ConversationInterface';
import { Character } from '../components/CharacterCard';
import Navbar from '../components/layout/Navbar';
import { useCharacter } from '../context/CharacterContext';
import { useConversation } from '../context/ConversationContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';

const Conversation = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { defaultCharacters, userCharacters } = useCharacter();
  const { setActiveCharacter } = useConversation();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchCustomCharacter = async () => {
      if (!characterId || !user) {
        setIsLoading(false);
        return null;
      }
      
      // Check if this is a uuid format (custom character)
      if (characterId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        try {
          const { data, error } = await supabase
            .from('characters')
            .select('*')
            .eq('id', characterId)
            .eq('user_id', user.id)
            .single();
          
          if (error || !data) {
            return null;
          }
          
          return {
            id: data.id,
            name: data.name,
            description: data.description,
            personality: data.personality,
            imageSrc: data.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
          };
        } catch (error) {
          console.error('Error fetching custom character:', error);
          return null;
        }
      }
      
      return null;
    };
    
    const findCharacter = async () => {
      if (!characterId) {
        navigate('/characters');
        return;
      }
      
      setIsLoading(true);
      
      // First check in default characters
      let foundCharacter = defaultCharacters.find(c => c.id === characterId);
      
      // Then check in user characters from context
      if (!foundCharacter) {
        foundCharacter = userCharacters.find(c => c.id === characterId);
      }
      
      // If still not found, try fetching directly from the database
      if (!foundCharacter) {
        foundCharacter = await fetchCustomCharacter();
      }
      
      if (foundCharacter) {
        setCharacter(foundCharacter);
        setActiveCharacter(foundCharacter);
      } else {
        // Redirect to character selection if character not found
        navigate('/characters');
      }
      
      setIsLoading(false);
    };
    
    findCharacter();
    
    return () => {
      setActiveCharacter(null);
    };
  }, [characterId, defaultCharacters, userCharacters, user, navigate, setActiveCharacter]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!character) {
    return <div className="min-h-screen flex items-center justify-center">Character not found</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <div className="mb-6 flex items-center">
          <Link to="/characters" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-1" />
            Back to Characters
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-elevated overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[70vh]">
            {/* Character Info Panel (visible on larger screens) */}
            <div className="hidden md:block md:w-1/4 border-r">
              <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                    <img 
                      src={character.imageSrc} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback image if the original fails to load
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <h2 className="font-semibold text-lg">{character.name}</h2>
                  <p className="text-sm text-muted-foreground text-center">{character.personality}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">{character.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Conversation Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>Ask open-ended questions</li>
                    <li>Share your thoughts and experiences</li>
                    <li>Be specific when possible</li>
                    <li>Follow up on interesting topics</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Conversation Area */}
            <div className="flex-1">
              <ConversationInterface character={character} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
