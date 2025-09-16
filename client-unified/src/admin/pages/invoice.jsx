import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Download, Eye, Trash2, Search, X } from "lucide-react";

export default function AdminInvoicesPage({
  apiBase = import.meta.env.VITE_API_BASE_URL || "",
}) {
  const BASE = apiBase ? apiBase + "/admin/invoices" : null;

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock data
  const mockInvoices = [
    {
      _id: "1",
      user: { name: "John Doe", email: "john@example.com" },
      amount: 250,
      createdAt: new Date().toISOString(),
      status: "approved",
      fileUrl: "https://via.placeholder.com/600x800.png?text=Invoice+1",
    },
    {
      _id: "2",
      user: { name: "Jane Smith", email: "jane@example.com" },
      amount: 500,
      createdAt: new Date().toISOString(),
      status: "pending",
      fileUrl: "https://via.placeholder.com/600x800.png?text=Invoice+2",
    },
    {
      _id: "3",
      user: { name: "Mark Lee", email: "mark@example.com" },
      amount: 120,
      createdAt: new Date().toISOString(),
      status: "rejected",
      fileUrl: "https://via.placeholder.com/600x800.png?text=Invoice+3",
    },
  ];

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, query, refreshKey]);

  async function fetchInvoices() {
    setLoading(true);
    setError("");
    try {
      if (!BASE) {
        setInvoices(mockInvoices);
        setTotalPages(1);
        return;
      }
      const res = await axios.get(`${BASE}`, {
        params: { page, limit, q: query },
      });
      const data = res.data;
      if (data && Array.isArray(data.invoices)) {
        setInvoices(data.invoices);
        setTotalPages(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        setInvoices(data);
        setTotalPages(1);
      } else if (data && Array.isArray(data.data)) {
        setInvoices(data.data);
        setTotalPages(data.totalPages || 1);
      } else {
        setInvoices(data.invoices || data.items || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
      setInvoices(mockInvoices);
      setError("Using mock data (API fetch failed)");
    } finally {
      setLoading(false);
    }
  }

  const humanDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch (e) {
      return iso;
    }
  };

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      if (BASE) {
        await axios.delete(`${BASE}/${id}`);
      }
      setRefreshKey((k) => k + 1);
      toastMessage("Invoice deleted");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to delete invoice");
    }
  }

  function handlePreview(invoice) {
    setSelectedInvoice(invoice);
  }

  function handleDownload(invoice) {
    if (!invoice?.fileUrl) return alert("No file available to download");
    const a = document.createElement("a");
    a.href = invoice.fileUrl;
    const fname = `invoice-${invoice._id || Date.now()}`;
    a.download = fname;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function toastMessage(msg) {
    const id = `toast-${Date.now()}`;
    const el = document.createElement("div");
    el.id = id;
    el.className =
      "fixed right-4 bottom-6 bg-gray-900 text-white px-4 py-2 rounded shadow-lg text-sm";
    el.innerText = msg;
    document.body.appendChild(el);
    setTimeout(() => document.getElementById(id)?.remove(), 2500);
  }

  function handleStatusChange(id, status) {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv._id === id ? { ...inv, status: status } : inv
      )
    );
    toastMessage(`Invoice ${id} marked as ${status}`);
  }

  const statusButton = (inv) => {
    const common =
      "px-3 py-1 rounded text-sm font-medium border transition-colors";
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleStatusChange(inv._id, "approved")}
          className={`${common} ${
            inv.status === "approved"
              ? "bg-green-500 text-white"
              : "bg-white border-green-500 text-green-600 hover:bg-green-50"
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => handleStatusChange(inv._id, "pending")}
          className={`${common} ${
            inv.status === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-white border-yellow-500 text-yellow-600 hover:bg-yellow-50"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => handleStatusChange(inv._id, "rejected")}
          className={`${common} ${
            inv.status === "rejected"
              ? "bg-red-500 text-white"
              : "bg-white border-red-500 text-red-600 hover:bg-red-50"
          }`}
        >
          Rejected
        </button>
      </div>
    );
  };

  const tableRows = useMemo(() => {
    return invoices.map((inv) => (
      <tr key={inv._id} className="odd:bg-white even:bg-gray-50">
        <td className="px-4 py-3 text-sm">{inv._id}</td>
        <td className="px-4 py-3 text-sm">
          {inv.user?.name || inv.userName || "-"}
        </td>
        <td className="px-4 py-3 text-sm">
          {inv.user?.email || inv.userEmail || "-"}
        </td>
        <td className="px-4 py-3 text-sm">
          {inv.amount != null ? `₹ ${inv.amount}` : "-"}
        </td>
        <td className="px-4 py-3 text-sm">
          {humanDate(inv.createdAt || inv.uploadedAt)}
        </td>
        <td className="px-4 py-3">{statusButton(inv)}</td>
        <td className="px-4 py-3 text-sm flex gap-2">
          <button
            onClick={() => handlePreview(inv)}
            title="Preview"
            className="p-2 rounded border hover:bg-gray-100"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleDownload(inv)}
            title="Download"
            className="p-2 rounded border hover:bg-gray-100"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => handleDelete(inv._id)}
            title="Delete"
            className="p-2 rounded border hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    ));
  }, [invoices]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <div className="relative">
          <input
            placeholder="Search invoices..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-4 py-2 border rounded w-72"
          />
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error && !BASE ? (
        <p className="text-yellow-500">{error}</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 text-sm">ID</th>
                <th className="px-4 py-2 text-sm">User</th>
                <th className="px-4 py-2 text-sm">Email</th>
                <th className="px-4 py-2 text-sm">Amount</th>
                <th className="px-4 py-2 text-sm">Date</th>
                <th className="px-4 py-2 text-sm">Status</th>
                <th className="px-4 py-2 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      )}

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-4 relative">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Invoice Preview</h2>
            {selectedInvoice.fileUrl?.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={selectedInvoice.fileUrl}
                title="Invoice PDF"
                className="w-full h-[500px] border rounded"
              />
            ) : (
              <img
                src={selectedInvoice.fileUrl}
                alt="Invoice"
                className="max-h-[500px] mx-auto border rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
