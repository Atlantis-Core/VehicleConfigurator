import { OrderWithDetails } from '../types/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './formatCurrency';

export function downloadInvoicePDF (order: OrderWithDetails)  {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Add DEMO disclaimer at the top
  doc.setFillColor(255, 240, 240);
  doc.rect(0, 0, pageWidth, 15, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 0, 0);
  doc.setFontSize(12);
  doc.text("SAMPLE DOCUMENT - NOT A REAL ORDER", pageWidth / 2, 10, {
    align: "center",
  });

  // Company info and branding
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("Vehicle Configuration Invoice", pageWidth / 2, 25, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Vehicle Configurator David Pospisil", pageWidth / 2, 35, { align: "center" });
  doc.text("Hochschule Furtwangen HFU", pageWidth / 2, 40, {
    align: "center",
  });
  doc.text("info@davidpospisil.de", pageWidth / 2, 45, {
    align: "center",
  });

  // Invoice details
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

  // Vehicle info
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text("Vehicle Details", 20, 85);

  // Vehicle specs table
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

  // Features section
  let yPos = (doc as any).lastAutoTable?.finalY + 15 || 130;

  if (
    order.configuration?.selectedAssistance?.length ||
    order.configuration?.selectedComfort?.length
  ) {
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("Selected Features", 20, yPos);
    yPos += 5;

    const featuresData: Array<[string, string, string]> = [];

    // Add assistance features
    if (order.configuration?.selectedAssistance?.length) {
      order.configuration.selectedAssistance.forEach((feature) => {
        featuresData.push([
          feature.name,
          "Assistance",
          formatCurrency(feature.additionalPrice),
        ]);
      });
    }

    // Add comfort features
    if (order.configuration?.selectedComfort?.length) {
      order.configuration.selectedComfort.forEach((feature) => {
        featuresData.push([
          feature.name,
          "Comfort",
          formatCurrency(feature.additionalPrice),
        ]);
      });
    }

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

  // Payment details
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text("Payment Details", 20, yPos);

  let paymentData = [];
  const basePrice = order.configuration?.model?.basePrice || 0;

  // Base vehicle price
  paymentData.push(["Base Vehicle Price", "", formatCurrency(basePrice)]);

  // Add options prices
  if (order.configuration?.selectedColor?.additionalPrice) {
    paymentData.push([
      "Selected Color",
      order.configuration.selectedColor.name,
      formatCurrency(order.configuration.selectedColor.additionalPrice),
    ]);
  }

  if (order.configuration?.selectedEngine?.additionalPrice) {
    paymentData.push([
      "Selected Engine",
      order.configuration.selectedEngine.name,
      formatCurrency(order.configuration.selectedEngine.additionalPrice),
    ]);
  }

  if (order.configuration?.selectedRim?.additionalPrice) {
    paymentData.push([
      "Selected Wheels",
      order.configuration.selectedRim.name,
      formatCurrency(order.configuration.selectedRim.additionalPrice),
    ]);
  }

  if (order.configuration?.selectedUpholstery?.additionalPrice) {
    paymentData.push([
      "Selected Interior",
      order.configuration.selectedUpholstery.name,
      formatCurrency(order.configuration.selectedUpholstery.additionalPrice),
    ]);
  }

  // Total for features
  const featureTotal = [
    ...(order.configuration?.selectedAssistance || []),
    ...(order.configuration?.selectedComfort || []),
  ].reduce((sum, feature) => sum + feature.additionalPrice, 0);

  if (featureTotal > 0) {
    paymentData.push(["Additional Features", "", formatCurrency(featureTotal)]);
  }

  // Total price
  paymentData.push([
    "Total Price",
    "",
    formatCurrency(order.configuration?.totalPrice || 0),
  ]);

  // Add financing details if applicable
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

  // Footer text
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

  // Save the PDF with a filename
  const fileName = `invoice-order-${order.id}.pdf`;
  doc.save(fileName);
};
