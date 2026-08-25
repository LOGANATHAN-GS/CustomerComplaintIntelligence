public class ComplaintAnalyzer {

    public static String analyze(String complaint) {

        String cleanedComplaint =
                ComplaintPreprocessor.cleanText(complaint);

        String category =
                ComplaintClassifier.classify(cleanedComplaint);

        String sentiment =
                SentimentAnalyzer.analyze(cleanedComplaint);

        String priority =
                PriorityDetector.detect(cleanedComplaint, sentiment);

        return "Complaint: " + cleanedComplaint
                + "\nCategory: " + category
                + "\nSentiment: " + sentiment
                + "\nPriority: " + priority;
    }
}