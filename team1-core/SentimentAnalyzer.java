package com.customercomplaint.core;

public class SentimentAnalyzer {

    public static String analyze(String complaint) {

        String[] negativeWords = {
            "angry",
            "bad",
            "terrible",
            "worst",
            "hate",
            "disappointed",
            "failed",
            "problem",
            "issue",
            "late",
            "not working",
            "poor"
        };

        String[] positiveWords = {
            "happy",
            "good",
            "great",
            "excellent",
            "thank",
            "satisfied",
            "wonderful"
        };

        for (String word : negativeWords) {
            if (complaint.contains(word)) {
                return "Negative";
            }
        }

        for (String word : positiveWords) {
            if (complaint.contains(word)) {
                return "Positive";
            }
        }

        return "Neutral";
    }
}