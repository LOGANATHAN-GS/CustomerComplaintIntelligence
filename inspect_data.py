import pandas as pd

file_path = "data/complaints_raw.csv"

product_counts = {}

for chunk in pd.read_csv(
    file_path,
    chunksize=10000,
    usecols=[
        "Product",
        "Consumer complaint narrative"
    ]
):

    # Keep only complaints that have actual text
    chunk = chunk.dropna(subset=["Consumer complaint narrative"])

    # Count complaints for each product
    counts = chunk["Product"].value_counts()

    for product, count in counts.items():
        product_counts[product] = product_counts.get(product, 0) + count


print("\n--- COMPLAINT CATEGORIES ---")

sorted_products = sorted(
    product_counts.items(),
    key=lambda x: x[1],
    reverse=True
)

for product, count in sorted_products:
    print(f"{count:>10}  {product}")

print("\nTotal categories:", len(sorted_products))
print("Total complaints with narratives:", sum(product_counts.values()))