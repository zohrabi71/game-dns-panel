function extractRemainingTime(timestamp) {
    const now = Date.now(); // Current time in milliseconds
    const remainingTime = timestamp - now; // Time remaining in milliseconds

    const seconds = Math.floor(remainingTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    return {
        days, hours: remainingHours, minutes: remainingMinutes, seconds: remainingSeconds
    }
}

module.exports = extractRemainingTime;