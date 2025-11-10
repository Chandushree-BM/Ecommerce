import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "../../components/AdminNav";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { formatINR, formatDateIST } from "../../lib/format";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    fetchOrders();
  }, [page, status]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);

      const response = await api.get("/api/admin/orders", {
        params: {
          page,
          status,
          search,
        },
      });

      setOrders(response.data.orders || []);
      setPage(response.data.page);
      setPages(response.data.pages);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Orders</h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by order ID"
            className="border border-gray-300 rounded-lg px-4 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    No Orders Found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{order.orderId}</td>
                    <td className="py-3 px-4">
                      {order.user?.name}
                      <br />
                      <span className="text-sm text-gray-600">{order.user?.email}</span>
                    </td>
                    <td className="py-3 px-4">{formatINR(order.total)}</td>
                    <td className="py-3 px-4">{order.status}</td>
                    <td className="py-3 px-4">{formatDateIST(order.createdAt)}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigate(`/api/admin/orders/${order._id}`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span className="px-4 py-2">
            Page {page} of {pages}
          </span>

          <button
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
