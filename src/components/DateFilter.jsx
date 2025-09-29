import { Calendar } from 'primereact/calendar'
import React from 'react'

const DateFilter = ({ dateRange, setDateRange }) => {
    return (
        <div>
            <Calendar
                id="dateRange"
                selectionMode="range"
                placeholder="Select date range"
                value={[dateRange.startDate, dateRange.endDate]}
                onChange={(e) => {
                    const [start, end] = e.value || [];
                    setDateRange({ startDate: start || null, endDate: end || null });
                }}
                showIcon
                className="h-14"
                icon={() => <i className="pi pi-calendar text-(--primary-color)"></i>}
            />
        </div>
    )
}

export default DateFilter