import joblib

# Load trained model and TF-IDF vectorizer
model = joblib.load("models/complaint_model.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

complaints = [
    # ACCOUNT
    "I am unable to sign in to my account",
    "I want to change my account details",

    # ORDER
    "I want to place a new order",
    "Can you tell me the status of my order",

    # REFUND
    "When will I get the money from my refund",
    "I would like to request a refund for my purchase",

    # INVOICE
    "Where can I find my invoice",
    "I need the invoice for my recent purchase",

    # CONTACT
    "I need to speak with a customer service agent",
    "How do I reach your support team",

    # PAYMENT
    "My payment was declined",
    "Why was my card charged during the payment",

    # FEEDBACK
    "I would like to give feedback about your service",
    "I want to report my experience with the service",

    # DELIVERY
    "When should I expect my package to arrive",
    "My order has not arrived yet",

    # SHIPPING
    "I need to update the delivery address",
    "Can I change the shipping address",

    # SUBSCRIPTION
    "I want to stop my newsletter subscription",
    "How do I manage my subscription",

    # CANCEL
    "I want to cancel the service",
    "How can I cancel my request"
]
# Convert complaints to TF-IDF
X = vectorizer.transform(complaints)

# Predict categories
predictions = model.predict(X)

# Get confidence scores
probabilities = model.predict_proba(X)
confidence = probabilities.max(axis=1)

print("\n--- COMPLAINT PREDICTIONS ---")

for complaint, prediction, score in zip(
    complaints, predictions, confidence
):
    print("\nComplaint:", complaint)
    print("Predicted category:", prediction)
    print(f"Confidence: {score * 100:.2f}%")