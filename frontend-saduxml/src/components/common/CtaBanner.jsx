// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Users, Trophy } from 'lucide-react';

const CtaBanner = ({ onRegisterClick }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"
          style={{
            backgroundSize: '200% 200%',
          }}
        />
        
        {/* Overlay Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}></div>
        </div>

        {/* Glow Effects */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 py-16 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="w-4 h-4 text-yellow-300" fill="currentColor" />
                </motion.div>
                <span className="text-white text-xs font-bold uppercase tracking-wider">
                  Limited Slots Available
                </span>
              </motion.div>

              {/* Title */}
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                  Jangan Lewatkan
                  <br />
                  <span className="text-yellow-300">Kesempatan Emas!</span>
                </h2>
                <p className="text-white/90 text-lg">
                  Daftar sekarang dan buktikan bahwa tim kamu adalah yang terbaik. Slot terbatas!
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold">70 Slot</div>
                    <div className="text-white/70 text-xs">Tersisa</div>
                  </div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <div className="text-white font-bold">50 Juta</div>
                    <div className="text-white/70 text-xs">Total Prize</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={onRegisterClick}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-white hover:bg-yellow-300 text-gray-900 rounded-xl font-bold text-lg shadow-2xl shadow-black/30 transition-colors group"
              >
                <span>Daftar Sekarang</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Right Side - Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block relative"
            >
              {/* Countdown Timer Visual (Decorative) */}
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 border-4 border-dashed border-white/30 rounded-full"
                />
                
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl font-black text-white"
                    >
                      70
                    </motion.div>
                    <div className="text-white/90 text-lg font-semibold">
                      Slot Tersisa
                    </div>
                    <div className="h-1 w-20 mx-auto bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"></div>
                    <div className="text-white/70 text-sm">
                      Dari 100 Tim
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <Zap className="w-8 h-8 text-white" fill="currentColor" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 15, 0],
                    rotate: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <Trophy className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
    </div>
  );
};

export default CtaBanner;
