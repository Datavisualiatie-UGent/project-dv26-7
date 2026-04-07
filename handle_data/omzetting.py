import pandas as pd
import os

def excel_sheets_to_csv(file_path, output_folder="output"):
    os.makedirs(output_folder, exist_ok=True)

    target_sheets = ["Country", "Region ", "Global"]

    xls = pd.ExcelFile(file_path)
    print(xls.sheet_names)

    for sheet in target_sheets:
        if sheet in xls.sheet_names:
            df = pd.read_excel(xls, sheet_name=sheet)

            df = df.dropna(how="all")

            output_file = os.path.join(output_folder, f"{sheet}.csv")

            df.to_csv(output_file, index=False)

            print(f"Saved: {output_file}")
        else:
            print(f"Warning: Sheet '{sheet}' not found in file.")

if __name__ == "__main__":
    file_path = "IRENA_Statistics_Extract_2025H2.xlsx"
    excel_sheets_to_csv(file_path)