public class ComplaintPreprocessor {

    public static String cleanText(String text) {

        text = text.toLowerCase();

        text = text.replaceAll("[^a-zA-Z0-9\\s]", "");

        text = text.replaceAll("\\s+", " ").trim();

        return text;
    }
}