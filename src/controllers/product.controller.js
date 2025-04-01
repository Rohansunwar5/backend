// import  { Collection } from "mongoose";
import { Product } from "../models/products.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import xlsx from "xlsx"; // Import the xlsx library
import fs from "fs";
import { Collection } from "../models/collections.model.js";
import { Category } from "../models/categories.model.js";
import { SubCategory } from "../models/subCategories.model.js";

const getAllProducts = asyncHandler( async (req, res) => {

    
    const products = await Product.find().populate("category");
    
    if ( !products ) 
        throw new ApiError(500, "Internal server error!");

    console.log(products[0]);
    return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully!"));
});

const getAProduct = asyncHandler( async (req, res) => {
    try {
        const { id } = req.params;
    
        if ( !id )
            throw new ApiError(404, "No product Id present!");
    
        const product = await Product.findOne({ _id : id }).populate("category");
    
        if ( !product ) 
            throw new ApiError(404, "No product with the id '"+id+"' found");
    
        return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
    } catch (error) {
        console.log(error);
        
        return res.status(error.status || 500).json(error);
    }
});

const getAllProductsInACategory = asyncHandler( async (req, res) => {
    const { category } = req.params;

    if ( !category )
        throw new ApiError(404, "No category found!");

    const productsInCategory = await Product.find({ productCategory: category }).populate("productCategory");

    if ( !productsInCategory )
        throw new ApiError(404, "No products in this category or no such category found");

    return res.status(200).json(new ApiResponse(200, productsInCategory, "Products fetched successfully!"));
});

const updateAProduct = asyncHandler( async(req, res) => {
    try{
        const { id } = req.params;
        const { updatedProductFromReq } = req.body;

        if ( !(req?.user?.role === "Admin") )
            throw new ApiError(400, "Unauthorized requrest!");

        if ( !id )
            throw new ApiError(400, "No id found!");

        if ( !updatedProductFromReq )
            throw new ApiError(400, "No updated product found!");

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductFromReq, {runValidators: true, new: true}).populate("productCategory");

        console.log(updatedProduct);

        if ( !updatedProduct )
            throw new ApiError(500, "Internal server error!");
        return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
    } catch (error) {
        let errorMessage;
        let type;
        console.log(error);
        
        if ( error.path === "productCategory" ) {
            type = "productCategory";
            errorMessage = `Please select a product category!`;
        }

        if ( error.code == 11000 ){
            type = "productId";
            errorMessage = `product with ID: ${error?.keyValue?.productId}, not found!`;
        } 
        return res.status(400).json({ error, errorMessage, type });
    }
});

const deleteAProduct = asyncHandler( async(req, res) => {
    try {
        const { id } = req.params;
    
        if ( !(req?.user?.role === "Admin") )
            throw new ApiError(400, "Unauthorized requrest!");

        if ( !id )
            throw new ApiError(400, "No id found!");

        const deleteResponse = await Product.deleteOne({ _id: id });

        if ( !deleteResponse )
            throw new ApiError(400, "Product deletion unsuccessfull!");

        return res.status(200).json(new ApiResponse(200, deleteResponse, "Product deletion successfull!"));
    } catch (error) {
        console.log(error);        
        return res.json(error);
    }
});

const deleteMultipleProducts = asyncHandler( async(req, res) => {
    try {
        const { ids } = req.body;
    
        if ( !(req?.user?.role === "Admin") )
            throw new ApiError(400, "Unauthorized requrest!");
    
        if ( !ids ) 
            throw new ApiError(404, "No ids found!");
    
        if ( !(ids instanceof Array) )
            throw new ApiError(400, "No array provided!");
    
        const deleteResponse = await Product.deleteMany({ _id: { $in: ids } });

        console.log(deleteResponse);
        

        if ( !deleteResponse )  
            throw new ApiError(400, "Product deletion unsuccessfull!");

        res.status(200).json(new ApiResponse(200, deleteResponse, "Products deleted successfully!"));
    
    } catch (error) {
        return res.status(error.status || 500).json(error);
    }
});

const createAProduct = asyncHandler( async (req, res) => {
    try {
        const { product } = req.body;
    
        // if ( !(req?.user?.role === "Admin") )
        //     throw new ApiError(400, "Unauthorized requrest!");
    
        if ( !product )
            throw new ApiError(400, "No product object recieved!");
    
        const newProduct = await Product.create(product);
    
        /* Todo: Handle images */
    
        if ( !newProduct )
            throw new ApiError(500, "Error while creating the product!");
    
        return res.status(200).json(new ApiResponse(200, newProduct, "Product created successfully!"));    
    } catch (error) {
        let errorMessage;
        let type;
        if ( error.code == 11000 ){
            type = "productId";
            errorMessage = `product with ID: ${error?.keyValue?.productId}, already exists!`;
        } 
        console.log(error);
        return res.status(400).json({ error, errorMessage, type });
    }
});

