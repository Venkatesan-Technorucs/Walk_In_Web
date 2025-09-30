import { Chip } from 'primereact/chip';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react'

const AutoComplete = ({ placeholder, value, onChange, onKeyDown, onBlur, list = [], selectedList = [], onSelect, onRemove, label = 'name', id = 'id' }) => {
    const [iconClass, setIconClass] = useState('pi pi-spin pi-spinner');
    const spinRef = useRef(null);

    useEffect(() => {
        if (!value) {
            return setIconClass('');
        }
        setIconClass(value ? 'pi pi-spin pi-spinner' : '');
        const timer = setTimeout(() => {
            setIconClass('');
        }, 1000);
        return () => clearTimeout(timer);
    }, [value]);

    const filteredList = list.filter(item =>
        item?.[label]?.toLowerCase().includes(value?.toLowerCase() || '')
    );
    return (
        <div className='w-full flex flex-col gap-2'>
            <div className="w-full relative">
                <IconField iconPosition="right">
                    <InputIcon className={iconClass} />
                    <InputText type="text" ref={spinRef} value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder} onBlur={onBlur} className="w-full py-2 focus-within:border-green-800 focus:border-(--primary-color) focus:border-2 focus:shadow-none" />
                </IconField>
                {filteredList.length > 0 && (
                    <ul className="p-2 max-h-40 z-50 absolute left-0 right-0 top-full mt-0 rounded shadow-md w-full h-20 bg-white overflow-auto">
                        {filteredList.map(item => (
                            <li
                                key={item[id]} onClick={() => onSelect(item)} className="p-1 hover:bg-(--header-bg)" >
                                {item[label]}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="w-full flex gap-2 flex-wrap max-w-full">
                {selectedList.map(item => (
                    <Chip key={item[label]} label={item[label]} removable onRemove={() => onRemove(item[label])} className="bg-(--primary-color-light) h-8 rounded-sm max-w-full flex  text-white" pt={{ label: '' }} />
                ))}
            </div>
        </div>
    )
}

export default AutoComplete;
