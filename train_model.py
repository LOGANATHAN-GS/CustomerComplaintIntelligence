import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

train_file = "data/train.csv"

# Load training data
train = pd.read_csv(train_file)

# Create TF-IDF
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2)
)

X_train = vectorizer.fit_transform(train["complaint_text"])
y_train = train["category"]

print("Training samples:", X_train.shape[0])
print("Features:", X_train.shape[1])

# Create and train model
model = LogisticRegression(
    max_iter=1000
)

model.fit(X_train, y_train)

# Save model and vectorizer
joblib.dump(model, "complaint_model.pkl")
joblib.dump(vectorizer, "tfidf_vectorizer.pkl")

print("\nModel training completed.")
print("Saved: complaint_model.pkl")
print("Saved: tfidf_vectorizer.pkl")