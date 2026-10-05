import pandas as pd
import joblib

# Load test data and model
test = pd.read_csv("data/test.csv")

model = joblib.load("models/complaint_model.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

# Convert test complaints to TF-IDF
X_test = vectorizer.transform(test["complaint_text"])

# Predict
predictions = model.predict(X_test)

# Store predictions
test["predicted_category"] = predictions

# Keep only incorrect predictions
errors = test[test["category"] != test["predicted_category"]]

print("\n--- ERROR ANALYSIS ---")
print("Total test complaints:", len(test))
print("Incorrect predictions:", len(errors))

print("\n--- MOST COMMON CONFUSIONS ---")
print(
    errors.groupby(
        ["category", "predicted_category"]
    ).size().sort_values(ascending=False).head(15)
)

print("\n--- EXAMPLES OF WRONG PREDICTIONS ---")

for _, row in errors.head(20).iterrows():
    print("\nComplaint:", row["complaint_text"])
    print("Actual:", row["category"])
    print("Predicted:", row["predicted_category"])