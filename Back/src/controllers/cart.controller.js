import prisma from '../config/prisma.js';

const generarUrlImagen = (imagen) => {
    if (!imagen) {
        return imagen;
    }

    if (imagen.startsWith('http')) {
        return imagen;
    }

    return `${process.env.SUPABASE_URL}/storage/v1/object/public/Imagenes/${imagen}`;
};

const formatearCarrito = (carrito) => ({
    ...carrito,
    items: carrito.items.map((item) => ({
        ...item,
        producto: {
            ...item.producto,
            imagen: generarUrlImagen(item.producto.imagen)
        }
    }))
});

export const getCarrito = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        let carrito = await prisma.carrito.findUnique({
            where: {
                usuario_id: BigInt(usuarioId)
            },
            include: {
                items: {
                    include: {
                        producto: true
                    }
                }
            }
        });

        if (!carrito) {
            carrito = await prisma.carrito.create({
                data: {
                    usuario_id: BigInt(usuarioId)
                },
                include: {
                    items: {
                        include: {
                            producto: true
                        }
                    }
                }
            });
        }

        res.json({
            carrito: formatearCarrito(carrito)
        });

    } catch {
        res.status(500).json({
            error: 'Error al obtener el carrito'
        });
    }
};

export const addItemCarrito = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { productoId, cantidad } = req.body;

        let carrito = await prisma.carrito.findUnique({
            where: {
                usuario_id: BigInt(usuarioId)
            }
        });

        if (!carrito) {
            carrito = await prisma.carrito.create({
                data: {
                    usuario_id: BigInt(usuarioId)
                }
            });
        }

        const itemExistente = await prisma.carrito_items.findUnique({
            where: {
                carrito_id_producto_id: {
                    carrito_id: carrito.id,
                    producto_id: BigInt(productoId)
                }
            }
        });

        if (itemExistente) {
            await prisma.carrito_items.update({
                where: {
                    id: itemExistente.id
                },
                data: {
                    cantidad: itemExistente.cantidad + BigInt(cantidad)
                }
            });
        } else {
            await prisma.carrito_items.create({
                data: {
                    carrito_id: carrito.id,
                    producto_id: BigInt(productoId),
                    cantidad: BigInt(cantidad)
                }
            });
        }

        const carritoActualizado = await prisma.carrito.findUnique({
            where: {
                usuario_id: BigInt(usuarioId)
            },
            include: {
                items: {
                    include: {
                        producto: true
                    }
                }
            }
        });

        res.json({
            carrito: formatearCarrito(carritoActualizado)
        });

    } catch {
        res.status(500).json({
            error: 'Error al añadir producto al carrito'
        });
    }
};

export const updateItemCarrito = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { productId } = req.params;
        const { cantidad } = req.body;

        const carrito = await prisma.carrito.findUnique({
            where: {
                usuario_id: BigInt(usuarioId)
            }
        });

        if (!carrito) {
            return res.status(404).json({
                error: 'Carrito no encontrado'
            });
        }

        const item = await prisma.carrito_items.findUnique({
            where: {
                carrito_id_producto_id: {
                    carrito_id: carrito.id,
                    producto_id: BigInt(productId)
                }
            }
        });

        if (!item) {
            return res.status(404).json({
                error: 'Producto no encontrado en el carrito'
            });
        }

        await prisma.carrito_items.update({
            where: {
                id: item.id
            },
            data: {
                cantidad: BigInt(cantidad)
            }
        });

        const carritoActualizado = await prisma.carrito.findUnique({
            where: {
                usuario_id: BigInt(usuarioId)
            },
            include: {
                items: {
                    include: {
                        producto: true
                    }
                }
            }
        });

        res.json({
            carrito: formatearCarrito(carritoActualizado)
        });

    } catch {
        res.status(500).json({
            error: 'Error al actualizar el carrito'
        });
    }
};

export const deleteItemCarrito = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const { productId } = req.params;

        const carrito = await prisma.carrito.findUnique({
            where: {
                usuario_id: BigInt(usuarioId)
            }
        });

        if (!carrito) {
            return res.status(404).json({
                error: 'Carrito no encontrado'
            });
        }

        const item = await prisma.carrito_items.findUnique({
            where: {
                carrito_id_producto_id: {
                    carrito_id: carrito.id,
                    producto_id: BigInt(productId)
                }
            }
        });

        if (!item) {
            return res.status(404).json({
                error: 'Producto no encontrado en el carrito'
            });
        }

        await prisma.carrito_items.delete({
            where: {
                id: item.id
            }
        });

        const carritoActualizado = await prisma.carrito.findUnique({
            where: {
                usuario_id: BigInt(usuarioId)
            },
            include: {
                items: {
                    include: {
                        producto: true
                    }
                }
            }
        });

        res.json({
            carrito: formatearCarrito(carritoActualizado)
        });

    } catch {
        res.status(500).json({
            error: 'Error al eliminar producto del carrito'
        });
    }
};

export const clearCarrito = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const carrito = await prisma.carrito.findUnique({
            where: {
                usuario_id: BigInt(usuarioId)
            }
        });

        if (!carrito) {
            return res.status(404).json({
                error: 'Carrito no encontrado'
            });
        }

        await prisma.carrito_items.deleteMany({
            where: {
                carrito_id: carrito.id
            }
        });

        res.json({
            message: 'Carrito vaciado correctamente'
        });

    } catch {
        res.status(500).json({
            error: 'Error al vaciar carrito'
        });
    }
};