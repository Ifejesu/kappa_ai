
import {useContext, useState} from 'react';
import CharacterCard from './CharacterCard';
import { useCharacter } from '../context/CharacterContext';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {AuthContext, useAuth} from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateCharacterModal from './CreateCharacterModal';
import { useToast } from '@/components/ui/use-toast';

const CharacterSelection = () => {
  const { defaultCharacters, userCharacters, isLoading } = useCharacter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Combine default and user characters
  const allCharacters = [...defaultCharacters, ...userCharacters];

  const filteredCharacters = allCharacters.filter(character => 
    character.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    character.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.personality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClick = () => {
    if (!user.username) {
      toast({
        title: "Authentication required",
        description: "Please log in to create custom characters",
        variant: "default"
      });
      navigate('/auth');
      return;
    }
    
    setIsCreateModalOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Choose Your Conversation Partner</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select a character that resonates with you and start a meaningful conversation.
          Each character has a unique personality and perspective.
        </p>
      </div>
      
      <div className="flex justify-center mb-8">
        <Button 
          onClick={handleCreateClick}
          className="group flex items-center gap-2"
          variant="outline"
        >
          <PlusCircle size={18} className="group-hover:text-primary transition-colors" />
          <span>Create Custom Character</span>
        </Button>
      </div>
      
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {userCharacters.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-medium mb-4 border-b pb-2">Your Custom Characters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {userCharacters.filter(character => 
                  character.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  character.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  character.personality.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((character) => (
                  <CharacterCard 
                    key={character.id} 
                    character={character} 
                    className="animate-slide-up"
                    isCustom={true}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-medium mb-4 border-b pb-2">Available Characters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {defaultCharacters.filter(character => 
                character.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                character.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                character.personality.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((character) => (
                <CharacterCard 
                  key={character.id} 
                  character={character} 
                  className="animate-slide-up"
                  isCustom={false}
                />
              ))}
            </div>
          </div>
          
          {filteredCharacters.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No characters match your search.</p>
            </div>
          )}
        </>
      )}
      
      {/* Create Character Modal */}
      <CreateCharacterModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default CharacterSelection;
