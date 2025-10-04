import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar'
import React, { useState } from 'react'

const DateFilter = ({ startDate, endDate, setStartDate, setEndDate }) => {
    const [showCustom, setShowCustom] = useState(false);

    const handleButtonClick = () => {
        setShowCustom(true);
    };

    const handleClose = () => {
        setShowCustom(false);
    };

    return (
        <div
            className="flex gap-3 w-full items-center relative h-12"
        >
            <Button
                label="Custom Date"
                className="border border-gray-400 bg-white text-black w-full h-12 rounded text-sm xs:text-base transition-colors duration-150 font-light"
                onClick={handleButtonClick}
                icon="pi pi-calendar"
                iconPos="left"
                aria-expanded={showCustom}
            />
            {showCustom && (
                <div
                    className="flex flex-col gap-2 absolute z-10 top-full left-0 bg-white border border-gray-300 rounded shadow-lg w-full p-4 mt-2"
                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                >
                    <button
                        type="button"
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                        onClick={handleClose}
                        aria-label="Close"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                        &times;
                    </button>
                    <label htmlFor="startDate-dropdown" className="text-xs text-gray-600 mb-1">
                        Start Date
                    </label>
                    <Calendar
                        id="startDate-dropdown"
                        placeholder="Start Date"
                        selectionMode="single"
                        value={startDate}
                        onChange={(e) => setStartDate(e.value)}
                        showIcon
                        className="h-10 w-full"
                        inputClassName="w-full rounded px-2 py-2 focus:border-blue-500"
                        icon={() => <i className="pi pi-calendar text-blue-600"></i>}
                    />
                    <span className="self-center text-gray-500 font-semibold">to</span>
                    <label htmlFor="endDate-dropdown" className="text-xs text-gray-600 mb-1">
                        End Date
                    </label>
                    <Calendar
                        id="endDate-dropdown"
                        placeholder="End Date"
                        selectionMode="single"
                        value={endDate}
                        onChange={(e) => setEndDate(e.value)}
                        showIcon
                        className="h-10 w-full"
                        inputClassName="w-full border border-transparent rounded px-2 py-2 focus:border-blue-500"
                        icon={() => <i className="pi pi-calendar text-blue-600"></i>}
                    />
                </div>
            )}
        </div>
    );
};

export default DateFilter;
