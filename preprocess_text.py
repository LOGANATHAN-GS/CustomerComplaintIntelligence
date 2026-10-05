import pandas as pd
import re

input_file = "data/cleaned_complaints.csv"
output_file = "data/preprocessed_complaints.csv"

# Load cleaned dataset
df = pd.read_csv(input_file)

print("Original rows:", len(df))


def clean_text(text):
    text = str(text).lower()

    # Remove placeholders such as {{Order Number}}
    text = re.sub(r"\{\{.*?\}\}", "", text)

    # Keep only letters and spaces
    text = re.sub(r"[^a-z\s]", " ", text)

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()


# Clean complaint text
df["complaint_text"] = df["complaint_text"].apply(clean_text)

# Save preprocessed dataset
df.to_csv(output_file, index=False)

print("Saved rows:", len(df))
print("Saved to:", output_file)

print("\nSample:")
print(df.head(10).to_string(index=False))