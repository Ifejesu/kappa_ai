
import Navbar from '../components/layout/Navbar';
import CharacterSelection from '../components/CharacterSelection';

const Characters = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <CharacterSelection />
      </div>
    </div>
  );
};

export default Characters;
