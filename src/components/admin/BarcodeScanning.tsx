import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { Scan, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';


type ScannedItem = {
  sku: string;
  productName: string;
  quantityAdjusted: number;
  newStock: number;
};

export function BarcodeScanning() {
  const [barcode, setBarcode] = useState('');
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([
    { sku: 'AMR-DRS-001', productName: 'Midnight Silk Gown', quantityAdjusted: 5, newStock: 13 },
    { sku: 'AMR-OUT-003', productName: 'Cashmere Overcoat', quantityAdjusted: 3, newStock: 6 },
  ]);

  const handleScan = () => {
    if (barcode) {
      // Mock scanning - in real app would lookup product
      setScannedItems([
        ...scannedItems,
        {
          sku: barcode,
          productName: 'Scanned Product',
          quantityAdjusted: 1,
          newStock: 10,
        },
      ]);
      setBarcode('');
    }
  };

  return (
    <AdminLayout currentPage="admin-barcode">
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg p-8 border border-neutral-200 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <Scan className="w-6 h-6 text-neutral-700" />
            </div>
            <div>
              <h2 className="text-2xl text-neutral-900">Barcode Scanning</h2>
              <p className="text-sm text-neutral-600">Scan products to update inventory</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="barcode">Scan Product Barcode</Label>
              <div className="flex gap-3 mt-2">
                <Input
                  id="barcode"
                  placeholder="Scan or enter SKU/barcode..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                  className="flex-1"
                  autoFocus
                />
                <Button onClick={handleScan} className="bg-black hover:bg-neutral-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Press Enter or click Add after scanning/entering a barcode
              </p>
            </div>
          </div>
        </div>

        {/* Scanned Items Table */}
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg text-neutral-900">Scanned Items</h3>
          </div>

          {scannedItems.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              No items scanned yet. Start scanning to add items to inventory.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th className="text-left py-4 px-6 text-sm text-neutral-600">Product</th>
                      <th className="text-left py-4 px-6 text-sm text-neutral-600">SKU</th>
                      <th className="text-center py-4 px-6 text-sm text-neutral-600">Quantity Adjusted</th>
                      <th className="text-center py-4 px-6 text-sm text-neutral-600">New Stock</th>
                      <th className="text-center py-4 px-6 text-sm text-neutral-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scannedItems.map((item, index) => (
                      <tr key={index} className="border-b border-neutral-100">
                        <td className="py-4 px-6">
                          <span className="text-sm text-neutral-900">{item.productName}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-neutral-700 font-mono">{item.sku}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Input
                            type="number"
                            value={item.quantityAdjusted}
                            className="w-24 mx-auto text-center"
                          />
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-sm text-green-600">{item.newStock}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setScannedItems(scannedItems.filter((_, i) => i !== index))}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-neutral-200 flex items-center justify-between">
                <p className="text-sm text-neutral-600">
                  {scannedItems.length} item{scannedItems.length !== 1 ? 's' : ''} scanned
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setScannedItems([])}>
                    Clear All
                  </Button>
                  <Button className="bg-black hover:bg-neutral-800">
                    Update Inventory
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
