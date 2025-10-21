import { useState } from 'react';
import { Trophy, ChevronDown, ChevronUp, Sparkles, Calendar, Shield, Users } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import HeroBanner from '../components/common/HeroBanner';
import PrizeBanner from '../components/common/PrizeBanner';
import CtaBanner from '../components/common/CtaBanner';
import LoginModal from '../components/modals/LoginModal';
import RegisterModal from '../components/modals/RegisterModal';

const Landing = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Parallax scroll effect untuk hero
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  // FAQ Data
  const faqs = [
    {
      question: 'Bagaimana cara mendaftar turnamen?',
      answer: 'Klik tombol "Daftar Sekarang", isi form pendaftaran dengan data tim dan 5 anggota, lalu verifikasi email. Tunggu approval admin maksimal 24 jam.',
    },
    {
      question: 'Apakah ada biaya pendaftaran?',
      answer: 'Tidak ada biaya pendaftaran! Semua turnamen di platform SaduX gratis untuk diikuti.',
    },
    {
      question: 'Berapa jumlah minimal member dalam satu team?',
      answer: 'Minimal 5 member per team untuk turnamen Mobile Legends. Anda bisa menambahkan hingga 1 cadangan.',
    },
    {
      question: 'Bagaimana sistem bracket bekerja?',
      answer: 'Bracket akan di-generate otomatis setelah periode pendaftaran selesai. Anda bisa melihat bracket secara realtime di halaman Bracket dengan update otomatis via WebSocket.',
    },
    {
      question: 'Kapan jadwal turnamen dimulai?',
      answer: 'Pendaftaran dibuka 1-15 November 2025. Turnamen dimulai 25 November - 10 Desember 2025. Jadwal lengkap akan dikirim via email setelah approval.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A1428] relative overflow-hidden">
      {/* Animated Background dengan Parallax & Floating Particles */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1428] via-[#0f1e3d] to-[#0A1428]"></div>
        
        {/* Animated blur circles dengan parallax */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
        />
        
        {/* Floating particles */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/3 w-2 h-2 bg-cyan-400 rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/3 left-1/4 w-3 h-3 bg-yellow-400 rounded-full"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full"
        />
      </div>

      <Header
        onLoginClick={() => setIsLoginModalOpen(true)}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
      />

      <div className="relative z-10">
        {/* HERO SECTION dengan Animasi */}
        <section id="home" className="relative min-h-screen flex items-center justify-center py-20 pt-32">
          <motion.div 
            style={{ opacity }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="text-center space-y-6">
              {/* Badge dengan animasi rotate */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-400 text-xs font-semibold uppercase tracking-wider"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span>Official Tournament 2025</span>
              </motion.div>

              {/* Main Title dengan glow effect */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-6xl font-black leading-tight"
              >
                <motion.span 
                  className="block text-white mb-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  SaduX Mobile Legends
                </motion.span>
                <motion.span 
                  className="block text-cyan-400"
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(6, 182, 212, 0.3)",
                      "0 0 40px rgba(6, 182, 212, 0.5)",
                      "0 0 20px rgba(6, 182, 212, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Karta08 Championship
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
              >
                Platform turnamen ML terbaik. Daftar otomatis, live bracket realtime, hadiah 50 juta rupiah.
              </motion.p>

              {/* CTA Button dengan hover effect */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="pt-4"
              >
                <motion.button
                  onClick={() => setIsRegisterModalOpen(true)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-base font-bold shadow-lg shadow-cyan-500/30 transition-all"
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Trophy className="w-5 h-5" />
                  </motion.div>
                  <span>Daftar Sekarang</span>
                </motion.button>
              </motion.div>

              {/* Quick Stats dengan scale animation */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex items-center justify-center gap-8 pt-8 text-sm"
              >
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="text-2xl font-bold text-cyan-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
                  >
                    100+
                  </motion.div>
                  <div className="text-gray-500">Teams</div>
                </motion.div>
                <div className="w-px h-8 bg-gray-700"></div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="text-2xl font-bold text-yellow-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.4, type: "spring" }}
                  >
                    50Jt
                  </motion.div>
                  <div className="text-gray-500">Prize</div>
                </motion.div>
                <div className="w-px h-8 bg-gray-700"></div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="text-2xl font-bold text-green-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.6, type: "spring" }}
                  >
                    24/7
                  </motion.div>
                  <div className="text-gray-500">Support</div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Hero Banner - Tournament Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-16 px-4 sm:px-6 lg:px-8"
          >
            <HeroBanner />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ 
              opacity: { delay: 2 },
              y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="w-6 h-6 text-gray-600" />
          </motion.div>
        </section>

        {/* INFO TURNAMEN dengan Stagger Animation */}
        <section id="info" className="relative py-16 border-t border-gray-800/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {/* Card 1 */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -8, borderColor: "rgba(6, 182, 212, 0.5)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 transition-all"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center"
                  >
                    <Calendar className="w-5 h-5 text-cyan-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white">TANGGAL</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-semibold">1-15 November 2025</p>
                  <p className="text-gray-400">Pendaftaran dibuka</p>
                  <p className="text-gray-500 text-xs">Mulai jam 00:00 WIB</p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -8, borderColor: "rgba(234, 179, 8, 0.5)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 transition-all"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center"
                  >
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white">FORMAT</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-semibold">Single Elimination</p>
                  <p className="text-gray-400">Best of 3 (BO3)</p>
                  <p className="text-gray-500 text-xs">Draft pick mode</p>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -8, borderColor: "rgba(16, 185, 129, 0.5)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 transition-all"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center"
                  >
                    <Users className="w-5 h-5 text-green-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white">SLOT TIM</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-semibold">100 Tim Total</p>
                  <motion.p 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-yellow-400 font-semibold"
                  >
                    ⚡ Sisa 70 slot!
                  </motion.p>
                  <p className="text-gray-500 text-xs">Daftar sekarang</p>
                </div>
              </motion.div>

              {/* Card 4 */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -8, borderColor: "rgba(168, 85, 247, 0.5)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 transition-all"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center"
                  >
                    <Shield className="w-5 h-5 text-purple-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white">SYARAT</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-semibold">Rank Min: Epic III</p>
                  <p className="text-gray-400">Server: Indonesia</p>
                  <p className="text-gray-500 text-xs">5 pemain + 1 cadangan</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CARA PENDAFTARAN dengan Scale Animation */}
        <section id="how" className="relative py-16 border-t border-gray-800/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-400/30 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <span>How It Works</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Cara Pendaftaran
              </h2>
              <p className="text-gray-400">3 langkah mudah untuk bergabung</p>
            </motion.div>

            {/* Steps */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-6"
            >
              {/* Step 1 */}
              <motion.div 
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center space-y-3"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-xl border border-cyan-400/30"
                >
                  <span className="text-3xl font-black text-cyan-400">1</span>
                </motion.div>
                <h3 className="text-xl font-bold text-white">Isi Form</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Klik "Daftar Sekarang", isi data tim dengan 5 anggota dan ML ID masing-masing
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center space-y-3"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-xl border border-yellow-400/30"
                >
                  <span className="text-3xl font-black text-yellow-400">2</span>
                </motion.div>
                <h3 className="text-xl font-bold text-white">Verifikasi Email</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Cek inbox, klik link verifikasi yang dikirim otomatis untuk aktivasi akun
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center space-y-3"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-xl border border-green-400/30"
                >
                  <span className="text-3xl font-black text-green-400">3</span>
                </motion.div>
                <h3 className="text-xl font-bold text-white">Tunggu Approval</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Admin review data tim dan kirim konfirmasi via email dalam maksimal 24 jam
                </p>
              </motion.div>
            </motion.div>

            {/* CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-center mt-10"
            >
              <motion.button
                onClick={() => setIsRegisterModalOpen(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all"
              >
                <Trophy className="w-4 h-4" />
                <span>Mulai Daftar Sekarang</span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Prize Pool Banner */}
        <section className="relative py-16 border-t border-gray-800/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <PrizeBanner />
          </div>
        </section>

        {/* FAQ dengan Slide Animation */}
        <section id="faq" className="relative py-16 border-t border-gray-800/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-400/30 rounded-full text-green-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <span>FAQ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Pertanyaan Umum
              </h2>
              <p className="text-gray-400">Jawaban untuk pertanyaan yang sering ditanyakan</p>
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-3"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ x: 4, borderColor: "rgba(16, 185, 129, 0.3)" }}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <h3 className="text-base font-semibold text-white pr-4">{faq.question}</h3>
                    <motion.div
                      animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {openFaqIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </motion.div>
                  </button>
                  {openFaqIndex === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5"
                    >
                      <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="relative py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <CtaBanner onRegisterClick={() => setIsRegisterModalOpen(true)} />
          </div>
        </section>

        <Footer />
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </div>
  );
};

export default Landing;
