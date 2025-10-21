// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Trophy, Zap, Star, Sparkles, Crown, Swords } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Main Banner Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-800">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'linear-gradient(45deg, rgba(6, 182, 212, 0.3) 25%, transparent 25%, transparent 75%, rgba(6, 182, 212, 0.3) 75%, rgba(6, 182, 212, 0.3)), linear-gradient(45deg, rgba(6, 182, 212, 0.3) 25%, transparent 25%, transparent 75%, rgba(6, 182, 212, 0.3) 75%, rgba(6, 182, 212, 0.3))',
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0, 30px 30px',
            }}
          />
        </div>

        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        {/* Content Container */}
        <div className="relative px-8 py-12 md:px-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
                <span className="text-white text-xs font-bold uppercase tracking-wider">
                  Grand Tournament 2025
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">
                  Raih Glory
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400">
                    Hadiah 50 Juta!
                  </span>
                </h2>
                <p className="text-cyan-100 text-lg">
                  Buktikan skill terbaikmu di arena kompetisi Mobile Legends paling bergengsi
                </p>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-6"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-yellow-400/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-yellow-400/30">
                    <Trophy className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">100+</div>
                    <div className="text-cyan-200 text-xs">Teams</div>
                  </div>
                </div>

                <div className="w-px h-12 bg-white/20"></div>

                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-green-400/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-green-400/30">
                    <Zap className="w-5 h-5 text-green-300" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">Live</div>
                    <div className="text-cyan-200 text-xs">Streaming</div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white hover:bg-yellow-300 text-gray-900 rounded-xl font-bold shadow-xl shadow-black/20 transition-colors"
                >
                  <Crown className="w-5 h-5" />
                  <span>Join Tournament</span>
                </motion.button>
              </motion.div>
            </div>

            {/* Right Side - Visual Elements */}
            <div className="relative hidden md:block">
              {/* Center Trophy */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10"
              >
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50">
                  <Trophy className="w-24 h-24 text-white" strokeWidth={1.5} />
                </div>

                {/* Glow Ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl"
                />
              </motion.div>

              {/* Floating Icons */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                className="absolute top-0 right-0 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20"
              >
                <Star className="w-8 h-8 text-yellow-300" fill="currentColor" />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -10, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20"
              >
                <Swords className="w-8 h-8 text-cyan-300" />
              </motion.div>

              {/* Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.5,
                  }}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  style={{
                    top: `${20 + i * 10}%`,
                    left: `${30 + (i % 3) * 20}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-yellow-400 to-purple-400"></div>
      </motion.div>

      {/* Outer Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10 scale-105"></div>
    </div>
  );
};

export default HeroBanner;
