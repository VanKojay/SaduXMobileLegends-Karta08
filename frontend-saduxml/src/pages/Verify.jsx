import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token verifikasi tidak ditemukan');
        return;
      }

      try {
        const response = await authService.verify(token);
        setStatus('success');
        setMessage(response.data.message || 'Email berhasil diverifikasi!');
        
        // Redirect ke home setelah 3 detik
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Verifikasi gagal. Token mungkin sudah kadaluarsa atau tidak valid.'
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/90 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Memverifikasi Email</h1>
              <p className="text-gray-400">Mohon tunggu sebentar...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Verifikasi Berhasil!</h1>
              <p className="text-gray-400 mb-6">{message}</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-indigo-400">
                <span>Mengalihkan ke halaman utama</span>
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Verifikasi Gagal</h1>
              <p className="text-gray-400 mb-6">{message}</p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all hover:scale-105"
              >
                <span>Kembali ke Home</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verify;
