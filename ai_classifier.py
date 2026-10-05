import joblib

MODEL_FILE = "models/complaint_model.pkl"
VECTORIZER_FILE = "models/tfidf_vectorizer.pkl"

# Load the trained AI model
model = joblib.load(MODEL_FILE)
vectorizer = joblib.load(VECTORIZER_FILE)


def classify_complaint(complaint):
    # Convert complaint into TF-IDF features
    features = vectorizer.transform([complaint])

    # Predict category
    category = model.predict(features)[0]

    # Calculate confidence
    probabilities = model.predict_proba(features)[0]
    confidence = probabilities.max()

    # Decide whether admin review is required
    review_required = confidence < 0.70

    return {
        "category": category,
        "confidence": round(confidence * 100, 2),
        "review_required": review_required
    }


if __name__ == "__main__":
    complaint = input("Enter complaint: ")

    result = classify_complaint(complaint)

    print("\n--- AI RESULT ---")
    print("Category:", result["category"])
    print("Confidence:", result["confidence"], "%")
    print("Review required:", result["review_required"])