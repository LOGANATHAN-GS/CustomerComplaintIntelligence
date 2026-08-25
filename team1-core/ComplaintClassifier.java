public class ComplaintClassifier {

    public static String classify(String complaint) {

        if (complaint.contains("payment") ||
            complaint.contains("transaction") ||
            complaint.contains("charged") ||
            complaint.contains("money")) {

            return "Payment";

        } else if (complaint.contains("delivery") ||
                   complaint.contains("order") ||
                   complaint.contains("package") ||
                   complaint.contains("shipping")) {

            return "Delivery";

        } else if (complaint.contains("refund") ||
                   complaint.contains("return") ||
                   complaint.contains("money back")) {

            return "Refund";

        } else if (complaint.contains("account") ||
                   complaint.contains("login") ||
                   complaint.contains("password")) {

            return "Account";

        } else if (complaint.contains("product") ||
                   complaint.contains("damaged") ||
                   complaint.contains("broken")) {

            return "Product";

        } else {
            return "Other";
        }
    }
}