import React, { useRef } from 'react'

const Toast = ({ message, severity, pt }) => {
  const toast = useRef(null);
  
  return (
    <Toast ref={toast} position="top-right" className='h-5' pt={{ root: 'w-[60%]', content: 'p-2', icon: 'w-4 h-4 mt-1', text: 'text-sm xs:text-base', closeButton: 'w-4 h-3 mt-1' }} />
  )
}

export default Toast