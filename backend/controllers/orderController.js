const { ObjectId } = require("mongodb");
const Order = require("../models/orderModel")
const Organization = require("../models/organizationModel")

const getOrders = async (req, res) => {
    const userId = new ObjectId(req.user._id);

    // Query the organization
    const organization = await Organization.findOne({
      $or: [
        { employees: userId },
        { admins: userId }
      ]
    });

    // Extract the organization ID
    const orgId = organization ? organization._id.toString() : null;

    try {
        const orders = await Order.find({ "org._id": orgId });
        res.json(orders);

    } catch (error) {
        res.status(500).json({ error })
    }
}

const createOrder = async (req, res) => {
    const { org, admin, cart } = req.body;

    try {
        const newOrder = new Order({ org, admin, cart });
        await newOrder.save();
        res.json(newOrder);
    }

    catch (error) {
        res.status(500).json({error})
    }
}

const markOrderAsComplete = async (req, res) => {
    let { id } = req.body;
    id = new ObjectId(id);

    try {
        const updated = await Order.findOneAndUpdate({_id: id}, { status: "fulfilled", isActive: false}, {new: true})
        console.log("updated: ", updated)
        res.status(200).json(updated)
        console.log("updated:", updated)
    } catch (err) {
        console.log("err:", err)
        res.status(400).json({ err })
    }
}

const markOrderAsPending = async (req, res) => {
    let { id } = req.body;
    id = new ObjectId(id);

    try {
        const updated = await Order.findOneAndUpdate({_id: id}, { status: "pending", isActive: false}, {new: true})
        console.log("updated: ", updated)
        res.status(200).json(updated)
        console.log("updated:", updated)
    } catch (err) {
        console.log("err:", err)
        res.status(400).json({ err })
    }
}

const markOrderAsRejected = async (req, res) => {
    let { id } = req.body;
    id = new ObjectId(id);

    try {
        const updated = await Order.findOneAndUpdate({_id: id}, { status: "rejected", isActive: false}, {new: true})
        console.log("updated: ", updated)
        res.status(200).json(updated)
        console.log("updated:", updated)
    } catch (err) {
        console.log("err:", err)
        res.status(400).json({ err })
    }
}

const markOrderAsPlaced = async (req, res) => {
    const { id } = req.body;
    try {
        const updated = await Order.findOneAndUpdate({_id: id}, { status: "rejected", isActive: false}, {new: true})
        Order.findOneAndUpdate({_id: id}, { status: "placed" , isActive: true }, { new: true })
        res.status(200).json(updated)
        console.log("updated:", updated)
    } catch (err) {
        res.status(400).json({ err })
        console.log("err:", err)
    }
    
}

module.exports = { getOrders, createOrder, markOrderAsComplete, markOrderAsPending, markOrderAsRejected, markOrderAsPlaced }