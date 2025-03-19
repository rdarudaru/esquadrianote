
import React from 'react';
import { Edit, Printer, X } from 'lucide-react';
import { Order, formatCurrency, formatDate } from '@/utils/orderUtils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    toast.info('Funcionalidade de impressão será implementada em breve');
  };

  const handleEdit = () => {
    toast.info('Funcionalidade de edição será implementada em breve');
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Detalhes do Pedido</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{order.clientName}</h3>
                <p className="text-sm text-gray-500">ID do Pedido: {order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Data do Pedido:</p>
                <p className="text-sm font-medium">{formatDate(order.orderDate)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Material</p>
                <p className="text-sm font-medium">{order.materialType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Dimensões</p>
                <p className="text-sm font-medium">{order.height} x {order.width} cm ({order.thickness}mm)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Metais Especiais</p>
                <p className="text-sm font-medium">{order.specialMetals ? 'Sim' : 'Não'}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-1">Data de Entrega</p>
              <p className="text-sm font-medium">{formatDate(order.deliveryDate)}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-1">Detalhes</p>
              <p className="text-sm">{order.details || 'Nenhum detalhe informado.'}</p>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Orçamento</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Custo de Material:</span>
                  <span className="text-sm text-gray-900">{formatCurrency(order.materials.materialCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Custo de Mão de Obra:</span>
                  <span className="text-sm text-gray-900">{formatCurrency(order.materials.laborCost)}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                  <span className="text-sm font-medium text-gray-800">Preço Final:</span>
                  <span className="text-base font-semibold text-gray-900">{formatCurrency(order.finalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePrint}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              )}
            >
              <Printer className="w-4 h-4" />
              Imprimir Pedido
            </button>
            
            <button
              onClick={handleEdit}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-black text-white hover:bg-gray-800 transition-colors"
              )}
            >
              <Edit className="w-4 h-4" />
              Editar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
