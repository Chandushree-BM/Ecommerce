import { createObjectCsvStringifier } from 'csv-writer';
import Order from '../models/Order.js';

export const exportOrdersCSV = async (req, res) => {
  const { ids = [] } = req.body; // array of order IDs
  const rows = await Order.find(ids.length ? { _id: { $in: ids } } : {}).lean();
  const csv = createObjectCsvStringifier({
    header: [
      { id: '_id', title: 'OrderID' },
      { id: 'status', title: 'Status' },
      { id: 'total', title: 'Total' },
      { id: 'createdAt', title: 'CreatedAt' }
    ]
  });
  const output = csv.getHeaderString() + csv.stringifyRecords(rows.map(r => ({
    _id: r._id,
    status: r.status,
    total: r.total,
    createdAt: r.createdAt.toISOString()
  })));
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
  res.send(output);
};