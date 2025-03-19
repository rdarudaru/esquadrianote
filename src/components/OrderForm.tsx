
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CalendarIcon, ChevronDown, Printer, X } from 'lucide-react';
import { 
  Material, 
  calculateOrderPrice, 
  formatCurrency, 
  generateOrderId
} from '@/utils/orderUtils';
import { cn } from '@/lib/utils';

interface OrderFormProps {
  materials: Material[];
  onClose: () => void;
  onSave: (newOrder: any) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ materials, onClose, onSave }) => {
  const [clientName, setClientName] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [materialType, setMaterialType] = useState(materials[0]?.name || '');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('');
  const [specialMetals, setSpecialMetals] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [details, setDetails] = useState('');
  
  const [materialCost, setMaterialCost] = useState(0);
  const [laborCost, setLaborCost] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [isMaterialDropdownOpen, setIsMaterialDropdownOpen] = useState(false);

  // Calculate prices when form values change
  useEffect(() => {
    if (materialType && height && width && thickness) {
      try {
        const heightNum = parseFloat(height);
        const widthNum = parseFloat(width);
        const thicknessNum = parseFloat(thickness);
        
        if (heightNum > 0 && widthNum > 0 && thicknessNum > 0) {
          const { materialCost, laborCost, finalPrice } = calculateOrderPrice(
            materialType,
            heightNum,
            widthNum,
            thicknessNum,
            specialMetals,
            materials
          );
          
          setMaterialCost(materialCost);
          setLaborCost(laborCost);
          setFinalPrice(finalPrice);
        }
      } catch (error) {
        console.error('Error calculating price:', error);
      }
    }
  }, [materialType, height, width, thickness, specialMetals, materials]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !materialType || !height || !width || !thickness || !deliveryDate) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    const newOrder = {
      id: generateOrderId(),
      clientName,
      orderDate,
      materialType,
      height: parseFloat(height),
      width: parseFloat(width),
      thickness: parseFloat(thickness),
      specialMetals,
      deliveryDate,
      details,
      finalPrice,
      materials: {
        materialCost,
        laborCost,
      },
    };
    
    onSave(newOrder);
    toast.success('Pedido adicionado com sucesso!');
    onClose();
  };

  const handlePrint = () => {
    toast.info('Funcionalidade de impressão será implementada em breve');
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Novo Pedido</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Cliente/Empresa
                  </label>
                  <input
                    id="clientName"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="input-field"
                    placeholder="Ex: Construtora Horizonte"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Data do Pedido
                  </label>
                  <div className="relative">
                    <input
                      id="orderDate"
                      type="date"
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                      className="input-field pl-10"
                      required
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="materialType" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Material
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="input-field text-left flex items-center justify-between"
                      onClick={() => setIsMaterialDropdownOpen(!isMaterialDropdownOpen)}
                    >
                      <span>{materialType || 'Selecione um material'}</span>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {isMaterialDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg animate-fade-in">
                        <ul className="py-1 max-h-60 overflow-auto">
                          {materials.map((material) => (
                            <li key={material.id}>
                              <button
                                type="button"
                                className={cn(
                                  "w-full text-left px-4 py-2 text-sm",
                                  "hover:bg-gray-100 transition-colors",
                                  materialType === material.name && "bg-gray-100"
                                )}
                                onClick={() => {
                                  setMaterialType(material.name);
                                  setIsMaterialDropdownOpen(false);
                                }}
                              >
                                {material.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                      Altura (cm)
                    </label>
                    <input
                      id="height"
                      type="number"
                      min="1"
                      step="0.1"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="input-field"
                      placeholder="Ex: 150"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                      Largura (cm)
                    </label>
                    <input
                      id="width"
                      type="number"
                      min="1"
                      step="0.1"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="input-field"
                      placeholder="Ex: 200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="thickness" className="block text-sm font-medium text-gray-700 mb-1">
                      Espessura (mm)
                    </label>
                    <input
                      id="thickness"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={thickness}
                      onChange={(e) => setThickness(e.target.value)}
                      className="input-field"
                      placeholder="Ex: 3"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={specialMetals}
                      onChange={(e) => setSpecialMetals(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">Metais Especiais</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Entrega
                  </label>
                  <div className="relative">
                    <input
                      id="deliveryDate"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="input-field pl-10"
                      required
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                    Detalhes do Pedido
                  </label>
                  <textarea
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Adicione detalhes importantes sobre o pedido..."
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Orçamento</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Custo de Material:</span>
                      <span className="text-sm text-gray-900 font-medium">{formatCurrency(materialCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Custo de Mão de Obra:</span>
                      <span className="text-sm text-gray-900 font-medium">{formatCurrency(laborCost)}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                      <span className="text-sm font-medium text-gray-800">Preço Final:</span>
                      <span className="text-base font-semibold text-gray-900">{formatCurrency(finalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4 border-t">
              <button
                type="button"
                onClick={handlePrint}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                )}
              >
                <Printer className="w-4 h-4" />
                Imprimir Orçamento
              </button>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={cn(
                    "px-5 py-2 rounded-lg font-medium",
                    "bg-black text-white hover:bg-gray-800",
                    "transition-colors active:scale-95 transform duration-100"
                  )}
                >
                  Adicionar Pedido
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
