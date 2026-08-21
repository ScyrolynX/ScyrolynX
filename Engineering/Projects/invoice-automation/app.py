from datetime import date
import csv

def process_sale(sale):
    quantity = int(sale["quantity"])
    price = float(sale["price"])

    total = calculate_total(quantity, price)

    generate_invoice(sale, quantity, price, total)

    return total

def calculate_total(quantity, price):
    return quantity * price

def generate_invoice(sale, quantity, price, total):
    invoice_date = date.today()
    subtotal = total
    invoice_filename = f"{sale['invoice_id']}.txt"

    with open(invoice_filename, "w") as invoice:
        invoice.write("================================\n")
        invoice.write("           SCYROLYNX\n")
        invoice.write("    Business Automation\n")
        invoice.write("================================\n\n")

        invoice.write("INVOICE             \n\n")

        invoice.write(f"Invoice ID : {sale['invoice_id']}\n")
        invoice.write(f"Invoice Date: {invoice_date}\n")
        invoice.write(f"Customer   : {sale['customer']}\n\n")

        invoice.write("------------------------------------------------------------\n")
        invoice.write("Product                  Qty        Price          Total\n")
        invoice.write("------------------------------------------------------------\n")
        invoice.write(f"{sale['product']:<25} {quantity:<10} ${price:<13.2f} ${total:.2f}\n")
        invoice.write("------------------------------------------------------------\n")

        invoice.write(f"{'Subtotal:':>49} ${subtotal:.2f}\n")
        invoice.write(f"{'Tax:':>49} $0.00\n")
        invoice.write("---------------------------------------------\n")
        invoice.write(f"{'Total:':>49} ${total:.2f}\n")

def main():
    with open("sales.csv", newline="") as file:
        sales = csv.DictReader(file)
        grand_total = 0

        for sale in sales:
            total = process_sale(sale)
            grand_total += total

            print(f"{sale['customer']}: ${total:.2f}")
        print(f"Grand Total: ${grand_total:.2f}")
   
if __name__ == "__main__":
    main()