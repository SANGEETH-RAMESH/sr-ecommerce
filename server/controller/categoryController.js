

const user = require('../model/userModel')

const category = require('../model/categorymodel')

const Product = require('../model/productModel') 


const { ObjectId } = require('mongodb'); 


const LoadCategory = async (req, res) => { 
    try {
        const Categorys = await category.find()
        const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
        const limit = 5;
        const count = await category.countDocuments(); // Total number of products

        const totalPages = Math.ceil(count / limit); // Total number of pages


        const skip = (page - 1) * limit; // Number of products to skip

        const categorys = await category.find().skip(skip).limit(limit); // Fetch products for the current page
        
        res.render('category', {
            Categorys: categorys,

            currentPage: page,
            totalPages: totalPages
        })
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const UnBlock = async (req, res) => {
    try {
        
        const User = req.params.userId
       
        // const  User=new user()
        const updatedUser = await user.findByIdAndUpdate(
            User,
            { is_delete: true },
            { new: true }
        );

        if (updatedUser != null) {
            if (updatedUser.is_delete == false) {

                updatedUser.is_delete = true;

            }
        }

        const success = "sdjfkdjf"
        res.json(success);

    } catch (error) {
        res.render('error404',{error:error})
    }
}

const Block = async (req, res) => {
    try {
        const Users = req.params.userId
       
        const updatedUser = await user.findByIdAndUpdate(
            Users,
            { is_delete: true },
            { new: true }
        );
        
        if (updatedUser.is_delete === true) {
        
            updatedUser.is_delete = false; // corrected assignment here
        
        }
        const Usser = await updatedUser.save()
        res.json(Usser);

    } catch (error) {
        res.render('error404',{error:error})
    }
};

const LoadAddCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
        const limit = 5;
        const count = await Product.countDocuments(); // Total number of products
        const totalPages = Math.ceil(count / limit); // Total number of pages

        const skip = (page - 1) * limit; // Number of products to skip
        const products = await Product.find().skip(skip).limit(limit);
        
        res.render('addcategory')
      
    } catch (error) {
        res.render('error404',{error:error})
    }
}




const addCategory = async (req, res) => {
    try {
     
        const user = new category({
            categoryname: req.body.categoryname,
            image: req.file.filename
        })
     
        const categoryNameLowerCase = user.categoryname.toLowerCase();

        const userData = await category.findOne({
            categoryname: { $regex: new RegExp('^' + categoryNameLowerCase + '$', 'i') }
        });

        if (userData) {
            res.render('addcategory', { message: "Category Already Existed" });
        }
        else {
            // con sole.log('added')
       
            const user_data = await user.save();
          
            res.redirect('/admin/category');
     
        }

    } catch (error) {
        // console.error('Error saving category:', error);
        res.render('error404',{error:error})
    }
};

const LoadeditCategory = async (req, res) => {
    try {
        const CategoryId = req.params.CategoryId
       

        const Categorys = await category.findOne({ _id: CategoryId })
 

      
        res.render('editcategory', { Categorys })

       
    } catch (error) {
        res.render('error404',{error:error})
    }
}


const EditedCategory = async (req, res) => {
    try {
  
        const { categoryname, categoryid } = req.body;
       
   
        const image = req.file
       
        const CategoryId = req.params.CategoryId
        const Categorys = await category.findOne({ _id: CategoryId })
        

        const Categoryss = await category.findOne({ categoryname: categoryname })

        const hexString = new ObjectId(CategoryId)
     

        if (Categoryss != null) {
            if (categoryname == Categoryss.categoryname && CategoryId != Categoryss._id) {
                return res.render('editcategory', { Categorys, message: "Category Already Exist" })
            }
        }

        const categoryToUpdate = await category.findOne({ _id: CategoryId });
        if (categoryname) {
            categoryToUpdate.categoryname = categoryname;
        }
        else if (categoryname == '') {
            categoryToUpdate.categoryname = categoryToUpdate.categoryname
        }
        else {
            categoryToUpdate.categoryname = categoryToUpdate.categoryname;
        }
        if (image) {
            categoryToUpdate.image = req.file.filename;
        }
        else {
            categoryToUpdate.image = categoryToUpdate.image
        }
        if (categoryname === '' && categoryid === '' && image === '') {
           
            return res.redirect('/admin/category');
        }

        // Find the category to update based on the categoryid

        const Categoryy = await category.find();
       

        

        // Save the updated document
        await categoryToUpdate.save();

     
        // Redirect to the desired route
        res.redirect('/admin/category');
    } catch (error) {
        res.render('error404',{error:error})
        // res.status(500).send("Error updating category.");
    }
};

const unlistedCategory = async (req, res) => {
    try {
     
        const categories = await category.find({ is_delete: true });
     

     
        res.render('unlistedcategory', { categories })
    } catch (error) {
        res.render('error404',{error:error})
    }
}

const deleteCategory = async (req, res) => {
    try {
       
        const CategoryId = req.params.CategoryId
        const Category = await category.findOneAndUpdate(
            { _id: CategoryId },
            { $set: { is_delete: true } },
            { new: true }
        );
        res.status(200).json({ success: true })
        //   res.render('category')
       

    } catch (error) {
        res.render('error404',{error:error})
    }
}

const RetrieveCategory = async (req, res) => {
    try {
        const CategoryId = req.params.CategoryId;
        
        const categorys = await category.findByIdAndUpdate(CategoryId)
        const Category = await category.findOneAndUpdate(
            { _id: CategoryId },
            { $set: { is_delete: false } },
            { new: true }
        );
        res.status(200).json({ success: true })
       

    } catch (error) {
        res.render('error404',{error:error})
    }
}


const BacktoCategory = async (req, res) => {
    try {
   
        res.redirect('/admin/category')

    } catch (error) {
        res.render('error404',{error:error})
    }
}


module.exports = {
    LoadCategory,
    UnBlock,
    Block,
    LoadAddCategory,
    addCategory,
    LoadeditCategory,
    EditedCategory,
    unlistedCategory,
    deleteCategory,
    RetrieveCategory,
    BacktoCategory
}