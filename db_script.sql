CREATE DATABASE mealreviews;

CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(10),
    meal_name VARCHAR(50),
    review VARCHAR(99999),
    review_date TIMESTAMP
);