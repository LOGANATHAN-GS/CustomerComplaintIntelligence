import pandas as pd
import joblib
from sklearn.metrics import accuracy_score

# Load test data
test = pd.read_csv("data/test.csv")

# Load model and vectorizer
model = joblib.load("models/complaint_model.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

# Convert test complaints to TF-IDF
X_test = vectorizer.transform(test["complaint_text"])

# Predictions and probabilities
predictions = model.predict(X_test)
probabilities = model.predict_proba(X_test)

# Highest probability = confidence
confidence = probabilities.max(axis=1)

# Check different thresholds
print("\n--- CONFIDENCE THRESHOLD ANALYSIS ---")

for threshold in [0.50, 0.60, 0.70, 0.80, 0.90]:
    high_confidence = confidence >= threshold

    total_high = high_confidence.sum()
    total_low = len(test) - total_high

    correct_high = (
        (predictions == test["category"]) & high_confidence
    ).sum()

    accuracy_high = (
        correct_high / total_high * 100
        if total_high > 0 else 0
    )

    print(f"\nThreshold: {threshold * 100:.0f}%")
    print(f"High confidence: {total_high}")
    print(f"Needs review: {total_low}")
    print(f"High-confidence accuracy: {accuracy_high:.2f}%")