SELECT 
    ":id", -- Socrata column ID
    "midday_daily_sum", -- Winning Midday Daily Lucky Sum
    "draw_date", -- Draw date
    "evening_win_4", -- Evening Win 4 Numbers
    "evening_daily", -- Evening Daily Numbers
    "evening_daily_sum", -- Evening Daily Lucky Sum
    "midday_win_4_booster", -- Booster percentage for Midday Win4 number
    "midday_win_4_sum", -- Midday Win 4 Lucky Sum
    "midday_daily", -- Midday Daily Numbers
    "evening_win_4_sum", -- Evening Win 4 Lucky Sum
    "evening_win_4_booster", -- Booster percentage for Evening Win4 number
    "midday_win_4", -- Midday Win 4 Numbers
    "midday_daily_booster", --  Booster percentage for Midday Daily number
    "evening_daily_booster" -- Booster percentage for Evening  Daily number
FROM
    "ny-gov/lottery-daily-numberswin4-winning-numbers-hsys-3def:latest"."lottery_daily_numberswin4_winning_numbers"
    WHERE
    "draw_date">= "2021-03-12"

LIMIT 100;