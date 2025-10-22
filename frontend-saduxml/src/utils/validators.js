// Validasi format email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validasi kekuatan password (lebih permisif untuk UX yang lebih baik)
export const validatePassword = (password) => {
  const errors = [];
  
  // Minimal 6 karakter saja untuk simplicity
  if (password.length < 6) {
    errors.push('Password minimal 6 karakter');
  }
  
  // Optional: tambahkan warning jika password lemah (tidak mandatory)
  // Password dianggap valid asalkan >= 6 karakter
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validasi format nomor telepon Indonesia
export const validatePhone = (phone) => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone);
};

// Validasi Mobile Legends ID
export const validateMLID = (mlId) => {
  const mlIdRegex = /^[0-9]{5,12}$/;
  return mlIdRegex.test(mlId);
};

// Sanitize input untuk mencegah XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validasi form registrasi team
export const validateTeamRegistration = (formData) => {
  const errors = {};

  // Event ID validation
  if (!formData.event_id) {
    errors.event_id = 'Pilih event terlebih dahulu';
  }

  if (!formData.name || formData.name.trim().length < 3) {
    errors.name = 'Nama team minimal 3 karakter';
  }

  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Email tidak valid';
  }

  // Leader name validation
  if (!formData.leader_name || formData.leader_name.trim().length < 3) {
    errors.leader_name = 'Nama ketua tim minimal 3 karakter';
  }

  // Leader phone validation
  if (!formData.leader_phone || !validatePhone(formData.leader_phone)) {
    errors.leader_phone = 'Nomor HP ketua tim tidak valid (gunakan format Indonesia)';
  }

  if (!formData.password) {
    errors.password = 'Password wajib diisi';
  } else {
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Password tidak cocok';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validasi form add member
export const validateMemberForm = (formData) => {
  const errors = {};
  
  if (!formData.name || formData.name.trim().length < 3) {
    errors.name = 'Nama minimal 3 karakter';
  }
  
  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Email tidak valid';
  }
  
  if (!formData.ml_id || !validateMLID(formData.ml_id)) {
    errors.ml_id = 'Mobile Legends ID tidak valid (5-12 digit)';
  }
  
  if (!formData.phone || !validatePhone(formData.phone)) {
    errors.phone = 'Nomor telepon tidak valid';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
