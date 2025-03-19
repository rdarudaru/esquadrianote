
import React, { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import Header from '@/components/Header';
import OrderList from '@/components/OrderList';
import OrderForm from '@/components/OrderForm';
import OrderDetails from '@/components/OrderDetails';
import PriceEditor from '@/components/PriceEditor';
import Footer from '@/components/Footer';
import { 
  Order, 
  Material, 
  defaultMaterials, 
  generateMockOrders, 
  searchOrders 
} from '@/utils/orderUtils';
import { cn } from '@/lib/utils';

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [materials, setMaterials] = useState<Material[]>(defaultMaterials);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isPriceEditorOpen, setIsPriceEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  // Load initial data
  useEffect(() => {
    const mockOrders = generateMockOrders();
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter orders when search query changes
  useEffect(() => {
    setFilteredOrders(searchOrders(orders, searchQuery));
  }, [orders, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  const handleSaveOrder = (newOrder: Order) => {
    setOrders(prev => [...prev, newOrder]);
  };

  const handleSaveMaterialPrices = (updatedMaterials: Material[]) => {
    setMaterials(updatedMaterials);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 mt-16 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">
              Sistema de Pedidos
            </h1>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setIsPriceEditorOpen(true)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                )}
              >
                <Settings className="w-4 h-4" />
                Editar Preços
              </button>
              
              <button
                onClick={() => setIsOrderFormOpen(true)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 rounded-lg font-medium",
                  "bg-black text-white hover:bg-gray-800",
                  "transition-colors active:scale-95 transform duration-100"
                )}
              >
                <Plus className="w-4 h-4" />
                Adicionar Pedido
              </button>
            </div>
          </div>
          
          <OrderList
            orders={filteredOrders}
            onOrderSelect={handleOrderSelect}
            selectedOrderId={selectedOrder?.id || null}
          />
          
          {isOrderFormOpen && (
            <OrderForm
              materials={materials}
              onClose={() => setIsOrderFormOpen(false)}
              onSave={handleSaveOrder}
            />
          )}
          
          {selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onClose={handleCloseOrderDetails}
            />
          )}
          
          {isPriceEditorOpen && (
            <PriceEditor
              materials={materials}
              onClose={() => setIsPriceEditorOpen(false)}
              onSave={handleSaveMaterialPrices}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
