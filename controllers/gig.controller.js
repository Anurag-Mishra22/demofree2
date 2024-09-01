// import { getDocumentCount } from '@gig/elasticsearch';

import { createGig, getGig, getGigs, getGigsByIds } from '../services/gig.service.js';
import createError from "../utils/createError.js";



const gigCreate = async (req, res, next) => {
    if (!req.currentUser.isSeller) {
        return next(createError(403, "Only sellers can create a gig!"));
    }

    try {
        // Log the request body to debug the issue
        console.log("Request body:", req.body);

        // Remove commas from the price string and convert it to a number
        const price = Number(req.body.price.replace(/,/g, ''));

        // Check if price is a valid number
        if (isNaN(price)) {
            return next(createError(400, "Invalid price format"));
        }

        const gig = {
            ...req.body,
            sellerId: req.currentUser.sellerId,
            username: req.currentUser.username,
            email: req.currentUser.email,
            price
        }

        const createdGig = await createGig(gig);



        res.status(201).json({ message: 'Gig created successfully.', gig: createdGig });
    } catch (err) {
        console.error("Error creating gig:", err);  // Added logging
        next(createError(500, "Failed to create gig"));
    }
};

export const gigGet = async (req, res, next) => {

    try {
        const gig = await getGig(req.params.id);
        if (!gig) next(createError(404, "Gig not found!"));
        res.status(200).send(gig);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const gigsGet = async (req, res, next) => {
    const q = req.body.filter || {};

    let gigIds = q.gigIds;

    // Check if gigIds is a string, then parse it to an array
    if (typeof gigIds === 'string') {
        try {
            gigIds = JSON.parse(gigIds);
        } catch (error) {
            return next(createError(400, "Invalid gigIds format"));
        }
    }

    const filters = {
        ...(gigIds && gigIds.length > 0 && { _id: { $in: gigIds } }),
        ...(q.userId && { userId: q.userId }),
        ...(q.cat && { cat: q.cat }),
        ...(q.subCat && { subCat: { $in: q.subCat } }),
        ...((q.price && q.price.length === 2) && {
            price: {
                $gte: q.price[0],
                $lte: q.price[1],
            }
        }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    try {
        const gigs = await getGigs(filters, q);
        res.status(200).send(gigs);
    } catch (err) {
        next(err);
    }
};
export const gigsGetByIdsRec = async (req, res, next) => {
    const { gigIds } = req.body;

    // Check if gigIds is provided and is an array
    if (!Array.isArray(gigIds) || gigIds.length === 0) {
        return next(createError(400, "Invalid or missing gigIds"));
    }

    // Convert string IDs to ObjectId if necessary
    const objectIdGigIds = gigIds.map(id => {
        try {
            return new ObjectId(id); // Replace with appropriate ObjectId handling
        } catch (error) {
            return next(createError(400, "Invalid gigId format"));
        }
    });

    try {
        const gigs = await getGigsByIds(objectIdGigIds);
        if (gigs.length === 0) {
            return next(createError(404, "No gigs found"));
        }
        res.status(200).send(gigs);
    } catch (err) {
        next(err);
    }
};


export { gigCreate };