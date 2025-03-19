
import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { Material } from '@/utils/orderUtils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PriceEditorProps {
  materials: Material[];
  onSave: (updatedMaterials: Material[]) => void;
  onClose: () => void;
}

const PriceEditor: React.FC<PriceEditorProps> = ({ materials, onSave, onClose }) => {
  const [editedMaterials, setEditedMaterials] = useState<Material[]>([...materials]);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialPrice, setNewMaterialPrice] = useState('');
  const [newMaterialMultiplier, setNewMaterialMultiplier] = useState('1');

  const handlePriceChange = (id: string, newPrice: string) => {
    setEditedMaterials(prev => 
      prev.map(mat => 
        mat.id === id ? { ...mat, price: parseFloat(newPrice) || 0 } : mat
      )
    );
  };

  const handleMultiplierChange = (id: string, newMultiplier: string) => {
    setEditedMaterials(prev => 
      prev.map(mat => 
        mat.id === id ? { ...mat, costMultiplier: parseFloat(newMultiplier) || 1 } : mat
      )
    );
  };

  const handleAddMaterial = () => {
    if (!newMaterialName || !newMaterialPrice) {
      toast.error('Preencha o nome e o preço do material');
      return;
    }

    const newMaterial: Material = {
      id: Date.now().toString(),
      name: newMaterialName,
      price: parseFloat(newMaterialPrice),
      costMultiplier: parseFloat(newMaterialMultiplier) || 1,
    };

    setEditedMaterials(prev => [...prev, newMaterial]);
    setNewMaterialName('');
    setNewMaterialPrice('');
    setNewMaterialMultiplier('1');
    toast.success('Material adicionado');
  };

  const handleRemoveMaterial = (id: string) => {
    setEditedMaterials(prev => prev.filter(mat => mat.id !== id));
    toast.success('Material removido');
  };

  const handleSubmit = () => {
    onSave(editedMaterials);
    toast.success('Preços atualizados com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Editar Preços de Materiais</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço (R$)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Multiplicador</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {editedMaterials.map((material) => (
                    <tr key={material.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {material.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={material.price}
                          onChange={(e) => handlePriceChange(material.id, e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={material.costMultiplier}
                          onChange={(e) => handleMultiplierChange(material.id, e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveMaterial(material.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Adicionar Novo Material</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="materialName" className="block text-xs text-gray-500 mb-1">
                    Nome do Material
                  </label>
                  <input
                    id="materialName"
                    type="text"
                    value={newMaterialName}
                    onChange={(e) => setNewMaterialName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Ex: Alumínio Temperado"
                  />
                </div>
                <div>
                  <label htmlFor="materialPrice" className="block text-xs text-gray-500 mb-1">
                    Preço (R$)
                  </label>
                  <input
                    id="materialPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newMaterialPrice}
                    onChange={(e) => setNewMaterialPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Ex: 200"
                  />
                </div>
                <div>
                  <label htmlFor="costMultiplier" className="block text-xs text-gray-500 mb-1">
                    Multiplicador
                  </label>
                  <div className="flex items-center">
                    <input
                      id="costMultiplier"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={newMaterialMultiplier}
                      onChange={(e) => setNewMaterialMultiplier(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Ex: 1"
                    />
                    <button
                      type="button"
                      onClick={handleAddMaterial}
                      className="ml-2 p-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceEditor;
