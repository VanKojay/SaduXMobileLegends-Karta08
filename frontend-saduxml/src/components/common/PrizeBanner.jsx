// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

const PrizeBanner = () => {
  const prizes = [
    {
      place: '1st',
      amount: '25 Juta',
      icon: Crown,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      delay: 0.2,
    },
    {
      place: '2nd',
      amount: '15 Juta',
      icon: Medal,
      color: 'from-gray-300 to-gray-400',
      bgColor: 'bg-gray-400/10',
      borderColor: 'border-gray-400/30',
      textColor: 'text-gray-300',
      delay: 0.4,
    },
    {
      place: '3rd',
      amount: '10 Juta',
      icon: Award,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      delay: 0.6,
    },
  ];

  return (
    <div className="relative w-full">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent rounded-2xl"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full mb-4"
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
              Prize Pool
            </span>
          </motion.div>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-2">
            Total Hadiah
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
              50 Juta Rupiah
            </span>
          </h3>
          <p className="text-gray-400 text-sm">Dibagi untuk 3 juara terbaik</p>
        </div>

        {/* Prize Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {prizes.map((prize, index) => {
            const Icon = prize.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: prize.delay }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className={`relative ${prize.bgColor} ${prize.borderColor} border-2 rounded-2xl p-6 backdrop-blur-sm overflow-hidden group`}
              >
                {/* Background Glow Effect */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute inset-0 bg-gradient-to-br ${prize.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity`}
                />

                {/* Content */}
                <div className="relative z-10 text-center space-y-4">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${prize.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                  </motion.div>

                  {/* Place */}
                  <div>
                    <div className={`text-sm font-bold ${prize.textColor} uppercase tracking-wider mb-1`}>
                      {prize.place} Place
                    </div>
                    <div className="text-3xl font-black text-white">
                      {prize.amount}
                    </div>
                  </div>

                  {/* Decoration Line */}
                  <div className={`h-1 w-16 mx-auto bg-gradient-to-r ${prize.color} rounded-full`}></div>
                </div>

                {/* Corner Decoration */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${prize.color} opacity-10 rounded-bl-full`}></div>
                <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${prize.color} opacity-10 rounded-tr-full`}></div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-sm">
              Hadiah akan ditransfer maksimal 7 hari setelah final
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrizeBanner;
