import pandas as pd

input_file = "data/bitext_customer_support.csv"
output_file = "data/cleaned_complaints.csv"

# Read the original dataset
df = pd.read_csv(input_file)

print("Original rows:", len(df))

# Keep only the columns needed for our AI model
df = df[["instruction", "category"]]

# Rename columns to clear project names
df = df.rename(columns={
    "instruction": "complaint_text"
})

# Remove missing values
df = df.dropna(subset=["complaint_text", "category"])

# Remove empty complaints
df["complaint_text"] = df["complaint_text"].astype(str).str.strip()
df = df[df["complaint_text"] != ""]

# Remove duplicate complaint texts
df = df.drop_duplicates(subset=["complaint_text"])

# Reset row numbers
df = df.reset_index(drop=True)

# Save cleaned dataset
df.to_csv(output_file, index=False)

print("Cleaned rows:", len(df))
print("Removed rows:", 26872 - len(df))

print("\nCategory counts:")
print(df["category"].value_counts())

print("\nSaved to:", output_file)