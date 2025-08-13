import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Heart, Eye, ShoppingCart, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const ProductGrid = ({ products }) => {
  const { toast } = useToast();

  const handleProductClick = (producto) => {
    if (producto.externalLink) {
      window.open(producto.externalLink, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "🚧 Esta funcionalidad aún no está implementada",
        description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje! 🚀",
      });
    }
  };

  const handleAddToCart = (e, producto) => {
    e.stopPropagation();
    toast({
      title: `${producto.name} añadido al carrito`,
      description: `Precio: €${producto.precio} - ¡Excelente elección!`,
    });
  };

  const handleWishlist = (e, producto) => {
    e.stopPropagation();
    toast({
      title: `${producto.name} añadido a favoritos`,
      description: "Podrás encontrarlo en tu lista de deseos.",
    });
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((producto, index) => (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="wine-card rounded-2xl overflow-hidden wine-hover cursor-pointer relative group flex flex-col"
              onClick={() => handleProductClick(producto)}
            >
              <div className="absolute top-4 left-4 z-10 space-y-2">
                {producto.destacado && (
                  <span className="px-3 py-1 bg-amber-500 text-amber-900 rounded-full text-xs font-bold">
                    Destacado
                  </span>
                )}
                {producto.descuento > 0 && (
                  <span className="block px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                    -{producto.descuento}%
                  </span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleWishlist(e, producto)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <Heart className="h-5 w-5 text-white" />
              </motion.button>

              <div className="relative h-64 bg-gradient-to-br from-amber-900/20 to-red-900/20 flex items-center justify-center">
                <img  alt={producto.name} class="w-full h-full object-cover" src="images/71fIFF6k+FL._AC_SL1500_.jpg" />
                
                <div
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <div className="flex items-center space-x-2 text-white">
                    {producto.externalLink ? <ExternalLink className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    <span>{producto.externalLink ? "Ver en Amazon" : "Ver en tienda"}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-playfair text-xl font-semibold text-amber-200 line-clamp-1">
                    {producto.name}
                  </h3>
                  <p className="text-amber-100/70 text-sm">{producto.bodega}</p>
                  <p className="text-amber-100/60 text-xs">{producto.region}</p>
                </div>

                <p className="text-amber-100/70 text-sm line-clamp-2">
                  {producto.descripcion}
                </p>

                <div className="flex items-center justify-between text-sm text-amber-100/60">
                  <span>{producto.alcohol}</span>
                  <span>{producto.stock > 0 ? `${producto.stock} disponibles` : (producto.externalLink ? 'Venta externa' : 'Agotado')}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-amber-400 fill-current" />
                    <span className="text-amber-200 font-medium">{producto.rating}</span>
                  </div>
                  <span className="text-amber-100/60 text-sm">
                    ({producto.reviews} reseñas)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold wine-text-gradient">
                        €{producto.precio}
                      </span>
                      {producto.precioOriginal > producto.precio && (
                        <span className="text-amber-100/50 line-through">
                          €{producto.precioOriginal}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-100/60">{producto.maridaje}</p>
                  </div>
                  
                  {producto.externalLink ? (
                     <Button
                        variant="default"
                        size="icon"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                       <a href={producto.externalLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-5 w-5" />
                       </a>
                     </Button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleAddToCart(e, producto)}
                      className="p-3 wine-gradient rounded-full hover:opacity-90 transition-all duration-300"
                    >
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <ShoppingBag className="h-16 w-16 text-amber-400/50 mx-auto mb-4" />
            <h3 className="font-playfair text-2xl font-semibold text-amber-200 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-amber-100/70">
              Prueba con otros filtros para encontrar el vino perfecto.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;