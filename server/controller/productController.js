

const category = require('../model/categorymodel')

const Product = require('../model/productModel')

const sharp = require('sharp')

// const { ObjectId } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const ObjectId = require('mongodb').ObjectId;
const LoadProduct = async (req, res) => {
    // Number of products per page

    try {
       
        const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
        const limit = 5;
        const count = await Product.countDocuments(); // Total number of products
        const totalPages = Math.ceil(count / limit); // Total number of pages

        const skip = (page - 1) * limit; // Number of products to skip
        
        const products = await Product.find().populate('categoryId').skip(skip).limit(limit); // Fetch products for the current page
        
        res.render('product', {
            Products: products,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

const LoadaddProduct = async (req, res) => {
    try {
        const Category = await category.find()
        const categoryData = Category.map(category => ({
            _id: category._id,
            categoryname: category.categoryname
        }))


        res.render('addproduct', { categoryData })
    } catch (error) {
        console.log(error)
    }
}


const addproduct = async (req, res) => {
    try {

        const productname = req.body.productname;
        const productNameTrimmed = productname.trim();
        const productNameLowerCase = productNameTrimmed.toLowerCase();

        const productDat = await Product.find();

        // Check each productname in productDat
        const matchingProducts = productDat.filter(product => {

            const trimmedProductName = product.productname.trim().toLowerCase();

            var productNameWithoutSpaces = trimmedProductName.replace(/\s+/g, '');


            return productNameWithoutSpaces === productNameLowerCase;

        });

        if (matchingProducts.length > 0) {


            res.json({ message: "Productname Already exits" })
        }
        else {
            const imageurl = []
            for (let i = 0; i < req.files.length; i++) {
                const cropped = await sharp(req.files[i].path)
                    .resize({ width: 306, height: 408, fit: sharp.fit.cover })
                    .toBuffer();
                const filename = `cropped_${req.files[i].originalname}`;
                imageurl.push(filename); // Consider modifying this line based on your intended logic
                await sharp(cropped).toFile(`server/uploads/product/${filename}`);
            }



            const newProduct = new Product({
                productname: req.body.productname,
                quantity: req.body.quantity,
                image: imageurl,
                price: req.body.price,
                description: req.body.description,
                categoryId: req.body.categoryId

            });





            const Category = await category.find()
            const categoryData = Category.map(category => ({
                _id: category._id,
                categoryname: category.categoryname
            }))



            const product_data = await newProduct.save();
            res.json({ message: "Product Added" })
        }




    } catch (error) {

        console.log(error.message)
    }
};



const BacktoProduct = async (req, res) => {
    try {
        res.redirect('/admin/product')
    } catch (error) {
        console.log(error)
    }
}

const Loadeditproduct = async (req, res) => {
    try {


        const ProductId = req.params.ProductId

        const Category = await category.find()
        const categoryData = Category.map(category => ({
            _id: category._id,
            categoryname: category.categoryname
        }))
        const Products = await Product.findOne({ _id: ProductId })

        res.render('editproduct', { categoryData, Products })
    } catch (error) {
        console.log(error)
    }
}

const imageupdate = async (req, res) => {
    try {

        const { index, file1 } = req.query

        const already = await Product.findOne({ productname: req.query.productname })



    } catch (error) {
        console.log(error.message)
    }
}

const editproduct = async (req, res) => {
    try {
       
        const ProductId = req.query.productid;

        const Category = await category.find()

        const Products = await Product.findOne({ _id: ProductId })



        const { productname, description, price, quantity, categoryname } = req.body
        
        const Productss = await Product.findOne({ productname: productname })
        

        const productNameTrimmed = productname.trim();
        const productNameLowerCase = productNameTrimmed.toLowerCase();

        const productDat = await Product.find();

        // Check each productname in productDat
        const matchingProducts = productDat.filter(product => {

            const trimmedProductName = product.productname.trim().toLowerCase();

            var productNameWithoutSpaces = trimmedProductName.replace(/\s+/g, '');


            return productNameWithoutSpaces === productNameLowerCase;

        });
        // console.log(matchingProducts,'kdfkdf')
        // if (Productss.productname == productname && Productss._id != ProductId) {
        //             console.log('hellodfldj')
        //         res.json({ message: 'Product Name Already exist' })
        //         // return res.render('editproduct', { Products, message: "Product Name already exist" })
        //     }
        
        if (matchingProducts != '' &&!matchingProducts[0]._id.equals(new ObjectId(ProductId))) {
           
            const Matching = matchingProducts[0].productname.toLowerCase();

            const Productname = productname.toLowerCase();
            if (matchingProducts.length > 0 && Matching == Productname && !matchingProducts[0]._id.equals(new ObjectId(ProductId))) {


                res.json({ message: "Product Name Already exist" })
            }
        }

        else {
 
           
            const ProductToUpdate = await Product.findByIdAndUpdate({ _id: ProductId })

            const deletedImagesArray = JSON.parse(req.body.deletedImages);
            const filenames = [];
            deletedImagesArray.forEach(image => {
                filenames.push(image.imageName);
            });


            console.log('11')
            const LoadProduct = await Product.findOne({ _id: req.query.productid })

            console.log(LoadProduct,'siuuuuuuuuuuu')
            filenames.forEach(Deleting => {
                const index = LoadProduct.image.indexOf(Deleting)
                if (index != -1) {
                    LoadProduct.image.splice(index, 1)
                }
            })
            console.log('1')
            // console.log(LoadProduct,'dfdf')
            await LoadProduct.save();


            console.log('2')
            if (productname == '') {
                ProductToUpdate.productname = ProductToUpdate.productname;
                await ProductToUpdate.save();
            }
            else {
                ProductToUpdate.productname = productname;
            }

            if (categoryname == '') {
                ProductToUpdate.categoryId = ProductToUpdate.categoryname;
                await ProductToUpdate.save();
            }
            else {
                ProductToUpdate.categoryId = req.body.categoryId;
            }

            if (description == '') {
                ProductToUpdate.description = description;

            }
            else {
                ProductToUpdate.description = description
            }

            if (price == '') {
                ProductToUpdate.price = ProductToUpdate.price
                await ProductToUpdate.save();
            }
            else {
                ProductToUpdate.price = price;
                await ProductToUpdate.save();
            }

            if (quantity == '') {
                ProductToUpdate.quantity = ProductToUpdate.quantity;
                await ProductToUpdate.save();
            }
            else {
                ProductToUpdate.quantity = quantity;
                await ProductToUpdate.save();
            }

            console.log('3')
            const imageUrls = [];
            if (req.files == '') {
                // If no new file is uploaded, keep the existing image
                await ProductToUpdate.save();
            } else if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const cropped = await sharp(req.files[i].path)
                        .resize({ width: 306, height: 408, fit: sharp.fit.cover })
                        .toBuffer();
                    const filename = `cropped_${req.files[i].originalname}`;
                    const imageUrl = `${filename}`; // Construct the full image URL
                    imageUrls.push(imageUrl); // Push the full image URL into the array
                    await sharp(cropped).toFile(`server/uploads/product/${filename}`); // Save the cropped image
                }


                // Concatenate the new image URLs with the existing ones
                ProductToUpdate.image = ProductToUpdate.image.concat(imageUrls)
                await ProductToUpdate.save();
            }


            console.log('4')
            console.log(ProductToUpdate,'upateing')
            await ProductToUpdate.save();

            res.json({ success: "true" })
        }




    } catch (error) {
        console.log(error.message)
    }
}

const deleteimage = async (req, res) => {
    try {

        const ProductId = req.params.ProductId;
        const Filename = req.params.Filename;

        const Products = await Product.findOne({ _id: ProductId })

        const index = Products.image.indexOf(Filename);

        if (index !== -1) {
            Products.image.splice(index, 1);
            await Products.save()
            res.json({ success: true })
        }


    }

    catch (error) {
        console.log(error)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const ProductId = req.params.ProductId;
        
        const Products = await Product.findOneAndUpdate(
            { _id: ProductId },
            { $set: { is_delete: true } },
            { new: false }
        );
        res.status(200).json({ success: true })
     
        const deleteProduct = await Products.save();

    } catch (error) {
        console.log(error)
    }
}

const UnlistedProduct = async (req, res) => {
    try {

        const Products = await Product.find({ is_delete: true })

        res.render('unlistedproduct', { Products })
    } catch (error) {
        console.log(error)
    }
}

const RetrieveProduct = async (req, res) => {
    try {
        const Productss = req.params.ProductId

        const Products = await Product.findOneAndUpdate(
            { _id: Productss },
            { $set: { is_delete: false } },
            { new: true }
        );
        res.status(200).json({ success: true })
        const deleteProduct = await Products.save();

    } catch (error) {

    }
}


module.exports = {
    LoadProduct,
    LoadaddProduct,
    addproduct,
    BacktoProduct,
    Loadeditproduct,
    editproduct,
    deleteimage,
    imageupdate,
    deleteProduct,
    UnlistedProduct,
    RetrieveProduct
}

