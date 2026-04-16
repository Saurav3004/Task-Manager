import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", protect, authorize("admin"), getUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", protect, authorize("admin"), createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 */
router.get("/:id", protect, authorize("admin"), getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 */
router.put("/:id", protect, authorize("admin"), updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 */
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;