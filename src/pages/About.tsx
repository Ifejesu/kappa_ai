
import Navbar from '../components/layout/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About KappaAI</h1>
          <p className="text-lg text-muted-foreground">
            Connecting humans with AI for meaningful conversations
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-subtle p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            KappaAI was created to address a fundamental human need: meaningful conversation. 
            In today's fast-paced world, people often find themselves isolated, whether physically 
            or emotionally, without access to the kind of interactions that enrich our lives and 
            broaden our perspectives.
          </p>
          <p className="text-muted-foreground mb-6">
            We believe that AI can play a vital role in meeting this need, not by replacing human 
            connection, but by supplementing it. Our platform provides access to diverse AI characters, 
            each designed to offer unique conversational experiences that can inspire, comfort, 
            challenge, or simply entertain.
          </p>
          <p className="text-muted-foreground">
            Whether you're seeking philosophical discourse, creative inspiration, or just a friendly 
            chat, KappaAI is designed to be available whenever and wherever you need it.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-subtle p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-semibold">1</span>
              </div>
              <h3 className="font-medium mb-2">Choose a Character</h3>
              <p className="text-sm text-muted-foreground">
                Browse our selection of AI characters, each with unique personalities and areas of interest.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-semibold">2</span>
              </div>
              <h3 className="font-medium mb-2">Start Conversing</h3>
              <p className="text-sm text-muted-foreground">
                Engage in natural, text-based conversations that adapt to your interests and questions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-semibold">3</span>
              </div>
              <h3 className="font-medium mb-2">Save Your History</h3>
              <p className="text-sm text-muted-foreground">
                Your conversations are saved, allowing you to continue where you left off in future sessions.
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            Our advanced AI system ensures that conversations feel natural and engaging. While no AI 
            can truly replace human interaction, our characters are designed to provide meaningful 
            conversational experiences that evolve over time as they learn from your interactions.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-subtle p-8">
          <h2 className="text-2xl font-semibold mb-4">Privacy & Ethics</h2>
          <p className="text-muted-foreground mb-6">
            At KappaAI, we take privacy and ethical considerations seriously. All conversations 
            are private and securely stored. We do not use your conversations for training our AI 
            without explicit consent, and you can delete your conversation history at any time.
          </p>
          <p className="text-muted-foreground">
            Our AI characters are designed to be helpful, engaging, and respectful. They adhere to 
            strict ethical guidelines and are continuously improved to ensure they provide positive 
            and beneficial interactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
