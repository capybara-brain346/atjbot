import pandas as pd

def allowance_cleaner(input_path, output_file_path):
    # Step 1: Load CSV Data
    df = pd.read_csv(input_path)  # Replace with your CSV file path

    # Step 2: Clean Data
    # Remove unnecessary columns (if needed) - example: df.drop(columns=['unnecessary_column'], inplace=True)
    df.dropna(inplace=True)  # Remove rows with missing values
    df.fillna('', inplace=True)  # Fill missing values with empty strings if needed

    # Step 3: Convert Data to Text Format
    def row_to_text(row):
        # Customize the format of your text representation here
        text = ", ".join([f"{col}: {str(row[col])}" for col in df.columns if row[col]])  # Skip empty values
        return text

    # Apply the function to convert each row into a paragraph-like string
    text_data = df.apply(row_to_text, axis=1).tolist()

    # Combine all rows into a single text with paragraphs
    paragraph_text = "\n\n".join(text_data)

    # Step 4: Save the output to a txt file
    with open(output_file_path, 'w', encoding='utf-8') as file:
        file.write(paragraph_text)

    print(f"The output has been saved to {output_file_path}")


def main():
    allowance_cleaner(r'bot\data\csv\allowance1.csv', r'bot\data\csv\allowance1.txt')
    allowance_cleaner(r'bot\data\csv\allowance2.csv', r'bot\data\csv\allowance2.txt')

if __name__ == "__main__":
    main()
