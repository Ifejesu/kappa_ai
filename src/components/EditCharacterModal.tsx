
import { useState, useEffect } from 'react';
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
import { Character } from './CharacterCard';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useCharacter } from '../context/CharacterContext';

interface EditCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
}

const EditCharacterModal: React.FC<EditCharacterModalProps> = ({ 
  isOpen, 
  onClose, 
  character 
}) => {
  const [name, setName] = useState(character.name);
  const [description, setDescription] = useState(character.description);
  const [personality, setPersonality] = useState(character.personality);
  const [imageUrl, setImageUrl] = useState(character.imageSrc);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { refreshCharacters } = useCharacter();
  
  // Update form values when character changes
  useEffect(() => {
    if (isOpen) {
      setName(character.name);
      setDescription(character.description);
      setPersonality(character.personality);
      setImageUrl(character.imageSrc);
    }
  }, [character, isOpen]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to edit characters",
        variant: "destructive"
      });
      return;
    }
    
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
      const { error } = await supabase
        .from('characters')
        .update({
          name,
          description,
          personality,
          image_url: imageUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
          updated_at: new Date().toISOString()
        })
        .eq('id', character.id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Character updated",
        description: `${name} has been updated successfully`,
      });
      
      await refreshCharacters();
      onClose();
    } catch (error) {
      console.error('Error updating character:', error);
      toast({
        title: "Error",
        description: "Failed to update character",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Character</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input 
              id="edit-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Character name"
              maxLength={50}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea 
              id="edit-description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your character"
              maxLength={500}
              required
              className="resize-none min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-personality">Personality Traits</Label>
            <Input 
              id="edit-personality" 
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
            <Label htmlFor="edit-imageUrl">Image URL</Label>
            <Input 
              id="edit-imageUrl" 
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCharacterModal;
