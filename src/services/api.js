const API_BASE_URL = 'http://localhost:9001/api';

export const signupUser = async (formData) => {
    try {
        const res = await fetch('http://localhost:9001/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (!res.ok) {
            // ✅ Add console here for visibility
            console.error('❌ Backend error response:', data.message);
            throw new Error(data.message || 'Signup failed');
        }

        return data; // ✅ Contains token if successful
    } catch (err) {
        // 🔒 Make sure anything unexpected also gets re-thrown
        console.error('❌ Unexpected signup error:', err.message);
        throw err;
    }
};


export const loginUser = async (formData) => {
    try {
        const res = await fetch('http://localhost:9001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data; // should include token, maybe role
    } catch (err) {
        console.error('❌ Login error:', err.message);
        throw err;
    }
};

