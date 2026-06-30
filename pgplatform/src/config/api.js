// Central API service — all backend calls go through here
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('stayease_token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  // Auth
  register:        (data)                  => request('/auth/register', { method:'POST', body: JSON.stringify(data) }),
  sendEmailOTP:    (email)                 => request('/auth/send-email-otp', { method:'POST', body: JSON.stringify({ email }) }),
  verifyEmailOTP:  (email, otp, role)      => request('/auth/verify-email-otp', { method:'POST', body: JSON.stringify({ email, otp, role }) }),
  sendPhoneOTP:    (phone)                 => request('/auth/send-phone-otp', { method:'POST', body: JSON.stringify({ phone }) }),
  verifyPhoneOTP:  (phone, otp, role)      => request('/auth/verify-phone-otp', { method:'POST', body: JSON.stringify({ phone, otp, role }) }),
  emailLogin:      (email, password)       => request('/auth/email-login', { method:'POST', body: JSON.stringify({ email, password }) }),
  getMe:           ()                      => request('/auth/me'),
  updateProfile:   (data)                  => request('/auth/profile', { method:'PUT', body: JSON.stringify(data) }),

  // Properties
  getProperties: (params = {}) => request('/properties?' + new URLSearchParams(params)),
  getProperty:   (id)          => request(`/properties/${id}`),
  createProperty:(data)        => request('/properties', { method:'POST', body: JSON.stringify(data) }),
  updateProperty:(id, data)    => request(`/properties/${id}`, { method:'PUT', body: JSON.stringify(data) }),
  getMyProperties: ()          => request('/owner/properties'),
  approveProperty: (id, action)=> request(`/admin/properties/${id}/approve`, { method:'PUT', body: JSON.stringify({ action }) }),

  // Rooms
  getRooms:   (propertyId) => request(`/rooms/${propertyId}`),
  createRoom: (data)       => request('/rooms', { method:'POST', body: JSON.stringify(data) }),

  // Payments
  getMyPayments:    ()            => request('/payments/my'),
  payRent:          (payId, data) => request(`/payments/${payId}/pay`, { method:'POST', body: JSON.stringify(data) }),
  getOwnerPayments: ()            => request('/owner/payments'),
  sendReminder:     (payId)       => request(`/owner/payments/${payId}/remind`, { method:'POST' }),

  // Service Requests
  getMyRequests:    ()     => request('/service-requests/my'),
  createRequest:    (data) => request('/service-requests', { method:'POST', body: JSON.stringify(data) }),
  updateRequest:    (id, data) => request(`/service-requests/${id}`, { method:'PUT', body: JSON.stringify(data) }),

  // KYC
  submitKYC:   (data) => request('/kyc/submit', { method:'POST', body: JSON.stringify(data) }),
  getKYCQueue: ()     => request('/admin/kyc'),
  reviewKYC:   (id, action) => request(`/admin/kyc/${id}`, { method:'PUT', body: JSON.stringify({ action }) }),

  // Notifications
  getNotifications: ()  => request('/notifications'),
  markAllRead:      ()  => request('/notifications/read-all', { method:'PUT' }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getUsers:      () => request('/admin/users'),
  updateUserStatus: (id, status) => request(`/admin/users/${id}/status`, { method:'PUT', body: JSON.stringify({ status }) }),
  getAdminProperties: () => request('/properties?limit=50'),

  // Owner Tenants
  getOwnerTenants: () => request('/owner/tenants'),
  checkIn:         (data) => request('/owner/checkin', { method:'POST', body: JSON.stringify(data) }),
};

export default api;
