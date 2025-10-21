import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { authService } from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Token verifikasi tidak ditemukan. Silakan cek email Anda.');
        return;
      }

      try {
        const response = await authService.verify(token);
        setStatus('success');
        setMessage(response.data.message || 'Email berhasil diverifikasi!');
        
        // Redirect ke login setelah 3 detik
        setTimeout(() => {
          navigate('/', { state: { openLoginModal: true } });
        }, 3000);
      } catch (error) {
        setStatus('error');
        const errorMsg = error.response?.data?.message || 'Verifikasi gagal. Token mungkin sudah expired atau tidak valid.';
        setMessage(errorMsg);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1428] via-[#0f1e3d] to-[#0A1428] flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {status === 'verifying' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center"
              >
                <Loader2 className="w-10 h-10 text-cyan-400" />
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-green-400" />
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center"
              >
                <XCircle className="w-10 h-10 text-red-400" />
              </motion.div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center mb-3">
            {status === 'verifying' && 'Memverifikasi Email...'}
            {status === 'success' && 'Verifikasi Berhasil!'}
            {status === 'error' && 'Verifikasi Gagal'}
          </h1>

          {/* Message */}
          <p className="text-gray-400 text-center mb-6">
            {message || 'Mohon tunggu sebentar...'}
          </p>

          {/* Additional Info */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6"
            >
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-300">
                  <p className="font-semibold mb-1">Email Anda telah terverifikasi!</p>
                  <p className="text-green-400/80">
                    Anda akan diarahkan ke halaman login dalam beberapa detik...
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6"
            >
              <div className="text-sm text-red-300">
                <p className="font-semibold mb-2">Kemungkinan penyebab:</p>
                <ul className="list-disc list-inside space-y-1 text-red-400/80">
                  <li>Link verifikasi sudah expired</li>
                  <li>Token tidak valid</li>
                  <li>Email sudah terverifikasi sebelumnya</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {status === 'success' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={() => navigate('/', { state: { openLoginModal: true } })}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-semibold transition-all"
              >
                Login Sekarang
              </motion.button>
            )}

            {status === 'error' && (
              <>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => navigate('/', { state: { openRegisterModal: true } })}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-semibold transition-all"
                >
                  Daftar Ulang
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => navigate('/')}
                  className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
                >
                  Kembali ke Beranda
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <p className="text-gray-500 text-sm">
            Butuh bantuan?{' '}
            <a href="mailto:support@sadux.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Hubungi Support
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
