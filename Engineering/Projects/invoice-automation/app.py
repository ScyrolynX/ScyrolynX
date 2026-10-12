from datetime import date
import csv

def process_sale(sale):
    try:
        quantity = int(sale["quantity"])
        price = float(sale["price"])
    except (ValueError, KeyError) as e:
        print(f"Skipped row for {sale.get('customer', 'unknown')}: invalid data ({e})")
        return None
    total = calculate_total(quantity, price)
    generate_invoice(sale, quantity, price, total)
    return total

def calculate_total(quantity, price):
    return quantity * price

def generate_invoice(sale, quantity, price, total):
    invoice_date = date.today()
    invoice_filename = f"{sale['invoice_id']}.txt"
    with open(invoice_filename, "w") as invoice:
        invoice.write("================================\n")
        invoice.write("           ScyrolynX\n")
        invoice.write("    Business Automation\n")
        invoice.write("================================\n\n")
        invoice.write("INVOICE\n\n")
        invoice.write(f"Invoice ID : {sale['invoice_id']}\n")
        invoice.write(f"Invoice Date: {invoice_date}\n")
        invoice.write(f"Customer   : {sale['customer']}\n\n")
        invoice.write("------------------------------------------------------------\n")
        invoice.write("Product                  Qty        Price          Total\n")
        invoice.write("------------------------------------------------------------\n")
        invoice.write(f"{sale['product']:<25} {quantity:<10} ${price:<13.2f} ${total:.2f}\n")
        invoice.write("------------------------------------------------------------\n")
        invoice.write(f"{'Subtotal:':>49} ${total:.2f}\n")
        invoice.write(f"{'Tax:':>49} $0.00\n")
        invoice.write("---------------------------------------------\n")
        invoice.write(f"{'Total:':>49} ${total:.2f}\n")

def generate_summary_report(rows, grand_total):
    """One-page HTML report — this is the screenshot/demo artifact."""
    html_rows = "\n".join(
        f"<tr><td>{r['invoice_id']}</td><td>{r['customer']}</td>"
        f"<td>{r['product']}</td><td>{r['quantity']}</td>"
        f"<td>${r['price']:.2f}</td><td>${r['total']:.2f}</td></tr>"
        for r in rows
    )
    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>ScyrolynX Sales Report</title>
<style>
body {{
    font-family: 'Helvetica Neue', Arial, sans-serif;
    margin: 0; padding: 50px;
    background: #eceef2; color: #16161d;
}}
.container {{
    background: white; max-width: 800px; margin: 0 auto;
    padding: 50px; border-radius: 10px;
}}
.top {{
    display: flex; justify-content: space-between; align-items: flex-start;
}}
.wordmark {{
    font-size: 46px; font-weight: 800; letter-spacing: -1.5px; margin: 0;
}}
.wordmark span {{ color: #6c3ce9; }}
.invoice-to {{ text-align: right; font-size: 14px; color: #555; }}
.invoice-to strong {{ color: #16161d; font-size: 16px; }}
.tags {{ margin: 25px 0; display: flex; gap: 12px; flex-wrap: wrap; }}
.tag {{
    background: #f0edfb; color: #6c3ce9; padding: 8px 16px;
    border-radius: 20px; font-size: 13px; font-weight: 600;
}}
table {{ border-collapse: collapse; width: 100%; margin-top: 10px; }}
th {{
    background: #16161d; color: white; text-align: left; padding: 12px;
    font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;
}}
td {{ padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }}
tr:nth-child(even) td {{ background: #fafafa; }}
.summary {{
    display: flex; justify-content: flex-end; align-items: center;
    gap: 20px; margin-top: 25px;
}}
.summary-lines {{ text-align: right; font-size: 14px; color: #555; }}
.total-box {{
    background: linear-gradient(135deg, #16161d, #6c3ce9);
    color: white; padding: 18px 28px; border-radius: 8px; text-align: right;
}}
.total-box .label {{ font-size: 12px; opacity: 0.75; text-transform: uppercase; }}
.total-box .amount {{ font-size: 26px; font-weight: 700; }}
.footer {{
    margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee;
    display: flex; justify-content: space-between; font-size: 13px; color: #888;
}}
</style></head><body>
<div class="container">
  <div class="top">
    <h1 class="wordmark">Scyrolyn<span>X</span></h1>
    <div class="invoice-to">
      Automated Sales Report<br>
      <strong>{date.today()}</strong>
    </div>
  </div>
  <div class="tags">
    <div class="tag">Auto-generated</div>
    <div class="tag">{len(rows)} invoices processed</div>
  </div>
  <table>
    <tr><th>Invoice ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr>
    {html_rows}
  </table>
  <div class="summary">
    <div class="total-box">
      <div class="label">Grand Total</div>
      <div class="amount">${grand_total:.2f}</div>
    </div>
  </div>
  <div class="footer">
    <span>ScyrolynX Business Automation</span>
  </div>
</div>
</body></html>"""
    with open("sales_report.html", "w") as f:
        f.write(html)


def main():
    with open("sales.csv", newline="") as file:
        sales = csv.DictReader(file)
        grand_total = 0
        report_rows = []
        for sale in sales:
            total = process_sale(sale)
            if total is None:
                continue
            grand_total += total
            report_rows.append({
                "invoice_id": sale["invoice_id"],
                "customer": sale["customer"],
                "product": sale["product"],
                "quantity": sale["quantity"],
                "price": float(sale["price"]),
                "total": total,
            })
            print(f"{sale['customer']}: ${total:.2f}")
        print(f"Grand Total: ${grand_total:.2f}")
        generate_summary_report(report_rows, grand_total)
        print("Report saved to sales_report.html")

if __name__ == "__main__":
    main()