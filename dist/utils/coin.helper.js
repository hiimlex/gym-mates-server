"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculate_coin_by_streak = void 0;
exports.calculate_daily_streak = calculate_daily_streak;
exports.calculate_coins = calculate_coins;
exports.calculate_coin_by_streak = {
    // return 1 coin if it's a weekend, otherwise return 0
    weekends: (_, date) => {
        // check if the date is a weekend
        if (!date)
            return 0;
        const day = date.getDay();
        // 0 is Sunday, 6 is Saturday
        if (day === 0 || day === 6) {
            return 1;
        }
        return 0;
    },
    // return 2 coins if it's an week streak like 7, 14, 21...
    weekly: (user_streak) => {
        if (user_streak % 7 === 0) {
            return 2;
        }
        return 0;
    },
    // return 10 coins if it's a month streak like 30, 60, 90...
    monthly: (user_streak) => {
        if (user_streak % 30 === 0) {
            return 10;
        }
        return 0;
    },
    // return 300 coins if it's a year streak like 365, 730, 1095...
    yearly: (user_streak) => {
        if (user_streak % 365 === 0) {
            return 300;
        }
        return 0;
    },
};
// return +1 coin for each 10 days streak
function calculate_daily_streak(user_streak) {
    if (user_streak / 10) {
        return Math.floor(user_streak / 10);
    }
    return 0;
}
/**
 * Calculate coins based on the user's streaks and current streak.
 * @param streaks - The crew's streaks.
 * @param user_streak - The user's current streak count.
 * @param date - Optional date to check for weekend streaks.
 * @returns An object containing the total coins and a receipt of the streaks.
 */
function calculate_coins(streaks, user_streak, date) {
    return new Promise((resolve) => {
        let coins = 1;
        let receipt = {
            base: 1,
        };
        const streak_with_values = Array.from(streaks).map((streak) => ({
            streak,
            coins: exports.calculate_coin_by_streak[streak](user_streak, date),
        }));
        const daily_streak_coins = calculate_daily_streak(user_streak);
        const streak_sum = streak_with_values.reduce((acc, curr) => acc + curr.coins, 0);
        // create a receipt object with streaks and their values
        streak_with_values.forEach(({ streak, coins }) => (receipt[streak] = coins));
        if (daily_streak_coins > 0) {
            receipt.daily = daily_streak_coins;
        }
        // set the coins from the streaks
        coins += streak_sum;
        coins += daily_streak_coins;
        resolve({
            coins,
            receipt,
        });
    });
}
