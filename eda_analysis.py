import pandas as pd
import matplotlib.pyplot as plt

file_path = "data/cleaned_complaints.csv"

# Load cleaned dataset
df = pd.read_csv(file_path)

print("\n--- DATASET INFORMATION ---")
print("Total complaints:", len(df))
print("Total categories:", df["category"].nunique())

# --------------------------------------------------
# 1. CATEGORY COUNTS
# --------------------------------------------------

print("\n--- CATEGORY DISTRIBUTION ---")
category_counts = df["category"].value_counts()
print(category_counts)

# --------------------------------------------------
# 2. COMPLAINT TEXT LENGTH
# --------------------------------------------------

df["text_length"] = df["complaint_text"].str.len()

print("\n--- COMPLAINT TEXT LENGTH ---")
print("Average length:", round(df["text_length"].mean(), 2))
print("Shortest complaint:", df["text_length"].min())
print("Longest complaint:", df["text_length"].max())

# --------------------------------------------------
# 3. CATEGORY BAR CHART
# --------------------------------------------------

plt.figure(figsize=(10, 6))

category_counts.plot(kind="bar")

plt.title("Customer Complaints by Category")
plt.xlabel("Category")
plt.ylabel("Number of Complaints")
plt.xticks(rotation=45)
plt.tight_layout()

plt.savefig("category_distribution.png")
plt.show()

# --------------------------------------------------
# 4. TEXT LENGTH HISTOGRAM
# --------------------------------------------------

plt.figure(figsize=(10, 6))

df["text_length"].plot(kind="hist", bins=30)

plt.title("Complaint Text Length Distribution")
plt.xlabel("Number of Characters")
plt.ylabel("Number of Complaints")
plt.tight_layout()

plt.savefig("complaint_length_distribution.png")
plt.show()

# --------------------------------------------------
# 5. TOP AND BOTTOM CATEGORIES
# --------------------------------------------------

print("\n--- MOST COMMON CATEGORY ---")
print(category_counts.idxmax(), ":", category_counts.max())

print("\n--- LEAST COMMON CATEGORY ---")
print(category_counts.idxmin(), ":", category_counts.min())