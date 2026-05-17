import { useState, useEffect, useRef } from 'react';
import {
  Facebook,
  Instagram,
  Send,
  Phone,
  PhoneCall,
  Copy,
  Check,
  MessageCircle,
  ChevronDown,
  Sparkles,
  Globe,
  ExternalLink
} from 'lucide-react';

// Particle Background Component - Optimized for mobile
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let isRunning = true;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      // Fewer particles on mobile for better performance
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? Math.floor(window.innerWidth / 20) : Math.floor(window.innerWidth / 15);

      for (let i = 0; i < particleCount; i++) {
        const hue = Math.random() > 0.5 ? 190 : 280;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          hue,
          alpha: Math.random() * 0.5 + 0.3,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01
        });
      }
    };

    const animate = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += particle.pulseSpeed;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        const pulseAlpha = particle.alpha + Math.sin(particle.pulse) * 0.2;

        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 60%, ${pulseAlpha})`);
        gradient.addColorStop(0.5, `hsla(${particle.hue}, 100%, 50%, ${pulseAlpha * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${pulseAlpha + 0.2})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    // Pause animation when tab is hidden for better battery life
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isRunning = true;
        animate();
      }
    });

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

// Typing Animation Component
const TypingText = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex <= text.length) {
          setDisplayText(text.slice(0, charIndex + 1));
          charIndex++;
          if (charIndex === text.length) {
            clearInterval(typingInterval);
          }
        }
      }, 100);

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-blink border-r-2 border-neon-blue ml-1">&nbsp;</span>
    </span>
  );
};

// Avatar Component - Responsive
const Avatar = () => (
  <div className="relative">
    <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple p-1 animate-pulse-glow mx-auto">
      <div className="w-full h-full rounded-full bg-dark-card flex items-center justify-center">
        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
          MA
        </span>
      </div>
    </div>
    <div className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center shadow-lg shadow-neon-blue/50">
      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = () => (
  <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
    <span className="w-2.5 h-2.5 rounded-full bg-neon-blue animate-pulse shadow-lg shadow-neon-blue/50"></span>
    <span className="text-xs sm:text-sm text-gray-400 font-medium">Available for projects</span>
  </div>
);

// Social Button Component - Mobile Optimized
const SocialButton = ({ href, icon: Icon, label, color, glowColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`
      group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl
      bg-white/5 backdrop-blur-xl border border-white/10
      transition-all duration-300 ease-out
      active:scale-[0.98]
      hover:translate-y-[-2px] hover:scale-[1.01]
      hover:border-white/20
      touch-manipulation
    `}
    style={{
      boxShadow: `0 0 20px ${glowColor}40, inset 0 0 20px ${glowColor}10`,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = `0 0 40px ${glowColor}60, 0 0 60px ${glowColor}30, inset 0 0 30px ${glowColor}15`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = `0 0 20px ${glowColor}40, inset 0 0 20px ${glowColor}10`;
    }}
  >
    <div
      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, ${color}30, ${color}10)`,
        boxShadow: `0 0 20px ${color}40`
      }}
    >
      <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-base sm:text-lg font-semibold text-white truncate">{label}</h3>
      <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
        <span>Click to visit</span>
        <ExternalLink className="w-3 h-3" />
      </p>
    </div>
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors flex-shrink-0">
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </a>
);

// WhatsApp Button Component - Mobile Optimized
const WhatsAppButton = ({ phone, label }) => {
  const [copied, setCopied] = useState(false);
  const whatsappUrl = `https://wa.me/2${phone.replace(/\D/g, '')}?text=Hello%20Mustafa!`;

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`+2${phone.replace(/\D/g, '')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppClick = (e) => {
    // Immediate feedback
    e.currentTarget.style.transform = 'scale(0.98)';
    setTimeout(() => {
      e.currentTarget.style.transform = '';
    }, 150);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 active:scale-[0.98]"
      style={{
        boxShadow: '0 0 30px rgba(37, 211, 102, 0.3), inset 0 0 20px rgba(37, 211, 102, 0.1)'
      }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="flex-1 flex items-center gap-3 sm:gap-4 touch-manipulation"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-whatsapp-green/20 flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 0 20px rgba(37, 211, 102, 0.4)' }}>
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-whatsapp-green" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-white truncate">{label}</h3>
            <p className="text-sm text-gray-400 font-mono">+2{phone}</p>
          </div>
        </a>
        <button
          onClick={handleCopy}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 active:scale-95 flex items-center justify-center touch-manipulation"
          aria-label="Copy phone number"
        >
          {copied ? (
            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-whatsapp-green" />
          ) : (
            <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
          )}
        </button>
      </div>
      {copied && (
        <div className="absolute top-2 right-2 px-3 py-1.5 rounded-full bg-whatsapp-green/20 text-whatsapp-green text-xs font-semibold backdrop-blur-sm animate-pulse">
          Copied!
        </div>
      )}
    </div>
  );
};

// Phone Contact Component - Mobile Optimized
const PhoneContact = ({ phone, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCall = () => {
    window.location.href = `tel:+2${phone.replace(/\D/g, '')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`+2${phone.replace(/\D/g, '')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 active:scale-[0.98]"
      style={{
        boxShadow: '0 0 20px rgba(0, 212, 255, 0.2), inset 0 0 20px rgba(0, 212, 255, 0.05)'
      }}
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neon-blue/20 flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)' }}>
            <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-neon-blue" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-white truncate">{label}</h3>
            <p className="text-sm text-gray-400 font-mono">+2{phone}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleCall}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl transition-all duration-200 active:scale-95 touch-manipulation"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 212, 255, 0.15))',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
            }}
            aria-label="Call phone number"
          >
            <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 text-neon-blue mx-auto" />
          </button>
          <button
            onClick={handleCopy}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 active:scale-95 relative touch-manipulation"
            aria-label="Copy phone number"
          >
            {copied ? (
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-neon-blue mx-auto" />
            ) : (
              <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mx-auto" />
            )}
            {copied && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-neon-blue/20 text-neon-blue text-xs font-semibold whitespace-nowrap animate-fade-in">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, subtitle, gradient }) => (
  <div className="text-center mb-8 sm:mb-12">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
      <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${gradient})` }}>
        {title}
      </span>
    </h2>
    <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-400">{subtitle}</p>
  </div>
);

