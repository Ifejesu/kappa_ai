
import { useEffect, useState } from 'react';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  characterId?: string;
}

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isTyping = false }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const isAi = message.sender === 'ai';
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  // Simulate typing effect for AI messages
  useEffect(() => {
    if (isAi && !isComplete) {
      let index = 0;
      const content = message.content;
      
      const typingInterval = setInterval(() => {
        if (index <= content.length) {
          setDisplayedContent(content.slice(0, index));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsComplete(true);
        }
      }, 15); // Speed of typing
      
      return () => clearInterval(typingInterval);
    } else if (!isAi) {
      setDisplayedContent(message.content);
      setIsComplete(true);
    }
  }, [message.content, isAi, isComplete]);

  return (
    <div 
      className={`flex w-full max-w-full ${isAi ? 'justify-start' : 'justify-end'} mb-4 animate-slide-in`}
    >
      <div 
        className={`
          relative px-4 py-3 rounded-2xl max-w-[80%] sm:max-w-[70%] 
          ${isAi 
            ? 'bg-secondary text-secondary-foreground mr-auto rounded-bl-none' 
            : 'bg-primary text-primary-foreground ml-auto rounded-br-none'
          }
        `}
      >
        <div className="relative">
          {isAi ? (
            isComplete ? displayedContent : (
              <>
                {displayedContent}
                {isTyping && <span className="ml-1 inline-block animate-pulse">...</span>}
              </>
            )
          ) : (
            displayedContent
          )}
        </div>
        <div 
          className={`
            text-[10px] mt-1.5 opacity-70 
            ${isAi ? 'text-right' : 'text-left'}
          `}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
