import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { Upload, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function AddProduct() {
  const navigate = useNavigate();

  const onNavigate = (page: string) => {
    const routeMap: Record<string, string> = {
      'admin-products': '/admin/products',
    };
    navigate(routeMap[page] || '/admin');
  };
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Navy', 'Charcoal', 'Camel', 'Burgundy', 'Emerald'];

  const toggleSelection = (value: string, array: string[], setFunction: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setFunction(array.filter(item => item !== value));
    } else {
      setFunction([...array, value]);
    }
  };

  return (
    <AdminLayout currentPage="admin-add-product">
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg p-8 border border-neutral-200">
          <h2 className="text-2xl text-neutral-900 mb-8">Add New Product</h2>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" placeholder="e.g., Midnight Silk Gown" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="e.g., AMR-DRS-001" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category" className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dresses">Evening Dresses</SelectItem>
                    <SelectItem value="suits">Tailored Suits</SelectItem>
                    <SelectItem value="outerwear">Outerwear</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="collection">Collection</Label>
                <Select>
                  <SelectTrigger id="collection" className="mt-2">
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall-2024">Fall 2024</SelectItem>
                    <SelectItem value="winter-2024">Winter 2024</SelectItem>
                    <SelectItem value="spring-2025">Spring 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" placeholder="0.00" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="discountPrice">Discount Price ($)</Label>
                <Input id="discountPrice" type="number" placeholder="0.00" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" type="number" placeholder="0" className="mt-2" />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed product description..."
                className="mt-2 min-h-32"
              />
            </div>

            <div>
              <Label htmlFor="fabric">Fabric/Material</Label>
              <Input id="fabric" placeholder="e.g., 100% Mulberry Silk" className="mt-2" />
            </div>

            {/* Sizes */}
            <div>
              <Label className="mb-3 block">Available Sizes</Label>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSelection(size, selectedSizes, setSelectedSizes)}
                    className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                      selectedSizes.includes(size)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <Label className="mb-3 block">Available Colors</Label>
              <div className="space-y-2">
                {colors.map((color) => (
                  <div key={color} className="flex items-center gap-2">
                    <Checkbox
                      id={color}
                      checked={selectedColors.includes(color)}
                      onCheckedChange={() => toggleSelection(color, selectedColors, setSelectedColors)}
                    />
                    <Label htmlFor={color} className="text-sm text-neutral-700">
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="mb-3 block">Product Images</Label>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-neutral-900 transition-colors cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-neutral-400" />
                    <span className="text-xs text-neutral-600">Upload Image</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                First image will be the primary image. Recommended size: 1200 x 1600px
              </p>
            </div>

            {/* Stock Status & Visibility */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="stockStatus">Stock Status</Label>
                <Select defaultValue="in-stock">
                  <SelectTrigger id="stockStatus" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="limited">Limited Stock</SelectItem>
                    <SelectItem value="sold-out">Sold Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <Checkbox id="active" checked={isActive} onCheckedChange={(checked) => setIsActive(checked as boolean)} />
                  <Label htmlFor="active" className="text-sm text-neutral-700">
                    Active (visible to customers)
                  </Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-neutral-200">
              <Button className="bg-black hover:bg-neutral-800">
                Save Product
              </Button>
              <Button variant="outline">
                Save as Draft
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onNavigate('admin-products')}
                className="ml-auto"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
