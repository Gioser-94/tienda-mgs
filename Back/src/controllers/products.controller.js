import { supabase } from '../config/supabase.js';

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*');
    
    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw error;
    }
    
    console.log(`✅ ${data.length} productos obtenidos`);
    res.json(data);  // No necesitas status(200), json() ya pone 200
    
  } catch (error) {
    console.error('❌ Error al obtener productos:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener productos',
      details: error.message 
    });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(data);
    
  } catch (error) {
    console.error('❌ Error al obtener producto:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener el producto',
      details: error.message 
    });
  }
};
