
// Types for our application
export interface Material {
  id: string;
  name: string;
  price: number;
  costMultiplier: number;
}

export interface Order {
  id: string;
  clientName: string;
  orderDate: string;
  materialType: string;
  height: number;
  width: number;
  thickness: number;
  specialMetals: boolean;
  deliveryDate: string;
  details: string;
  finalPrice: number;
  materials: {
    materialCost: number;
    laborCost: number;
  };
}

// Mock data for materials
export const defaultMaterials: Material[] = [
  { id: '1', name: 'Alumínio Comum', price: 150, costMultiplier: 1 },
  { id: '2', name: 'Alumínio Anodizado', price: 200, costMultiplier: 1.2 },
  { id: '3', name: 'PVC', price: 180, costMultiplier: 0.9 },
  { id: '4', name: 'Madeira', price: 250, costMultiplier: 1.5 },
  { id: '5', name: 'Aço Inox', price: 320, costMultiplier: 1.8 },
];

// Mock data for orders
export const generateMockOrders = (): Order[] => {
  return [
    {
      id: '1',
      clientName: 'Construtora Horizonte',
      orderDate: '2023-05-15',
      materialType: 'Alumínio Comum',
      height: 150,
      width: 200,
      thickness: 3,
      specialMetals: false,
      deliveryDate: '2023-06-01',
      details: 'Janela para sala de estar',
      finalPrice: 1800,
      materials: {
        materialCost: 600,
        laborCost: 1200,
      },
    },
    {
      id: '2',
      clientName: 'Residencial Aurora',
      orderDate: '2023-05-20',
      materialType: 'Alumínio Anodizado',
      height: 120,
      width: 80,
      thickness: 2.5,
      specialMetals: true,
      deliveryDate: '2023-06-10',
      details: 'Esquadria para banheiro',
      finalPrice: 1200,
      materials: {
        materialCost: 400,
        laborCost: 800,
      },
    },
    {
      id: '3',
      clientName: 'Casa & Decoração',
      orderDate: '2023-06-01',
      materialType: 'PVC',
      height: 220,
      width: 160,
      thickness: 4,
      specialMetals: false,
      deliveryDate: '2023-06-20',
      details: 'Porta de correr para varanda',
      finalPrice: 2400,
      materials: {
        materialCost: 800,
        laborCost: 1600,
      },
    },
    {
      id: '4',
      clientName: 'Marcos Albuquerque',
      orderDate: '2023-06-05',
      materialType: 'Madeira',
      height: 210,
      width: 90,
      thickness: 5,
      specialMetals: false,
      deliveryDate: '2023-06-25',
      details: 'Porta para quarto',
      finalPrice: 1500,
      materials: {
        materialCost: 500,
        laborCost: 1000,
      },
    },
    {
      id: '5',
      clientName: 'Condomínio Bela Vista',
      orderDate: '2023-06-10',
      materialType: 'Aço Inox',
      height: 180,
      width: 240,
      thickness: 3.5,
      specialMetals: true,
      deliveryDate: '2023-07-05',
      details: 'Esquadria para área de piscina',
      finalPrice: 3600,
      materials: {
        materialCost: 1200,
        laborCost: 2400,
      },
    },
  ];
};

// Calculate order price based on material, dimensions, and options
export const calculateOrderPrice = (
  materialType: string,
  height: number,
  width: number,
  thickness: number,
  specialMetals: boolean,
  materials: Material[]
): { finalPrice: number; materialCost: number; laborCost: number } => {
  const material = materials.find(m => m.name === materialType);
  
  if (!material) {
    throw new Error(`Material type "${materialType}" not found`);
  }
  
  // Calculate area in square meters
  const area = (height * width) / 10000; // Convert from cm² to m²
  
  // Base material cost calculation
  let materialCost = area * material.price * thickness * material.costMultiplier;
  
  // Additional cost for special metals
  if (specialMetals) {
    materialCost *= 1.3; // 30% increase for special metals
  }
  
  // Round to 2 decimal places
  materialCost = Math.round(materialCost * 100) / 100;
  
  // Labor cost is 2x material cost
  const laborCost = materialCost * 2;
  
  // Final price is material + labor
  const finalPrice = materialCost + laborCost;
  
  return {
    finalPrice,
    materialCost,
    laborCost,
  };
};

// Format currency for display
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

// Search orders by query
export const searchOrders = (orders: Order[], query: string): Order[] => {
  if (!query) return orders;
  
  const lowerQuery = query.toLowerCase();
  
  return orders.filter(order => 
    order.clientName.toLowerCase().includes(lowerQuery) ||
    order.materialType.toLowerCase().includes(lowerQuery) ||
    order.orderDate.includes(lowerQuery) ||
    order.deliveryDate.includes(lowerQuery) ||
    order.details.toLowerCase().includes(lowerQuery)
  );
};

// Generate an order id
export const generateOrderId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5).toUpperCase();
};
