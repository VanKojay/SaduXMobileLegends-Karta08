import { useState } from 'react';
import { Trophy, ChevronDown, ChevronUp, Sparkles, Shield, Users, Phone, MapPin } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
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

  

  // FAQ Data
  const faqs = [
    {
      question: 'Apa syarat peserta?',
      answer: 'Usia minimal 15 tahun, warga RW 08 Griya Alam Sentosa, membawa fotokopi KK/KTP (atau surat domisili bila belum punya), gunakan akun utama pribadi, dan satu orang hanya boleh terdaftar di satu tim.',
    },
    {
      question: 'Bagaimana cara mendaftar?',
      answer: 'Hubungi salah satu contact person (Septian, Bayu, atau Nisa) untuk mendaftarkan tim dan konfirmasi data anggota.',
    },
    {
      question: 'Bagaimana komposisi tim?',
      answer: 'Setiap tim berisi 5 pemain utama dan maksimal 2 pemain cadangan. Total maksimal 7 orang.',
    },
    {
      question: 'Apa saja aturan teknis penting?',
      answer: 'Dilarang mengganti pemain tanpa izin panitia, menggunakan emulator (wajib perangkat mobile), serta segala bentuk kecurangan. Pelanggaran berakibat diskualifikasi; keputusan wasit & juri bersifat final.',
    },
    {
      question: 'Perlengkapan apa yang perlu dibawa?',
      answer: 'Masing-masing pemain membawa HP/tablet dan koneksi internet stabil.',
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
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="grid md:grid-cols-12 gap-8 items-center">
              {/* Left: Text & CTA */}
              <div className="md:col-span-7 text-center md:text-left space-y-6">
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
                  <span>Turnamen RW 08</span>
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
                    Turnamen Mobile Legend RW 08
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
                    Griya Alam Sentosa, Cileungsi
                  </motion.span>
                </motion.h1>

                {/* Subtitle dihilangkan agar tidak duplikatif dengan chips */}

                {/* CTA Button dengan hover effect */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="pt-2"
                >
                  <a
                    href="#contact"
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-base font-bold shadow-lg shadow-cyan-500/30 transition-all"
                  >
                    <Trophy className="w-5 h-5" />
                    <span>Daftar Tim Sekarang</span>
                  </a>
                </motion.div>

                {/* Chips: Lokasi & Penyelenggara */}
                <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start text-xs">
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/80">
                    <MapPin className="w-4 h-4 text-cyan-300" />
                    <span>Pasir Angin, Cileungsi</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/80">
                    <Users className="w-4 h-4 text-cyan-300" />
                    <span>Penyelenggara RW 08 GAS</span>
                  </div>
                </div>
              </div>
              {/* Right: Glass Card - Aturan Kunci */}
              <div className="md:col-span-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="relative rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 overflow-hidden"
                >
                  <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-cyan-500/20 blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl" />
                  <div className="relative">
                    <div className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-2">Aturan Kunci</div>
                    <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5">
                      <li>Dilarang menggunakan emulator (wajib perangkat mobile)</li>
                      <li>Tanpa kecurangan: pinjam akun, cheat, unsportsmanship</li>
                      <li>Keputusan wasit & juri bersifat final</li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
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

        {/* INFO TURNAMEN dengan Stagger Animation - Mosaik 12 kolom */}
        <section id="info" className="relative py-16 border-t border-gray-800/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* LOKASI - span 7 */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -6, rotate: -0.3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="md:col-span-7 bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-400/30 rounded-2xl p-6 transition-all shadow-[inset_0_0_0_1px_rgba(6,182,212,.1)]"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">LOKASI</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-white font-semibold">Pasir Angin, Cileungsi, Bogor 16820</p>
                  <p className="text-gray-400">Penyelenggara: Pemuda/i Warga RW 08 Griya Alam Sentosa</p>
                </div>
              </motion.div>

              {/* KOMPOSISI TIM - span 5 */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -6, rotate: 0.3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="md:col-span-5 bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-400/30 rounded-2xl p-6 transition-all"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">KOMPOSISI TIM</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-semibold">5 pemain utama</p>
                  <p className="text-gray-400">Maksimal 2 pemain cadangan</p>
                  <p className="text-gray-500 text-xs">Total maksimal: 7 orang</p>
                </div>
              </motion.div>

              {/* SYARAT - span 5 */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -6, rotate: 0.3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="md:col-span-5 bg-gradient-to-br from-green-500/10 to-transparent border border-green-400/30 rounded-2xl p-6 transition-all"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">SYARAT PESERTA</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-semibold">Usia minimum 15 tahun (seluruh anggota)</p>
                  <p className="text-gray-400">Warga RW 08 Griya Alam Sentosa</p>
                  <p className="text-gray-400">Dokumen: Fotokopi KK/KTP atau Surat Domisili (jika perlu)</p>
                  <p className="text-gray-500 text-xs">Akun utama pribadi · 1 orang hanya di 1 tim</p>
                </div>
              </motion.div>

              {/* ATURAN - span 7 */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ y: -6, rotate: -0.3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="md:col-span-7 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-400/30 rounded-2xl p-6 transition-all"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">ATURAN TEKNIS</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-semibold">Dilarang: ganti pemain tanpa izin, emulator, kecurangan</p>
                  <p className="text-gray-400">Konsekuensi: Diskualifikasi langsung</p>
                  <p className="text-gray-500 text-xs">Keputusan wasit & juri bersifat final</p>
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
                <span>Pendaftaran</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Cara Pendaftaran
              </h2>
              <p className="text-gray-400">Hubungi contact person untuk registrasi</p>
            </motion.div>

            {/* Timeline Alternating */}
            <div className="relative max-w-4xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-indigo-500/40 to-purple-500/40" />

              {/* Step 1 */}
              <motion.div 
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid md:grid-cols-2 gap-6 items-center mb-10"
              >
                <div className="md:pr-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 font-bold mb-3">1</div>
                  <h3 className="text-xl font-bold text-white mb-2">Siapkan Dokumen</h3>
                  <p className="text-sm text-gray-400">Fotokopi KK atau KTP. Jika pendatang/belum punya: Surat Keterangan Domisili (disahkan RT)</p>
                </div>
                <div className="hidden md:block" />
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid md:grid-cols-2 gap-6 items-center mb-10"
              >
                <div className="hidden md:block" />
                <div className="md:pl-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/20 border border-yellow-400/30 text-yellow-400 font-bold mb-3">2</div>
                  <h3 className="text-xl font-bold text-white mb-2">Hubungi Contact Person</h3>
                  <p className="text-sm text-gray-400">Hubungi CP yang tertera untuk pendaftaran tim dan konfirmasi data anggota</p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid md:grid-cols-2 gap-6 items-center"
              >
                <div className="md:pr-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-400/30 text-green-400 font-bold mb-3">3</div>
                  <h3 className="text-xl font-bold text-white mb-2">Konfirmasi Pendaftaran</h3>
                  <p className="text-sm text-gray-400">Panitia akan mengonfirmasi status pendaftaran tim melalui CP</p>
                </div>
                <div className="hidden md:block" />
              </motion.div>
            </div>

            {/* CTA di bagian ini dihapus untuk mengurangi duplikasi */}
          </div>
        </section>

        {/* Contact Person */}
        <section id="contact" className="relative py-16 border-t border-gray-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-400/30 rounded-full text-green-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <span>Contact Person</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Informasi Pendaftaran
              </h2>
              <p className="text-gray-400">Hubungi salah satu kontak berikut untuk registrasi tim</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Septian */}
              <div className="group bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-white font-bold">Septian</div>
                </div>
                <div className="flex items-center gap-2">
                  <a href="tel:+6289523549477" className="text-cyan-400 text-sm hover:underline">+62 895-2354-9477</a>
                </div>
              </div>
              {/* Bayu */}
              <div className="group bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-white font-bold">Bayu</div>
                </div>
                <div className="flex items-center gap-2">
                  <a href="tel:+6281310886501" className="text-cyan-400 text-sm hover:underline">+62 813-1088-6501</a>
                </div>
              </div>
              {/* Nisa */}
              <div className="group bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-white font-bold">Nisa</div>
                </div>
                <div className="flex items-center gap-2">
                  <a href="tel:+6285778243504" className="text-cyan-400 text-sm hover:underline">+62 857-7824-3504</a>
                </div>
              </div>
            </div>

            <div className="text-center mt-8 text-gray-400 text-sm">
              Bawa perlengkapan sendiri: HP/tablet + koneksi internet stabil
            </div>
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

        {/* Final CTA section dihapus untuk mengurangi duplikasi CTA */}

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
