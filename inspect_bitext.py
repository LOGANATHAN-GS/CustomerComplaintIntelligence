import pandas as pd

file_path = "data/bitext_customer_support.csv"

# Read the dataset
df = pd.read_csv(file_path)

print("\n--- DATASET SIZE ---")
print("Rows:", len(df))
print("Columns:", len(df.columns))

print("\n--- COLUMN NAMES ---")
print(df.columns.tolist())

print("\n--- SAMPLE DATA ---")
print(df.head(5).to_string())

print("\n--- CATEGORY COUNTS ---")
print(df["category"].value_counts())

print("\n--- INTENT COUNTS ---")
print(df["intent"].value_counts())