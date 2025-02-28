
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-5 animate-fade-in">
                AI-Powered Conversations
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 animate-slide-up">
                Meaningful Conversations, <br/>
                <span className="text-primary">Anytime, Anywhere</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                KappaAI connects you with AI-powered characters, each with unique personalities and perspectives. 
                From philosophical discussions to creative brainstorming, find the perfect conversation partner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link 
                  to="/characters" 
                  className="px-8 py-3 font-medium bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-colors"
                >
                  Meet Characters
                </Link>
                <Link 
                  to="/about"
                  className="px-8 py-3 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-elevated overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" 
                    alt="AI Conversation" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose KappaAI</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform offers a unique experience tailored to your conversational needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-subtle">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                  <path d="M17 6.1H3M21 12.1H3M17 18.1H3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Diverse Characters</h3>
              <p className="text-muted-foreground">
                Choose from a variety of AI characters with unique personalities and expertise.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-subtle">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                  <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                  <path d="M17 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                  <path d="M21 20a8 8 0 0 0-16 0"></path>
                  <path d="M16.8 20c-.5-1.7-1.5-3-2.8-3s-2.3 1.3-2.8 3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Meaningful Exchange</h3>
              <p className="text-muted-foreground">
                Engage in deep, thoughtful conversations that adapt to your interests.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-subtle">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                  <path d="M7 20.6599L13.0349 14.625M21 7L13.0349 14.625M7 7L12.5 12.5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessible Anytime</h3>
              <p className="text-muted-foreground">
                Access your conversations anywhere, with persistent history across sessions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start a Conversation?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore a world of meaningful interactions with our diverse AI characters.
            Each conversation is unique, personalized, and available whenever you need it.
          </p>
          <Link 
            to="/characters" 
            className="inline-block px-8 py-3 font-medium bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-colors"
          >
            Meet Our Characters
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
