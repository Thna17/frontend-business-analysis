"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import TransactionDetails from "@/components/payments/success/TransactionDetails";
import { paymentSuccessInfo, transactionDetails } from "@/data/payment-success";

type ReceiptRecord = {
  id: string;
  plan: string;
  amount: string;
  status: string;
  transactionDate: string;
  downloadedAt: string;
  fileName: string;
};

function escapePdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdfContent(lines: string[]) {
  const body = ["BT", "/F1 12 Tf", "50 760 Td", "14 TL"];
  for (const line of lines) {
    body.push(`(${escapePdfText(line)}) Tj`);
    body.push("T*");
  }
  body.push("ET");
  return body.join("\n");
}

function buildPdfDocument(lines: string[]) {
  const contentStream = buildPdfContent(lines);
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function appendLocalReceipt(record: ReceiptRecord) {
  const storageKey = "syntrix.receiptHistory";
  const existingRaw = localStorage.getItem(storageKey);
  const existing: ReceiptRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
  localStorage.setItem(storageKey, JSON.stringify([record, ...existing]));
}

async function persistReceipt(record: ReceiptRecord) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const endpoints = [`${apiBase}/api/receipts`, `${apiBase}/receipts`];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      if (response.ok) return true;
    } catch {
      // Continue trying the next endpoint and fallback.
    }
  }

  appendLocalReceipt(record);
  return false;
}

export default function SuccessCard() {
  const [message, setMessage] = useState("");

  const onDownloadReceipt = async () => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-");
    const planSlug = transactionDetails.plan
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const fileName = `syntrix-receipt-${planSlug || "plan"}-${timestamp}.pdf`;
    const receipt: ReceiptRecord = {
      id: `rcpt-${timestamp}`,
      plan: transactionDetails.plan,
      amount: transactionDetails.amount,
      status: transactionDetails.status,
      transactionDate: transactionDetails.date,
      downloadedAt: now.toISOString(),
      fileName,
    };

    const lines = [
      "Syntrix Receipt",
      "",
      `Receipt ID: ${receipt.id}`,
      `Plan: ${receipt.plan}`,
      `Amount: ${receipt.amount}`,
      `Status: ${receipt.status}`,
      `Transaction Date: ${receipt.transactionDate}`,
      `Downloaded At: ${now.toLocaleString("en-US")}`,
    ];

    const pdfSource = buildPdfDocument(lines);
    const blob = new Blob([pdfSource], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    const savedToBackend = await persistReceipt(receipt);
    setMessage(savedToBackend ? "Receipt downloaded and saved to backend." : "Receipt downloaded and saved locally.");
  };

  return (
    <div className="payment-success-card">
      <div className="success-icon-wrap">
        <div className="success-icon-circle">
          <Check className="size-7 text-white" />
        </div>
      </div>

      <h1 className="payment-success-title">{paymentSuccessInfo.title}</h1>

      <p className="payment-success-description">{paymentSuccessInfo.description}</p>

      <TransactionDetails />

      <div className="payment-success-actions">
        <Link href={paymentSuccessInfo.primaryButtonHref} className="success-primary-btn">
          {paymentSuccessInfo.primaryButtonText}
        </Link>

        <button type="button" className="success-secondary-btn" onClick={onDownloadReceipt}>
          {paymentSuccessInfo.secondaryButtonText}
        </button>
      </div>

      {message ? <p className="mt-3 text-sm text-[#667085]">{message}</p> : null}

      <p className="payment-success-help">
        {paymentSuccessInfo.helpText} <Link href={paymentSuccessInfo.helpLinkHref}>{paymentSuccessInfo.helpLinkText}</Link>
      </p>
    </div>
  );
}
