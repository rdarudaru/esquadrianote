
import React, { useState } from 'react';
import { ArrowUpDown, Calendar, ChevronDown, ChevronUp, Clock, Sliders } from 'lucide-react';
import { Order, formatCurrency, formatDate } from '@/utils/orderUtils';
import { cn } from '@/lib/utils';

interface OrderListProps {
  orders: Order[];
  onOrderSelect: (order: Order) => void;
  selectedOrderId: string | null;
}

type SortField = 'clientName' | 'orderDate' | 'materialType' | 'finalPrice';
type SortDirection = 'asc' | 'desc';

const OrderList: React.FC<OrderListProps> = ({ orders, onOrderSelect, selectedOrderId }) => {
  const [sortField, setSortField] = useState<SortField>('orderDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'clientName':
        comparison = a.clientName.localeCompare(b.clientName);
        break;
      case 'orderDate':
        comparison = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
        break;
      case 'materialType':
        comparison = a.materialType.localeCompare(b.materialType);
        break;
      case 'finalPrice':
        comparison = a.finalPrice - b.finalPrice;
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  return (
    <div className="w-full animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Pedidos</h2>
        <button className="btn-icon">
          <Sliders className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      
      <div className="table-container rounded-lg border border-gray-200 overflow-hidden">
        <table className="table-modern">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="table-header cursor-pointer"
                onClick={() => handleSort('clientName')}
              >
                <div className="flex items-center">
                  Cliente
                  {sortField === 'clientName' && (
                    <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />
                  )}
                </div>
              </th>
              <th 
                className="table-header cursor-pointer"
                onClick={() => handleSort('orderDate')}
              >
                <div className="flex items-center">
                  Data do Pedido
                  {sortField === 'orderDate' && (
                    <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />
                  )}
                </div>
              </th>
              <th 
                className="table-header cursor-pointer"
                onClick={() => handleSort('materialType')}
              >
                <div className="flex items-center">
                  Material
                  {sortField === 'materialType' && (
                    <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />
                  )}
                </div>
              </th>
              <th className="table-header">
                Dimensões
              </th>
              <th className="table-header">
                Metais Especiais
              </th>
              <th className="table-header">
                Data de Entrega
              </th>
              <th 
                className="table-header cursor-pointer"
                onClick={() => handleSort('finalPrice')}
              >
                <div className="flex items-center">
                  Preço Final
                  {sortField === 'finalPrice' && (
                    <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />
                  )}
                </div>
              </th>
              <th className="table-header"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr 
                  className={cn(
                    "table-row transition-all",
                    selectedOrderId === order.id ? "bg-blue-50" : ""
                  )}
                  onClick={() => onOrderSelect(order)}
                >
                  <td className="table-cell font-medium">{order.clientName}</td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      {formatDate(order.orderDate)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="chip bg-gray-100">{order.materialType}</span>
                  </td>
                  <td className="table-cell">
                    {order.height} x {order.width} cm ({order.thickness}mm)
                  </td>
                  <td className="table-cell">
                    {order.specialMetals ? (
                      <span className="chip bg-amber-100 text-amber-800">Sim</span>
                    ) : (
                      <span className="chip bg-gray-100 text-gray-600">Não</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-gray-400" />
                      {formatDate(order.deliveryDate)}
                    </div>
                  </td>
                  <td className="table-cell font-medium">
                    {formatCurrency(order.finalPrice)}
                  </td>
                  <td className="table-cell text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOrderExpansion(order.id);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      {expandedOrderId === order.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan={8} className="p-0">
                      <div className="bg-gray-50 p-4 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Detalhes do Pedido</h3>
                            <p className="text-sm text-gray-700">{order.details}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Custos</h3>
                            <div className="flex flex-col space-y-1">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Material:</span>
                                <span className="text-sm text-gray-900">{formatCurrency(order.materials.materialCost)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Mão de Obra:</span>
                                <span className="text-sm text-gray-900">{formatCurrency(order.materials.laborCost)}</span>
                              </div>
                              <div className="flex justify-between pt-1 border-t">
                                <span className="text-sm font-medium text-gray-800">Total:</span>
                                <span className="text-sm font-medium text-gray-900">{formatCurrency(order.finalPrice)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {sortedOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
