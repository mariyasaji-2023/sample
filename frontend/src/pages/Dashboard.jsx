import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [amount, setAmount] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      alert("Enter valid amount ❌");
      return;
    }

    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      alert("Razorpay SDK failed to load ❌");
      return;
    }

    const options = {
      key: "rzp_test_Sm3ZufWQLZ0iz8", // 🔑 replace with your real test key
      amount: amount * 100, // convert ₹ to paise
      currency: "INR",
      name: "My App",
      description: "Custom Payment",
      handler: function (response) {
        alert("Payment Successful ✅");
        console.log(response);
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#4f46e5",
      },
      modal: {
        ondismiss: function () {
          alert("Payment cancelled ❌");
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome, {user.name}!</h2>
        <p style={styles.email}>{user.email}</p>

        {/* Amount Input */}
        <input
          type="number"
          placeholder="Enter amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />

        {/* Pay Button */}
        <button style={styles.payButton} onClick={handlePayment}>
          Pay Now
        </button>

        <br /><br />

        {/* Logout */}
        <button style={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f0f2f5'
  },
  card: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '360px',
    textAlign: 'center'
  },
  title: { marginBottom: '0.5rem' },
  email: { color: '#666', marginBottom: '1.5rem' },

  input: {
    width: '100%',
    padding: '0.7rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },

  payButton: {
    width: '100%',
    padding: '0.75rem',
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },

  button: {
    padding: '0.75rem 2rem',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};