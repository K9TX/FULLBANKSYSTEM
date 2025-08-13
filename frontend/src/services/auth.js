import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const authService = {
    register: async (userData) => {
        const response = await axios.post(`${API_URL}/auth/register/`, userData);
        return response.data;
    },

    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login/`, { email, password });
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            // Store user including absolute profile image URL if provided
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    resetPassword: async (email) => {
        const response = await axios.post(`${API_URL}/auth/password-reset/request/`, { email });
        return response.data;
    },

    verifyOTP: async (data) => {
        const response = await axios.post(`${API_URL}/auth/password-reset/verify/`, data);
        return response.data;
    },

    changePassword: async (oldPassword, newPassword) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/auth/password/change/`,
            { old_password: oldPassword, new_password: newPassword },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    depositMoney: async (amount) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/auth/deposit/`,
            { amount },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    },

    transferMoney: async ({ to_account_number, amount }) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/auth/transfer/`,
            { to_account_number, amount },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    resolveAccount: async (accountNumber) => {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL}/auth/resolve-account/`,
            { headers: { Authorization: `Bearer ${token}` }, params: { account_number: accountNumber } }
        );
        return response.data;
    },

    getBalance: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL}/auth/balance/`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    getBlogs: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL}/auth/blogs/`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    createBlog: async ({ title, content, imageFile = null }) => {
        const token = localStorage.getItem('token');
        const form = new FormData();
        form.append('title', title);
        form.append('content', content);
        if (imageFile) form.append('image', imageFile);
        const response = await axios.post(
            `${API_URL}/auth/blogs/`,
            form,
            { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    },

    deleteBlog: async (blogId) => {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
            `${API_URL}/auth/blogs/`,
            { headers: { Authorization: `Bearer ${token}` }, params: { id: blogId } }
        );
        return response.data;
    },

    getComments: async (blogId) => {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL}/auth/blogs/${blogId}/comments/`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    addComment: async ({ blogId, content, parent = null }) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/auth/blogs/${blogId}/comments/`,
            { content, parent },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    getTransactions: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL}/auth/transactions/`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

  getUsers: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/auth/users/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

    getMe: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL}/auth/me/`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    updateMe: async (formData) => {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `${API_URL}/auth/me/`,
            formData,
            { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        // Keep local user in sync for header, etc., including profile image URL
        const user = localStorage.getItem('user');
        if (user) {
            const parsed = JSON.parse(user);
            localStorage.setItem('user', JSON.stringify({
                ...parsed,
                username: response.data.username,
                phone_number: response.data.phone_number,
                profile_image_url: response.data.profile_image_url || parsed.profile_image_url,
            }));
        }
        return response.data;
    },

    // Loans
    getLoans: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL}/auth/loans/`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    applyLoan: async ({ amount, term_months, purpose, interest_rate }) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/auth/loans/`,
            { amount, term_months, purpose, interest_rate },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    actOnLoan: async (loanId, action) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/auth/loans/${loanId}/action/`,
            { action },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    // Axios interceptor for handling token refresh
    setupAxiosInterceptors: () => {
        axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config || {};
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        if (!refreshToken) throw new Error('No refresh token');
                        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                            refresh: refreshToken
                        });
                        localStorage.setItem('token', response.data.access);
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                        return axios(originalRequest);
                    } catch (err) {
                        authService.logout();
                        return Promise.reject(err);
                    }
                }
                return Promise.reject(error);
            }
        );
    }
};

export default authService; 