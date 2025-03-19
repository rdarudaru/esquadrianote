
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black w-full py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-white/80 text-sm mb-2 md:mb-0">
          © {currentYear} EsquadriaNote. Todos os direitos reservados.
        </div>
        <div className="text-white/60 text-xs">
          Sistema de Gerenciamento de Pedidos para Lojas de Esquadrias
        </div>
      </div>
    </footer>
  );
};

export default Footer;