const uploadProductsFromExcel = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            throw new ApiError(400, "No file uploaded.");
        }
        console.log("Uploaded file path:", req.file.path);

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Enhanced number converter with NaN handling
        const safeNumber = (value) => {
            if (value === null || value === undefined || value === '' || value === 'null') {
                return null;
            }
            const num = Number(value);
            return isNaN(num) ? null : num; // Return null for NaN values
        };

        for (const row of data) {
            try {
                const {
                    productId,
                    name,
                    category,
                    subCategory,
                    collections,
                    netWeight,
                    grossWeight,
                    solitareWeight,
                    multiDiamondWeight,
                    diamondWeight,
                    noOfSolitares,
                    noOfMultiDiamonds,
                    shapeOfSolitare,
                    shapeOfMultiDiamonds,
                    shapeOfPointers,
                    gender,
                    goldColour
                } = row;

                // Process collections
                const collectionNames = collections?.split("&").map(name => name.trim().toLowerCase()) || [];
                const collectionIds = [];
                for (const collectionName of collectionNames) {
                    let collectionDoc = await Collection.findOne({ name: collectionName });
                    if (!collectionDoc) {
                        collectionDoc = await Collection.create({ name: collectionName });
                        console.log(`New collection created: ${collectionDoc.name}`);
                    }
                    collectionIds.push(collectionDoc._id);
                }

                // Process category
                let categoryDoc = null;
                if (category) {
                    categoryDoc = await Category.findOne({ name: category.trim().toLowerCase() });
                    if (!categoryDoc) {
                        categoryDoc = await Category.create({ 
                            name: category.trim().toLowerCase(),
                            description: "Imported from Excel"
                        });
                        console.log(`New category created: ${categoryDoc.name}`);
                    }
                }

                // Process subcategories
                const subCategoryIds = [];
                if (subCategory) {
                    const subCategoryNames = subCategory.split("&").map(name => name.trim().toLowerCase());
                    for (const subCatName of subCategoryNames) {
                        let subCategoryDoc = await SubCategory.findOne({ name: subCatName });
                        if (!subCategoryDoc) {
                            subCategoryDoc = await SubCategory.create({ 
                                name: subCatName,
                                description: "Imported from Excel",
                                parentCategory: categoryDoc?._id
                            });
                            console.log(`New subcategory created: ${subCatName}`);
                        }
                        subCategoryIds.push(subCategoryDoc._id);
                    }
                }

                // Create or update product with safe number conversion
                const productData = {
                    productId,
                    code: productId,
                    name,
                    category: categoryDoc?._id,
                    subCategories: subCategoryIds,
                    collections: collectionIds,
                    netWeight: safeNumber(netWeight),
                    grossWeight: safeNumber(grossWeight),
                    solitareWeight: safeNumber(solitareWeight),
                    diamondWeight: safeNumber(diamondWeight),
                    multiDiamondWeight: safeNumber(multiDiamondWeight),
                    noOfSolitares: safeNumber(noOfSolitares),
                    noOfMultiDiamonds: safeNumber(noOfMultiDiamonds),
                    shapeOfSolitare,
                    shapeOfMultiDiamonds,
                    diaPointers: safeNumber(shapeOfPointers), // Handles NaN
                    gender: gender?.toLowerCase(),
                    goldColor: goldColour?.split("&").map(color => color.trim().toLowerCase()) || []
                };

                const product = await Product.findOneAndUpdate(
                    { productId },
                    productData,
                    { upsert: true, new: true }
                );

                // Update collections with product reference
                for (const collectionId of collectionIds) {
                    await Collection.findByIdAndUpdate(
                        collectionId,
                        { $addToSet: { products: product._id } },
                        { new: true }
                    );
                }

                console.log(`Product processed: ${product.name}`);
            } catch (rowError) {
                console.error(`Error processing row with productId ${row.productId || 'unknown'}:`, rowError);
                // Continue with next row even if one fails
            }
        }

        fs.unlinkSync(req.file.path);
        return res.status(200).json(new ApiResponse(200, {}, "Products uploaded successfully."));
    } catch (error) {
        console.error("Error uploading products:", error);
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        throw new ApiError(500, error.message || "Internal Server Error");
    }
});

export { getAProduct, getAllProducts, updateAProduct, deleteAProduct, deleteMultipleProducts, getAllProductsInACategory, createAProduct, uploadProductsFromExcel};