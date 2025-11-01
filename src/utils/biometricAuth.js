/**
 * WebAuthn Biometric Authentication Utility
 * Supports Face Recognition & Fingerprint Scanning
 */

// Check if WebAuthn is supported
export const isBiometricSupported = () => {
  return window?.PublicKeyCredential !== undefined && 
         navigator?.credentials !== undefined;
};

// Check specific authenticator types
export const getAvailableAuthenticators = async () => {
  if (!isBiometricSupported()) {
    return {
      platform: false, // Face ID, Touch ID, Windows Hello
      crossPlatform: false // USB security keys
    };
  }

  try {
    const available = await Promise.all([
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
      PublicKeyCredential.isConditionalMediationAvailable?.() || Promise.resolve(false)
    ]);

    return {
      platform: available[0], // Face/Fingerprint
      crossPlatform: available[1]
    };
  } catch (error) {
    console.error('Error checking authenticators:', error);
    return { platform: false, crossPlatform: false };
  }
};

// Generate random challenge
const generateChallenge = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return array;
};

// Convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary);
};

// Convert Base64 to ArrayBuffer
const base64ToArrayBuffer = (base64) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Register new user with biometric
 * @param {string} username - User's display name
 * @returns {Promise<Object>} - Credential info
 */
export const registerBiometric = async (username) => {
  if (!isBiometricSupported()) {
    throw new Error('Biometric authentication tidak didukung di browser ini');
  }

  const available = await getAvailableAuthenticators();
  if (!available.platform) {
    throw new Error('Device tidak memiliki biometric authenticator (Face ID/Touch ID/Fingerprint)');
  }

  try {
    // Generate unique user ID
    const userId = crypto.randomUUID();
    const userIdBuffer = new TextEncoder().encode(userId);

    // WebAuthn registration options
    const publicKeyCredentialCreationOptions = {
      challenge: generateChallenge(),
      rp: {
        name: "Bulking Daily",
        id: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
      },
      user: {
        id: userIdBuffer,
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },  // ES256
        { alg: -257, type: "public-key" } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform", // Force platform authenticator (Face/Fingerprint)
        userVerification: "required", // Require biometric verification
        requireResidentKey: false,
      },
      timeout: 60000,
      attestation: "direct"
    };

    // Trigger biometric registration
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    });

    if (!credential) {
      throw new Error('Registrasi biometric gagal');
    }

    // Store credential info
    const credentialData = {
      id: credential.id,
      rawId: arrayBufferToBase64(credential.rawId),
      type: credential.type,
      username: username,
      userId: userId,
      createdAt: new Date().toISOString(),
      authenticatorType: 'platform', // Face/Fingerprint
    };

    // Save to localStorage
    const existingUsers = JSON.parse(localStorage.getItem('biometric_users') || '[]');
    existingUsers.push(credentialData);
    localStorage.setItem('biometric_users', JSON.stringify(existingUsers));
    localStorage.setItem('current_credential_id', credential.id);

    return {
      success: true,
      username: username,
      credentialId: credential.id,
      message: 'Biometric berhasil didaftarkan! (Face ID/Fingerprint)'
    };

  } catch (error) {
    console.error('Registration error:', error);
    
    // User-friendly error messages
    if (error.name === 'NotAllowedError') {
      throw new Error('Registrasi dibatalkan atau tidak diizinkan');
    } else if (error.name === 'InvalidStateError') {
      throw new Error('Credential sudah terdaftar untuk user ini');
    } else if (error.name === 'NotSupportedError') {
      throw new Error('Authenticator tidak mendukung algoritma yang diperlukan');
    } else {
      throw new Error(error.message || 'Terjadi kesalahan saat registrasi biometric');
    }
  }
};

/**
 * Authenticate user with biometric
 * @returns {Promise<Object>} - User info
 */
export const authenticateBiometric = async () => {
  if (!isBiometricSupported()) {
    throw new Error('Biometric authentication tidak didukung di browser ini');
  }

  const available = await getAvailableAuthenticators();
  if (!available.platform) {
    throw new Error('Device tidak memiliki biometric authenticator');
  }

  try {
    // Get registered users
    const registeredUsers = JSON.parse(localStorage.getItem('biometric_users') || '[]');
    
    if (registeredUsers.length === 0) {
      throw new Error('Tidak ada user terdaftar. Silakan registrasi terlebih dahulu.');
    }

    // Prepare allowed credentials
    const allowCredentials = registeredUsers.map(user => ({
      id: base64ToArrayBuffer(user.rawId),
      type: 'public-key',
      transports: ['internal'] // Platform authenticator
    }));

    // WebAuthn authentication options
    const publicKeyCredentialRequestOptions = {
      challenge: generateChallenge(),
      rpId: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
      allowCredentials: allowCredentials,
      userVerification: "required", // Require biometric
      timeout: 60000,
    };

    // Trigger biometric authentication
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions
    });

    if (!assertion) {
      throw new Error('Authentication gagal');
    }

    // Find matching user
    const authenticatedUser = registeredUsers.find(
      user => user.id === assertion.id
    );

    if (!authenticatedUser) {
      throw new Error('User tidak ditemukan');
    }

    // Update last login
    authenticatedUser.lastLogin = new Date().toISOString();
    localStorage.setItem('biometric_users', JSON.stringify(registeredUsers));
    localStorage.setItem('current_user', JSON.stringify(authenticatedUser));
    localStorage.setItem('is_authenticated', 'true');

    return {
      success: true,
      username: authenticatedUser.username,
      userId: authenticatedUser.userId,
      message: 'Login berhasil!'
    };

  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'NotAllowedError') {
      throw new Error('Authentication dibatalkan atau tidak diizinkan');
    } else if (error.name === 'InvalidStateError') {
      throw new Error('Credential tidak valid');
    } else {
      throw new Error(error.message || 'Terjadi kesalahan saat authentication');
    }
  }
};

/**
 * Logout current user
 */
export const logout = () => {
  localStorage.removeItem('current_user');
  localStorage.removeItem('is_authenticated');
  return { success: true, message: 'Logout berhasil' };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return localStorage.getItem('is_authenticated') === 'true';
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('current_user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Delete user credential
 */
export const deleteUserCredential = (userId) => {
  const users = JSON.parse(localStorage.getItem('biometric_users') || '[]');
  const filteredUsers = users.filter(user => user.userId !== userId);
  localStorage.setItem('biometric_users', JSON.stringify(filteredUsers));
  
  // If deleted current user, logout
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.userId === userId) {
    logout();
  }
  
  return { success: true, message: 'User credential berhasil dihapus' };
};
