
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCharacter } from '../context/CharacterContext';
import EditCharacterModal from './EditCharacterModal';

export interface Character {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  personality: string;
}

interface CharacterCardProps {
  character: Character;
  className?: string;
  isCustom?: boolean;
}

export const DefaultCharacters: Character[] = [
  {
    id: "sophia12345ai",
    name: "Sophia",
    description:
        "AI Assistant with a philosophical mind that encourages deep thinking and introspection.",
    imageSrc: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80",
    personality:
        "Thoughtful, wise, patient",
  },
  {
    id: "leo12345ai",
    name: "Leo",
    description:
        "A creative spirit to inspire your artistic endeavors and imagination.",
    imageSrc: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80",
    personality:
        "Creative, enthusiastic, inspiring",
  },
  {
    id: "alex12345ai",
    name: "Alex",
    description:
        "AI Assistant and motivational coach to help you achieve your goals and stay focused.",
    imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
    personality: "Motivating, direct, supportive",
  },
  {
    id: "jamie12345ai",
    name: "Jamie",
    description:
        "AI Assistant and friendly companion for everyday conversations and light-hearted chats.",
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
    personality:
        "Friendly, warm, attentive",
  },
  {
    id: "morgan12345ai",
    name: "Morgan",
    description:
        "AI Assistant and practical advisor for problem-solving and strategic thinking.",
    imageSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
    personality:
        "Analytical, clear, practical",
  },
  {
    id: "harper12345ai",
    name: "Harper",
    description:
        "AI Assistant and history enthusiast with knowledge spanning various periods and cultures.",
    imageSrc: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80.",
    personality:
        "Knowledgeable, detailed, curious",
  },
];


const CharacterCard: React.FC<CharacterCardProps> = ({ character, className = '', isCustom = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const { deleteCharacter } = useCharacter();

  const handleStartConversation = () => {
    navigate(`/conversation/${character.id}`);
  };

  const handleDelete = async () => {
    const success = await deleteCharacter(character.id);
    if (success) {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div 
        className={`relative overflow-hidden group rounded-xl transition-all-300 shadow-subtle hover:shadow-elevated ${
          className
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-[320px] overflow-hidden">
          <img 
            src={character.imageSrc} 
            alt={character.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            onError={(e) => {
              // Fallback image if the original fails to load
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80';
            }}
          />
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-80' : 'opacity-70'
            }`}
          ></div>
          
          {/* Custom character controls */}
          {isCustom && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditModalOpen(true);
                }}
              >
                <Edit size={14} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-white/90 hover:bg-white text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-xl font-semibold mb-1">{character.name}</h3>
              <p className="text-sm text-white/80 line-clamp-2 mb-3">{character.description}</p>
            </div>
          </div>

          <button
            onClick={handleStartConversation}
            className="w-full py-2.5 px-4 bg-white text-gray-900 rounded-lg font-medium transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/20 mt-2"
          >
            Start Conversation
          </button>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {character.name} and all associated conversations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Character Modal */}
      <EditCharacterModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        character={character}
      />
    </>
  );
};

export default CharacterCard;
