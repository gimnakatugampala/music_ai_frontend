import React from 'react'
import toast, { Toaster } from 'react-hot-toast';

const ErrorToast = () => {
    toast.error('Hello Darkness!',
        {
          icon: '❌',
          style: {
            height:'50px',
            width:'100%',
            borderRadius: '10px',
            background: '#E22026',
            color: '#fff',
          },
        }
      )
}

export default ErrorToast