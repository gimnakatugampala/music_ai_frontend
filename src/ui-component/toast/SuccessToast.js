import React from 'react'
import toast, { Toaster } from 'react-hot-toast';


const SuccessToast = () => {
    toast.success('Hello Darkness!',
        {
          icon: '✔',
          style: {
            height:'50px',
            width:'100%',
            borderRadius: '10px',
            background: '#28A83A',
            color: '#fff',
          },
        }
      )
}

export default SuccessToast