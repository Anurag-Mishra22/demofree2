import { BuyerModel } from "../models/user/buyer.schema.js";
import createError from "../utils/createError.js";

// Controller to get a buyer by email
export const getBuyerByEmailController = async (req, res, next) => {
    try {
        const buyer = await BuyerModel.findOne({ email: req.params.email }).exec();
        if (!buyer) {
            return next(createError(404, "Buyer not found!"));
        }
        res.status(200).json(buyer);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

// Controller to get a buyer by ID
export const getBuyerByIdController = async (req, res, next) => {
    try {
        // Find buyer by ID and select only the specified fields
        const buyer = await BuyerModel.findById(req.params.id)
            .select('email isSeller online profilePicture sellerId username _id')
            .exec();

        if (!buyer) {
            return next(createError(404, "Buyer not found!"));
        }

        // Return only the selected fields
        res.status(200).json(buyer);
    } catch (err) {
        console.log(err);
        next(err);
    }
};


// Controller to get buyers by an array of IDs
export const getBuyersByIdsController = async (req, res, next) => {
    try {
        const { ids } = req.body; // Assuming the array of buyer IDs is sent in the request body

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return next(createError(400, "No buyer IDs provided or invalid input."));
        }

        // Find buyers by IDs and select only the specified fields
        const buyers = await BuyerModel.find({ _id: { $in: ids } })
            .select('email isSeller online profilePicture sellerId username _id')
            .exec();

        if (!buyers || buyers.length === 0) {
            return next(createError(404, "Buyers not found!"));
        }

        // Return the array of buyer data
        res.status(200).json(buyers);
    } catch (err) {
        console.log(err);
        next(err);
    }
};