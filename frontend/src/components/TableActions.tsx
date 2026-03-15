import { Edit, Trash2 } from 'lucide-react';

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const TableActions = ({ onEdit, onDelete }: TableActionsProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {/* Botón Editar */}
      <button 
        onClick={onEdit}
        className="flex items-center justify-center p-2.5 bg-amber-500 text-white rounded-xl shadow-md hover:bg-amber-400 transition-all active:scale-95"
        title="Editar"
      >
        <Edit size={20} />
      </button>

      {/* Botón Eliminar */}
      <button 
        onClick={onDelete}
        className="flex items-center justify-center p-2.5 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-500 transition-all active:scale-95"
        title="Eliminar"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default TableActions;