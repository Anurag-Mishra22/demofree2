import { SellerModel } from "../models/user/seller.schema.js";
import { BuyerModel } from "../models/user/buyer.schema.js";
import { updateBuyerIsSellerProp } from "./buyer.service.js";
import { GigModel } from "../models/gig/gig.schema.js"; // Assuming you have a GigModel for the Gig schema

const getSellerByEmail = async (email) => {
    const seller = await SellerModel.findOne({ email }).exec();
    return seller;
};

const createSeller = async (sellerData, req) => {
    try {
        const createdSeller = await SellerModel.create(sellerData);
        const sellId = createdSeller._id;
        updateBuyerIsSellerProp(req.currentUser.email, sellId);

        return createdSeller;
    } catch (error) {
        throw new Error("Failed to create seller: " + error.message);
    }
};

const isSeller = async (email) => {
    const isSell = await BuyerModel.findOne({ email }).exec();
    console.log(isSell);
    if (isSell && isSell.isSeller) {
        return true;
    }
    return false;
}

const updateTotalGigsCount = async (sellerId) => {
    const count = await GigModel.countDocuments({ sellerId }).exec();

    await SellerModel.updateOne({ _id: sellerId }, { $inc: { totalGigs: count } }).exec();
}

const getSellerById = async (sellerId) => {
    try {
        const seller = await SellerModel.findById(sellerId).exec();
        if (!seller) {
            throw new Error("Seller not found");
        }
        return seller;
    } catch (error) {
        throw new Error("Failed to get seller: " + error.message);
    }
}

export {
    getSellerByEmail,
    createSeller,
    isSeller,
    updateTotalGigsCount,
    getSellerById
};
