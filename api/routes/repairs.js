import express from 'express';
import Repair from '../models/Repair.js';

const router = express.Router();

// Helper function to generate tracking ID (NR-XXXXXX)
function generateTrackingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'NR-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// @route   POST /api/repairs
// @desc    Create a new repair request
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      deviceType,
      deviceModel,
      issueDescription
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !deviceType || !deviceModel || !issueDescription) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Generate unique tracking ID
    let trackingId = generateTrackingId();
    let idExists = await Repair.findOne({ trackingId });
    while (idExists) {
      trackingId = generateTrackingId();
      idExists = await Repair.findOne({ trackingId });
    }

    const newRepair = new Repair({
      trackingId,
      customerName,
      customerEmail,
      customerPhone,
      deviceType,
      deviceModel,
      issueDescription,
      status: 'received',
      cost: 0,
      notes: 'Solicitud recibida'
    });

    const savedRepair = await newRepair.save();
    res.status(201).json(savedRepair);
  } catch (error) {
    console.error('Error creating repair:', error);
    res.status(500).json({ error: 'Error del servidor al registrar la reparación.' });
  }
});

// @route   GET /api/repairs
// @desc    Get all repairs (Admin view)
router.get('/', async (req, res) => {
  try {
    const repairs = await Repair.find().sort({ createdAt: -1 });
    res.json(repairs);
  } catch (error) {
    console.error('Error fetching repairs:', error);
    res.status(500).json({ error: 'Error del servidor al obtener las reparaciones.' });
  }
});

// @route   GET /api/repairs/track/:trackingId
// @desc    Get a repair by tracking ID (Client view)
router.get('/track/:trackingId', async (req, res) => {
  try {
    const trackingId = req.params.trackingId.toUpperCase().trim();
    const repair = await Repair.findOne({ trackingId });

    if (!repair) {
      return res.status(404).json({ error: 'Orden de reparación no encontrada.' });
    }

    res.json(repair);
  } catch (error) {
    console.error('Error tracking repair:', error);
    res.status(500).json({ error: 'Error del servidor al buscar la orden.' });
  }
});

// @route   PUT /api/repairs/:id
// @desc    Update repair status/details (Admin update)
router.put('/:id', async (req, res) => {
  try {
    const { status, cost, notes } = req.body;
    
    // Find repair by MongoDB ID
    const repair = await Repair.findById(req.params.id);
    if (!repair) {
      return res.status(404).json({ error: 'Reparación no encontrada.' });
    }

    if (status) repair.status = status;
    if (cost !== undefined) repair.cost = cost;
    if (notes !== undefined) repair.notes = notes;

    const updatedRepair = await repair.save();
    res.json(updatedRepair);
  } catch (error) {
    console.error('Error updating repair:', error);
    res.status(500).json({ error: 'Error del servidor al actualizar la orden.' });
  }
});

export default router;
