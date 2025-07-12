function calculateRemainingTime(endDate) {
    const currentDate = new Date(); // Current date and time
    const difference = endDate - currentDate;

    const totalSeconds = Math.floor(difference / 1000);

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds }
}

module.exports = calculateRemainingTime;