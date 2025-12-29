import { ServiceRequest } from "../types";

export interface ExportOptions {
  format: "csv" | "json" | "excel";
  filename?: string;
  includeHeaders?: boolean;
}

export class ExportService {
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  static escapeCSVField(field: string): string {
    if (
      typeof field === "string" &&
      (field.includes(",") || field.includes('"') || field.includes("\n"))
    ) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }

  static exportToCSV(
    data: ServiceRequest[],
    options: Partial<ExportOptions> = {}
  ): void {
    if (data.length === 0) {
      throw new Error("No data to export");
    }

    const headers = [
      "Service Name",
      "Category",
      "Status",
      "Service Provider",
      "Submitted Date",
      "Requested By",
      "Email",
      "Description",
    ];

    const csvData = data.map((request) => [
      this.escapeCSVField(request.serviceName),
      this.escapeCSVField(request.category),
      this.escapeCSVField(request.status),
      this.escapeCSVField(request.serviceProvider || "N/A"),
      this.escapeCSVField(this.formatDate(request.submittedDate)),
      this.escapeCSVField(request.requestedBy?.name || "Unknown"),
      this.escapeCSVField(request.requestedBy?.email || "N/A"),
      this.escapeCSVField(request.description || "N/A"),
    ]);

    const csvContent = [
      ...(options.includeHeaders !== false ? [headers.join(",")] : []),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    this.downloadFile(
      csvContent,
      "text/csv;charset=utf-8;",
      options.filename ||
        `service-requests-${new Date().toISOString().split("T")[0]}.csv`
    );
  }

  static exportToJSON(
    data: ServiceRequest[],
    options: Partial<ExportOptions> = {}
  ): void {
    if (data.length === 0) {
      throw new Error("No data to export");
    }

    const jsonContent = JSON.stringify(data, null, 2);

    this.downloadFile(
      jsonContent,
      "application/json;charset=utf-8;",
      options.filename ||
        `service-requests-${new Date().toISOString().split("T")[0]}.json`
    );
  }

  static exportData(data: ServiceRequest[], options: ExportOptions): void {
    switch (options.format) {
      case "csv":
        this.exportToCSV(data, options);
        break;
      case "json":
        this.exportToJSON(data, options);
        break;
      case "excel":
        // For Excel export, you would typically use a library like xlsx
        // For now, we'll fall back to CSV
        console.warn("Excel export not implemented, falling back to CSV");
        this.exportToCSV(data, options);
        break;
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  private static downloadFile(
    content: string,
    mimeType: string,
    filename: string
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      throw new Error("File download not supported in this browser");
    }
  }

  static getExportSummary(data: ServiceRequest[]): string {
    const statusCounts = data.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const summary = Object.entries(statusCounts)
      .map(([status, count]) => `${status}: ${count}`)
      .join(", ");

    return `Exporting ${data.length} records (${summary})`;
  }
}
