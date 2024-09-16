import toast, { Toaster } from 'react-hot-toast';

import { AiOutlineWarning } from 'react-icons/ai'; // Custom error icon (using react-icons)

const ErrorAlert = (title) => {
    toast.error(title, {
        duration: 5000, // Custom duration in ms (5 seconds)
        icon: <AiOutlineWarning size={24} color="#ff0000" />, // Custom error icon
        style: {
            border: '1px solid #ff4d4f', // Red border for error
            padding: '16px',
            color: '#ff0000', // Red text color
            background: '#fff1f0', // Light red background
            fontSize: '16px',
            fontWeight: 'bold',
        },
        position: 'top-right', // Position of the toast (can be 'top-center', 'bottom-right', etc.)
    });
};

export default ErrorAlert;
