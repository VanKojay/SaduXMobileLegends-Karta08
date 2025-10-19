import { useState } from 'react';
import { Trophy, ChevronDown, ChevronUp, Sparkles, Calendar, Shield, Users } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import LoginModal from '../components/modals/LoginModal';
import RegisterModal from '../components/modals/RegisterModal';

const Landing = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // FAQ Data - Essential questions only
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
      {/* Simple Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1428] via-[#0f1e3d] to-[#0A1428]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header Navigation */}
      <Header
        onLoginClick={() => setIsLoginModalOpen(true)}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
      />

      {/* Main Content - Full Width */}
      <div className="relative z-10">
        {/* ============================================ */}
        {/* SECTION 1: HERO - Clean & Focused */}
        {/* ============================================ */}
        <section id="home" className="relative min-h-screen flex items-center justify-center py-20 pt-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Official Tournament 2025</span>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-6xl font-black leading-tight">
                <span className="block text-white mb-2">SaduX Mobile Legends</span>
                <span className="block text-cyan-400">Karta08 Championship</span>
              </h1>

              {/* Subtitle - Concise */}
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                Platform turnamen ML terbaik. Daftar otomatis, live bracket realtime, hadiah 50 juta rupiah.
              </p>

              {/* Single Primary CTA */}
              <div className="pt-4">
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-base font-bold shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Daftar Sekarang</span>
                </button>
              </div>

              {/* Quick Stats - Compact with Dividers */}
              <div className="flex items-center justify-center gap-8 pt-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">100+</div>
                  <div className="text-gray-500">Teams</div>
                </div>
                <div className="w-px h-8 bg-gray-700"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">50Jt</div>
                  <div className="text-gray-500">Prize</div>
                </div>
                <div className="w-px h-8 bg-gray-700"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">24/7</div>
                  <div className="text-gray-500">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-gray-600" />
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 2: INFO TURNAMEN - 4 Cards */}
        {/* ============================================ */}
        <section id="info" className="relative py-16 border-t border-gray-800/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 - Tanggal */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 hover:border-cyan-400/50 transition-all">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">TANGGAL</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-semibold">1-15 November 2025</p>
                  <p className="text-gray-400">Pendaftaran dibuka</p>
                  <p className="text-gray-500 text-xs">Mulai jam 00:00 WIB</p>
                </div>
              </div>

              {/* Card 2 - Format */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 hover:border-yellow-400/50 transition-all">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">FORMAT</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-semibold">Single Elimination</p>
                  <p className="text-gray-400">Best of 3 (BO3)</p>
                  <p className="text-gray-500 text-xs">Draft pick mode</p>
                </div>
              </div>

              {/* Card 3 - Slot Tim */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 hover:border-green-400/50 transition-all">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">SLOT TIM</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-semibold">100 Tim Total</p>
                  <p className="text-yellow-400 font-semibold">⚡ Sisa 70 slot!</p>
                  <p className="text-gray-500 text-xs">Daftar sekarang</p>
                </div>
              </div>

              {/* Card 4 - Syarat */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 hover:border-purple-400/50 transition-all">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">SYARAT</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-semibold">Rank Min: Epic III</p>
                  <p className="text-gray-400">Server: Indonesia</p>
                  <p className="text-gray-500 text-xs">5 pemain + 1 cadangan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 3: CARA PENDAFTARAN - 3 Steps */}
        {/* ============================================ */}
        <section id="how" className="relative py-16 border-t border-gray-800/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-400/30 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <span>How It Works</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Cara Pendaftaran
              </h2>
              <p className="text-gray-400">3 langkah mudah untuk bergabung</p>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
                  <span className="text-3xl font-black text-cyan-400">1</span>
                </div>
                <h3 className="text-xl font-bold text-white">Isi Form</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Klik "Daftar Sekarang", isi data tim dengan 5 anggota dan ML ID masing-masing
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-xl border border-yellow-400/30">
                  <span className="text-3xl font-black text-yellow-400">2</span>
                </div>
                <h3 className="text-xl font-bold text-white">Verifikasi Email</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Cek inbox, klik link verifikasi yang dikirim otomatis untuk aktivasi akun
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-xl border border-green-400/30">
                  <span className="text-3xl font-black text-green-400">3</span>
                </div>
                <h3 className="text-xl font-bold text-white">Tunggu Approval</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Admin review data tim dan kirim konfirmasi via email dalam maksimal 24 jam
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-10">
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
              >
                <Trophy className="w-4 h-4" />
                <span>Mulai Daftar Sekarang</span>
              </button>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 4: FAQ - Accordion */}
        {/* ============================================ */}
        <section id="faq" className="relative py-16 border-t border-gray-800/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-400/30 rounded-full text-green-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <span>FAQ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Pertanyaan Umum
              </h2>
              <p className="text-gray-400">Jawaban untuk pertanyaan yang sering ditanyakan</p>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-green-400/30 transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <h3 className="text-base font-semibold text-white pr-4">{faq.question}</h3>
                    {openFaqIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
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
