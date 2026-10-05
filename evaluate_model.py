import pandas as pd
import joblib
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Load test data
test = pd.read_csv("data/test.csv")

# Load trained model and TF-IDF vectorizer
model = joblib.load("complaint_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

# Convert test complaints to TF-IDF features
X_test = vectorizer.transform(test["complaint_text"])
y_test = test["category"]

# Predict categories
y_pred = model.predict(X_test)

# Accuracy
accuracy = accuracy_score(y_test, y_pred)

print("\n--- MODEL ACCURACY ---")
print(f"{accuracy:.4f} ({accuracy * 100:.2f}%)")

# Detailed evaluation
print("\n--- CLASSIFICATION REPORT ---")
print(classification_report(y_test, y_pred))

# Confusion matrix
print("\n--- CONFUSION MATRIX ---")
print(confusion_matrix(y_test, y_pred))