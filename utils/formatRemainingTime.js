function formatRemainingTime(timestamp) {
    const now = Date.now(); // Current time in milliseconds
    const remainingTime = timestamp - now; // Time remaining in milliseconds

    if (remainingTime < 0) {
        return "پایان یافته";
    }

    const seconds = Math.floor(remainingTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;

    return `${days}:${remainingHours}:${remainingMinutes} باقی مانده`;
}

module.exports = formatRemainingTime;