import prisma from "../prisma/prismaClient.js";

const includeProduct = {
  product: true,
};

export const getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: includeProduct,
      orderBy: {
        id: "desc",
      },
    });

    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity || 1);

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: "Valid productId and quantity are required" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId: req.user.id,
        productId,
        quantity,
      },
      include: includeProduct,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while adding product to cart" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const quantity = Number(req.body.quantity);

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: "Valid productId and quantity are required" });
    }

    const cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
      data: {
        quantity,
      },
      include: includeProduct,
    });

    res.json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating cart" });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (!productId) {
      return res.status(400).json({ message: "Valid productId is required" });
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
    });

    res.json({ message: "Product removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while removing cart item" });
  }
};
