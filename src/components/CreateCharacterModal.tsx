
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCharacter } from '../context/CharacterContext';
import { useToast } from '@/components/ui/use-toast';

interface CreateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCharacterModal: React.FC<CreateCharacterModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [personality, setPersonality] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createCharacter } = useCharacter();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !personality) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newCharacter = await createCharacter({
        name,
        description,
        personality,
        imageSrc: imageUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80' // Default image
      });
      
      if (newCharacter) {
        resetForm();
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setPersonality('');
    setImageUrl('');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Character</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Character name"
              maxLength={50}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your character"
              maxLength={500}
              required
              className="resize-none min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="personality">Personality Traits</Label>
            <Input 
              id="personality" 
              value={personality} 
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="e.g., Friendly, curious, intellectual"
              maxLength={100}
              required
            />
            <p className="text-xs text-muted-foreground">
              Describe your character's personality traits (comma separated)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input 
              id="imageUrl" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use a default image
            </p>
          </div>
          
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Character'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCharacterModal;
