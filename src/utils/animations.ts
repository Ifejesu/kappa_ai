
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const slideIn = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const pulseAnimation = {
  scale: [1, 1.02, 1],
  transition: { duration: 1.5, repeat: Infinity }
};

export const typewriter = (text: string) => {
  return {
    hidden: { width: '0%' },
    visible: {
      width: '100%',
      transition: {
        duration: text.length * 0.05,
        ease: 'linear'
      }
    }
  };
};
