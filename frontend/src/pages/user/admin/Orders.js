import { useEffect, useState } from 'react';
import { api } from '../../lib/axios';
import { Link } from 'react-router-dom';

export default function AdminOrders(){
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState('');

  const fetchOrders = async (page=1) => {
    const res = await api.get(`/api/admin/orders?page=${page}&status=${status}`);
    setData(res.data);
  };

  useEffect(() => { fetchOrders(1); }, [status]);

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const exportCSV = async () => {
    const res = await api.post('/api/admin/orders/export', { ids: selected }, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url; a.download = 'orders.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-3">
        <select value={status} onChange={e=>setStatus(e.target.value)} className="border p-2">
          <option value="">All</option>
          {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={exportCSV} className="border px-3 py-2">Export Selected</button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-50">
            <th></th><th>OrderID</th><th>Total</th><th>Status</th><th>Date</th><th></th>
          </tr>
        </thead>
        <tbody>
          {data.items.map(o => (
            <tr key={o._id} className="border-t">
              <td><input type="checkbox" checked={selected.includes(o._id)} onChange={()=>toggle(o._id)} /></td>
              <td>{o._id}</td>
              <td>₹{o.total}</td>
              <td>{o.status}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td><Link className="underline" to={`/admin/orders/${o._id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