// Main App Component
function App() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    const heroHeight = window.innerHeight;
    window.scrollTo({
      top: heroHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-dark-void relative overflow-hidden font-inter pb-safe">
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
        <div className={`relative z-10 text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Avatar />

          <h1 className="mt-6 sm:mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-violet to-neon-purple neon-text-blue">
              <TypingText text="Mustafa Ayman" delay={500} />
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-400 max-w-md mx-auto px-4">
            Creative Developer & Digital Innovator
          </p>

          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-gray-500">
            <Globe className="w-4 h-4" />
            <span className="text-sm sm:text-base">Egypt</span>
          </div>

          <div className="mt-8 sm:mt-10">
            <StatusBadge />
          </div>
        </div>

        <button
          onClick={scrollToContent}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 animate-bounce touch-manipulation"
          aria-label="Scroll to content"
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
        </button>
      </section>

      {/* Social Links Section */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 max-w-2xl sm:max-w-3xl mx-auto">
        <div className={`transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SectionHeader
            title="Connect With Me"
            subtitle="Follow my journey across social media"
            gradient="from-neon-blue to-neon-purple"
          />
        </div>

        <div className={`space-y-3 sm:space-y-4 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SocialButton
            href="https://www.facebook.com/profile.php?id=100065113174196"
            icon={Facebook}
            label="Facebook"
            color="#1877F2"
            glowColor="#1877F2"
          />
          <SocialButton
            href="https://www.instagram.com/mustafaaymanborayk?igsh=MW1zaWFubnI1amczaA=="
            icon={Instagram}
            label="Instagram"
            color="#E4405F"
            glowColor="#E4405F"
          />
          <SocialButton
            href="https://t.me/killattacks"
            icon={Send}
            label="Telegram"
            color="#0088cc"
            glowColor="#0088cc"
          />
        </div>
      </section>

      {/* WhatsApp Section */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 max-w-2xl sm:max-w-3xl mx-auto">
        <div className={`transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SectionHeader
            title="Chat on WhatsApp"
            subtitle="Send me a message directly"
            gradient="from-whatsapp-green to-emerald-500"
          />
        </div>

        <div className={`space-y-3 sm:space-y-4 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <WhatsAppButton phone="01114401651" label="WhatsApp Primary" />
          <WhatsAppButton phone="01127711208" label="WhatsApp Secondary" />
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 max-w-2xl sm:max-w-3xl mx-auto">
        <div className={`transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SectionHeader
            title="Contact Me"
            subtitle="Let's talk about your project"
            gradient="from-neon-blue to-neon-purple"
          />
        </div>

        <div className={`space-y-3 sm:space-y-4 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <PhoneContact phone="01114401651" label="Phone Line 1" />
          <PhoneContact phone="01127711208" label="Phone Line 2" />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 py-8 sm:py-10 border-t border-white/10">
        <div className="max-w-2xl sm:max-w-3xl mx-auto text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Mustafa Ayman. Crafted with
            <span className="text-neon-blue mx-1">&#10003;</span>
            and passion.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
