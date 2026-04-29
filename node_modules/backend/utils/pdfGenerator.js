import PDFDocument from "pdfkit-table";
import { formatCurrencyInr } from "./orderUtils.js";
import QRCode from "qrcode";

export const generateInvoicePdf = async (order, options = {}) => {
  const baseUrl = String(options.baseUrl || "http://localhost:5173").replace(/\/$/, "");
  const userEmail = String(options.userEmail || "");

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 30, size: "A4" });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on("error", (err) => {
        reject(err);
      });

      doc
        .fillColor("#e91e63")
        .fontSize(25)
        .text("zepto", 30, 30, { align: "left" })
        .fillColor("#333")
        .fontSize(10)
        .text("zepto Private Limited", 30, 60)
        .text("Kamala Towers, Urwa Market, Urwa", 30, 75)
        .text("Mangaluru, Karnataka 575006", 30, 90)
        .text("India", 30, 105);

      doc
        .fontSize(30)
        .fillColor("#666")
        .text("INVOICE", 400, 30, { align: "right" });

      doc
        .fontSize(10)
        .fillColor("#333")
        .text(`Invoice#: ${order.paymentDetails?.orderId || "N/A"}`, 400, 75, { align: "right" })
        .text(`Invoice Date: ${new Date(order.orderedAt || Date.now()).toLocaleDateString("en-IN")}`, 400, 90, { align: "right" })
        .text(`Payment: ${order.paymentDetails?.method || "N/A"}`, 400, 105, { align: "right" });

      const orderId = String(order.paymentDetails?.orderId || order.paymentDetails?.paymentId || "");
      if (orderId) {
        const orderUrl = `${baseUrl}/order-success?orderId=${encodeURIComponent(orderId)}`;
        try {
          const qrSize = 60;
          const dataUrl = await QRCode.toDataURL(orderUrl, { margin: 1, width: qrSize * 2 });
          const base64 = dataUrl.split(",")[1];
          const imgBuffer = Buffer.from(base64, "base64");
          doc.image(imgBuffer, 505, 120, { width: qrSize });
          doc.fontSize(7).fillColor("#666").text("Scan to track order", 505, 120 + qrSize + 2, { width: qrSize, align: "center" });
        } catch (err) {
          console.warn("Header QR generation failed", err && err.message);
        }
      }

      const shipping = order.shippingAddress || {};
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Bill To:", 30, 150)
        .font("Helvetica")
        .fontSize(10)
        .text(shipping.name || "N/A", 30, 165)
        .text(`${shipping.address || ""}, ${shipping.city || ""}`, 30, 180)
        .text(`${shipping.postalCode || ""}, ${shipping.country || ""}`, 30, 195)
        .text(`Phone: ${shipping.phone || "N/A"}`, 30, 210);

      const items = Array.isArray(order.items) ? order.items : [];
      const table = {
        title: "",
        headers: [
          { label: "Item Description", property: "name", width: 250, headerColor: "#555", headerOpacity: 1 },
          { label: "Qty", property: "quantity", width: 50, headerColor: "#555", headerOpacity: 1 },
          { label: "Rate", property: "price", width: 100, headerColor: "#555", headerOpacity: 1 },
          { label: "Amount", property: "amount", width: 100, headerColor: "#555", headerOpacity: 1 },
        ],
        datas: items.map((item) => {
          const qty = Number(item.quantity || 0);
          const rate = Number(item.price || 0);
          return {
            name: String(item.name || "Unknown Item"),
            quantity: qty.toString(),
            price: formatCurrencyInr(rate),
            amount: formatCurrencyInr(qty * rate),
          };
        }),
      };

      doc.moveDown(12);
      await doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10).fillColor("#ffffff"),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("Helvetica").fontSize(10).fillColor("#333333");
        },
        columnsSize: [250, 50, 100, 100],
      });

      const summaryY = doc.y + 20;
      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Sub Total:", 350, summaryY, { width: 100, align: "left" })
        .text(formatCurrencyInr(order.itemTotal), 450, summaryY, { width: 100, align: "right" });

      doc
        .text("Handling Fee:", 350, summaryY + 15, { width: 100, align: "left" })
        .text(formatCurrencyInr(order.handlingFee), 450, summaryY + 15, { width: 100, align: "right" });

      doc
        .text("Delivery Fee:", 350, summaryY + 30, { width: 100, align: "left" })
        .text(formatCurrencyInr(order.deliveryFee), 450, summaryY + 30, { width: 100, align: "right" });

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .rect(340, summaryY + 50, 225, 30)
        .fill("#f5f5f5")
        .stroke("#ccc")
        .fillColor("#333")
        .text("TOTAL", 350, summaryY + 60, { width: 100, align: "left" })
        .text(formatCurrencyInr(order.totalAmount), 450, summaryY + 60, { width: 100, align: "right" });

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#666")
        .text("Notes:", 30, summaryY + 100)
        .text("It was great doing business with you.", 30, summaryY + 115)
        .text("Terms & Conditions:", 30, summaryY + 140)
        .text("Please make the payment by the due date.", 30, summaryY + 155);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
