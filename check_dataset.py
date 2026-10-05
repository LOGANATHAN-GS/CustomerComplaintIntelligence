import pandas as pd

file_path = "data/bitext_customer_support.csv"

df = pd.read_csv(file_path)

print("\n--- DATASET CHECK ---")

print("Total rows:", len(df))

print("\nMissing values:")
print(df[["instruction", "category"]].isnull().sum())

print("\nDuplicate rows:", df.duplicated().sum())

print("\nDuplicate instructions:",
      df["instruction"].duplicated().sum())

print("\nNumber of categories:",
      df["category"].nunique())

print("\nCategories:")
print(df["category"].value_counts())

print("\nSample complaints:")
print(df[["instruction", "category"]].head(10).to_string(index=False))