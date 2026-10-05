import pandas as pd
from sklearn.model_selection import train_test_split

input_file = "data/preprocessed_complaints.csv"

train_file = "data/train.csv"
test_file = "data/test.csv"

# Load preprocessed data
df = pd.read_csv(input_file)

print("Total rows:", len(df))

# Split into 80% training and 20% testing
train, test = train_test_split(
    df,
    test_size=0.20,
    random_state=42,
    stratify=df["category"]
)

# Save datasets
train.to_csv(train_file, index=False)
test.to_csv(test_file, index=False)

print("\nTraining rows:", len(train))
print("Testing rows:", len(test))

print("\nTraining category distribution:")
print(train["category"].value_counts())

print("\nTesting category distribution:")
print(test["category"].value_counts())

print("\nSaved:")
print(train_file)
print(test_file)