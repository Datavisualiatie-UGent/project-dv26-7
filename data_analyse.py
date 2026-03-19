import pandas as pd

def analyze_excel(file_path):
    xls = pd.ExcelFile(file_path)
    
    results = {}

    for sheet_name in xls.sheet_names:
        if sheet_name == "About" or sheet_name == "Pivot":
            continue

        df = pd.read_excel(xls, sheet_name=sheet_name)

        total_rows = len(df)

        column_stats = {}

        for col in df.columns:
            filled_count = df[col].notna().sum()

            column_stats[col] = {
                "filled_rows": int(filled_count),
                "missing_rows": int(total_rows - filled_count),
                "fill_percentage": round((filled_count / total_rows) * 100, 2) if total_rows > 0 else 0
            }

        results[sheet_name] = {
            "total_rows": int(total_rows),
            "columns": column_stats
        }

    return results


def print_results(results):
    for sheet, data in results.items():
        print(f"\n=== Sheet: {sheet} ===")
        print(f"Total Rows: {data['total_rows']}")

        for col, stats in data["columns"].items():
            print(f"\nColumn: {col}")
            print(f"  Filled Rows: {stats['filled_rows']}")
            print(f"  Missing Rows: {stats['missing_rows']}")
            print(f"  Fill %: {stats['fill_percentage']}%")


if __name__ == "__main__":
    file_path = "IRENA_Statistics_Extract_2025H2.xlsx"
    results = analyze_excel(file_path)
    print_results(results)