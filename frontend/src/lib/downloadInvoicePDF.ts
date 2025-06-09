import { OrderWithDetails } from "../types/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "./formatCurrency";

function addDemoDisclaimer(doc: jsPDF, pageWidth: number): void {
  doc.setFillColor(255, 240, 240);
  doc.rect(0, 0, pageWidth, 15, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 0, 0);
  doc.setFontSize(12);
  doc.text("SAMPLE DOCUMENT - NOT A REAL ORDER", pageWidth / 2, 10, {
    align: "center",
  });
}

function addHeaderAndCompanyInfo(doc: jsPDF, pageWidth: number): void {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("Vehicle Configuration Invoice", pageWidth / 2, 25, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Vehicle Configurator David Pospisil", pageWidth / 2, 35, {
    align: "center",
  });
  doc.text("Hochschule Furtwangen HFU", pageWidth / 2, 40, {
    align: "center",
  });
  doc.text("info@davidpospisil.de", pageWidth / 2, 45, {
    align: "center",
  });
}

function addInvoiceDetails(doc: jsPDF, order: OrderWithDetails): void {
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Invoice #: ${order.id}`, 20, 60);
  doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 20, 65);
  doc.text(
    `Payment Method: ${
      order.paymentOption === "financing" ? "Financing" : "Full Payment"
    }`,
    20,
    70
  );
}

function addVehicleDetailsTable(doc: jsPDF, order: OrderWithDetails): void {
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text("Vehicle Details", 20, 85);

  const vehicleDetails = [
    ["Model", order.configuration?.model?.name || "Not specified"],
    ["Type", order.configuration?.model?.type || "Not specified"],
    ["Color", order.configuration?.selectedColor?.name || "Not specified"],
    ["Engine", order.configuration?.selectedEngine?.name || "Not specified"],
    [
      "Transmission",
      order.configuration?.selectedTransmission?.name || "Not specified",
    ],
    ["Rim", order.configuration?.selectedRim?.name || "Not specified"],
    [
      "Interior",
      order.configuration?.selectedUpholstery?.name || "Not specified",
    ],
  ];

  autoTable(doc, {
    startY: 90,
    head: [["Specification", "Value"]],
    body: vehicleDetails,
    theme: "striped",
    headStyles: { fillColor: [25, 113, 194], textColor: 255 },
    styles: { fontSize: 10 },
  });
}

function buildFeaturesData(
  order: OrderWithDetails
): Array<[string, string, string]> {
  const featuresData: Array<[string, string, string]> = [];

  if (order.configuration?.selectedAssistance?.length) {
    order.configuration.selectedAssistance.forEach((feature) => {
      featuresData.push([
        feature.name,
        "Assistance",
        formatCurrency(feature.additionalPrice),
      ]);
    });
  }

  if (order.configuration?.selectedComfort?.length) {
    order.configuration.selectedComfort.forEach((feature) => {
      featuresData.push([
        feature.name,
        "Comfort",
        formatCurrency(feature.additionalPrice),
      ]);
    });
  }

  return featuresData;
}

function addFeaturesSection(doc: jsPDF, order: OrderWithDetails): number {
  let yPos = (doc as any).lastAutoTable?.finalY + 15 || 130;

  if (
    order.configuration?.selectedAssistance?.length ||
    order.configuration?.selectedComfort?.length
  ) {
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("Selected Features", 20, yPos);
    yPos += 5;

    const featuresData = buildFeaturesData(order);

    if (featuresData.length) {
      autoTable(doc, {
        startY: yPos,
        head: [["Feature", "Category", "Price"]],
        body: featuresData,
        theme: "striped",
        headStyles: { fillColor: [25, 113, 194], textColor: 255 },
        styles: { fontSize: 10 },
      });

      yPos = (doc as any).lastAutoTable?.finalY + 15;
    }
  }

  return yPos;
}

function buildPaymentData(order: OrderWithDetails): any[] {
  const paymentData = [];
  const basePrice = order.configuration?.model?.basePrice || 0;

  paymentData.push(["Base Vehicle Price", "", formatCurrency(basePrice)]);

  // Add optional components
  const optionalItems = [
    { item: order.configuration?.selectedColor, label: "Selected Color" },
    { item: order.configuration?.selectedEngine, label: "Selected Engine" },
    { item: order.configuration?.selectedRim, label: "Selected Wheels" },
    {
      item: order.configuration?.selectedUpholstery,
      label: "Selected Interior",
    },
  ];

  optionalItems.forEach(({ item, label }) => {
    if (item?.additionalPrice) {
      paymentData.push([
        label,
        item.name,
        formatCurrency(item.additionalPrice),
      ]);
    }
  });

  // Calculate and add feature total
  const featureTotal = [
    ...(order.configuration?.selectedAssistance || []),
    ...(order.configuration?.selectedComfort || []),
  ].reduce((sum, feature) => sum + feature.additionalPrice, 0);

  if (featureTotal > 0) {
    paymentData.push(["Additional Features", "", formatCurrency(featureTotal)]);
  }

  paymentData.push([
    "Total Price",
    "",
    formatCurrency(order.configuration?.totalPrice || 0),
  ]);

  return paymentData;
}

function addFinancingDetails(
  paymentData: any[],
  order: OrderWithDetails
): void {
  if (order.paymentOption === "financing" && order.financing) {
    try {
      const financingDetails =
        typeof order.financing === "string"
          ? JSON.parse(order.financing)
          : order.financing;

      paymentData.push(["", "", ""]);
      paymentData.push(["Financing Details", "", ""]);
      paymentData.push([
        "Term",
        financingDetails.label || `${financingDetails.months} Months`,
        "",
      ]);
      paymentData.push(["Interest Rate", financingDetails.rate, ""]);
      paymentData.push([
        "Monthly Payment",
        "",
        formatCurrency(financingDetails.monthlyPayment),
      ]);
      paymentData.push([
        "Total Amount (with financing)",
        "",
        formatCurrency(financingDetails.totalAmount),
      ]);
    } catch (e) {
      paymentData.push(["Financing details unavailable", "", ""]);
    }
  }
}

function addPaymentDetailsTable(
  doc: jsPDF,
  order: OrderWithDetails,
  yPos: number
): void {
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text("Payment Details", 20, yPos);

  const paymentData = buildPaymentData(order);
  addFinancingDetails(paymentData, order);

  autoTable(doc, {
    startY: yPos + 5,
    head: [["Item", "Description", "Price"]],
    body: paymentData,
    theme: "striped",
    headStyles: { fillColor: [25, 113, 194], textColor: 255 },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: "bold" },
      2: { halign: "right" },
    },
    foot: [
      [
        "",
        "Total Amount",
        formatCurrency(order.configuration?.totalPrice || 0),
      ],
    ],
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
  });
}

function addFooter(doc: jsPDF): void {
  const finalY = (doc as any).lastAutoTable?.finalY + 20;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Thank you for your order. This document serves as not a official invoice.",
    20,
    finalY
  );
  doc.text(
    "For questions or assistance, please contact our customer support.",
    20,
    finalY + 5
  );
}

export function downloadInvoicePDF(order: OrderWithDetails): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  addDemoDisclaimer(doc, pageWidth);
  addHeaderAndCompanyInfo(doc, pageWidth);
  addInvoiceDetails(doc, order);
  addVehicleDetailsTable(doc, order);

  const yPos = addFeaturesSection(doc, order);
  addPaymentDetailsTable(doc, order, yPos);
  addFooter(doc);

  const fileName = `invoice-order-${order.id}.pdf`;
  doc.save(fileName);
}
