import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib

train_file = "data/train.csv"
test_file = "data/test.csv"

# Load training and testing data
train = pd.read_csv(train_file)
test = pd.read_csv(test_file)

# Create TF-IDF vectorizer
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2)
)

# Learn vocabulary ONLY from training data
X_train = vectorizer.fit_transform(train["complaint_text"])

# Transform test data using the same vocabulary
X_test = vectorizer.transform(test["complaint_text"])

print("Training samples:", X_train.shape[0])
print("Training features:", X_train.shape[1])

print("Testing samples:", X_test.shape[0])
print("Testing features:", X_test.shape[1])

# Save vectorizer
joblib.dump(vectorizer, "tfidf_vectorizer.pkl")

print("\nTF-IDF completed.")
print("Saved: tfidf_vectorizer.pkl")