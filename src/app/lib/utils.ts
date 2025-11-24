/**
 * Shortens an Ethereum address for display
 * @param address The full Ethereum address
 * @param chars Number of characters to show at start and end (default: 4)
 * @returns Shortened address in format 0x1234...5678
 */
export const shortenAddress = (address: string | null, chars = 4): string => {
  if (!address) return '';
  
  const prefix = address.slice(0, chars + 2); // +2 for '0x'
  const suffix = address.slice(-chars);
  
  return `${prefix}...${suffix}`;
};

/**
 * Format a number as currency
 */
export const formatCurrency = (value: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Format a date string or Date object into a human-readable date
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObject.getTime())) {
    return 'Invalid date';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObject);
};

/**
 * Truncates text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Creates a confetti animation effect
 * Simple implementation using DOM elements
 */
export const triggerConfetti = () => {
  if (typeof document === 'undefined') return;
  
  const confettiCount = 100;
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  
  const colors = ['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444'];
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    const size = Math.random() * 10 + 5;
    
    confetti.style.position = 'absolute';
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = '-20px';
    confetti.style.borderRadius = '50%';
    confetti.style.opacity = `${Math.random() * 0.7 + 0.3}`;
    container.appendChild(confetti);
    
    const animationDuration = Math.random() * 3 + 2;
    const xDirection = (Math.random() - 0.5) * 200;
    
    // Animate confetti falling
    confetti.animate(
      [
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${xDirection}px, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ],
      {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)',
        fill: 'forwards'
      }
    );
  }
  
  // Remove the container after all animations complete
  setTimeout(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, 5000);
}; 