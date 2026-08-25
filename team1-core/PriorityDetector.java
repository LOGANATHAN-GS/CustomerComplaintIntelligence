public class PriorityDetector {

    public static String detect(String complaint, String sentiment) {

        if (sentiment.equals("Negative")) {

            if (complaint.contains("urgent") ||
                complaint.contains("emergency") ||
                complaint.contains("fraud") ||
                complaint.contains("stolen") ||
                complaint.contains("blocked")) {

                return "High";
            }

            return "Medium";
        }

        if (sentiment.equals("Positive")) {
            return "Low";
        }

        return "Medium";
    }
}