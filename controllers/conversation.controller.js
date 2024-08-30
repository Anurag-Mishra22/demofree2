import createError from "../utils/createError.js";
import { ConversationModel } from "../models/conversation/conversation.model.js";
import { BuyerModel } from "../models/user/buyer.schema.js";

export const createConversation = async (req, res, next) => {

    try {
        // Log current user to check values
        console.log(req.currentUser);

        const isSeller = req.currentUser.isSeller;
        const userId = req.currentUser.id; // Use `id` instead of `userId`
        const sellerId = req.body.to;

        if (!userId || !sellerId) {
            return next(createError(400, "User ID or recipient ID is missing."));
        }

        // Find the buyer by the sellerId
        const buyer = await BuyerModel.findOne({ sellerId });

        if (!buyer) {
            return next(createError(404, "Buyer not found for the provided sellerId."));
        }

        const toUserId = buyer._id; // Get buyer's _id as `toUserId`

        const newConversation = new ConversationModel({
            id: isSeller ? userId + toUserId : toUserId + userId,
            sellerId: isSeller ? userId : toUserId,
            buyerId: isSeller ? toUserId : userId,
            readBySeller: isSeller,
            readByBuyer: !isSeller,
        });

        const savedConversation = await newConversation.save();
        res.status(201).json({ conversationId: savedConversation.id });

    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const updateConversation = async (req, res, next) => {
    try {
        const updatedConversation = await ConversationModel.findOneAndUpdate(
            { id: req.params.id },
            {
                $set: {
                    // readBySeller: true,
                    // readByBuyer: true,
                    ...(req.currentUser.isSeller ? { readBySeller: true } : { readByBuyer: true }),
                },
            },
            { new: true }
        );

        res.status(200).send(updatedConversation);
    } catch (err) {
        next(err);
    }
};

export const getSingleConversation = async (req, res, next) => {
    try {
        const conversation = await ConversationModel.findOne({ id: req.params.id });
        if (!conversation) return next(createError(404, "Not found!"));
        res.status(200).send(conversation);
    } catch (err) {
        next(err);
    }
};

export const getConversations = async (req, res, next) => {
    try {
        const conversations = await ConversationModel.find(
            req.currentUser.isSeller ? { sellerId: req.currentUser.id } : { buyerId: req.currentUser.id }
        ).sort({ updatedAt: -1 });
        res.status(200).send(conversations);
    } catch (err) {
        next(err);
    }
};