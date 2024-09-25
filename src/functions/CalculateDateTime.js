import React from 'react'

const CalculateDateTime = (timestamp) => {
    const date = new Date(timestamp);

    // Get day of the month
    const day = date.getDate();
    
    // Determine the day suffix (e.g., 'th', 'st', 'nd', 'rd')
    const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
                   (day % 10 === 2 && day !== 12) ? 'nd' :
                   (day % 10 === 3 && day !== 13) ? 'rd' : 'th';

    // Get the month name
    const month = date.toLocaleString('default', { month: 'long' });

    // Get the full year
    const year = date.getFullYear();

    // Format time to 12-hour with AM/PM
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;  // Convert to 12-hour format
    const formattedMinutes = minutes === 0 ? '00' : minutes.toString().padStart(2, '0');

    return `${day}${suffix} ${month} ${year} at ${formattedHours}:${formattedMinutes}${period}`;
}

export default CalculateDateTime