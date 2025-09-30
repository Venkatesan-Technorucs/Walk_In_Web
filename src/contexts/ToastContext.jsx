import { Toast } from 'primereact/toast';
import React, { createContext, useContext, useRef } from 'react'

const ToastContext = createContext();

export let useToast = () => {
    return useContext(ToastContext);
}

let { Provider } = ToastContext;

const ToastProvider = ({ children }) => {
    const toast = useRef(null);

    const showToast = (severity, summary, msg) => {
        toast.current.show({ severity: severity, summary: summary, detail: msg });
    };

    return (
        <Provider value={{ showToast }}>
            <Toast ref={toast} position="top-right" className='h-5' pt={{ root: 'w-[60%]', content: 'p-2', icon: 'w-4 h-4 mt-1', text: 'text-sm xs:text-base', closeButton: 'w-4 h-3 mt-1' }} />
            {children}
        </Provider>
    )
}

export default ToastProvider