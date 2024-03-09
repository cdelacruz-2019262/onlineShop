import Bill from '../buyCar/buyCar.model.js'
import User from '../user/user.model.js'
import Product from '../product/product.model.js'
import Saver from './bill.model.js'
import pdf from 'pdfkit'
import fs from 'fs'
import path from 'path'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test function is running' })
}

export const printBill = async (req, res) => {
    try {
        let uid = req.user._id
        let bill = await Bill.findOne(
            { user: uid }
        ).populate('user').populate('products.product')
        let user = await User.findById(uid)
        //console.log(user)

        if (!bill) {
            return res.status(401).send({ message: "No bill found!" })
        }

        const billItems = [];
        for (const item of bill.products) {
            const productData = await Product.findById(item.product);
            if (productData) {
                billItems.push({
                    product: productData._id,
                    amount: item.amount
                });
            }
        }

        const buy = new Saver({
            user: bill.user,
            products: billItems,
            total: bill.total
        });
        const savedBill = await buy.save();
        console.log(savedBill);


        // create a new PDF document
        let print = new pdf()
        const filePath = path.resolve('bill.pdf')
        print.pipe(fs.createWriteStream(filePath))
        print.fontSize(18)
        print.font('Helvetica-Bold')
        print.text("Bill", { align: 'center' })
        print.font('Helvetica-Oblique')
        print.text("____________________________________________________________________", { align: 'center' })
        print.moveDown()

        print.text(`Date ${new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`)
        print.text(`Time ${new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}`)
        print.text(`Client: ${user.name} `)
        print.text(`________________________`)
        

        print.text('Products list')
        print.text('_____________')
        

        bill.products.forEach((products, index) => {
            print.text(`${index + 1}, name ${products.product.name}`)
            print.text(` Unitary price ${products.product.price}`)
            print.text(`Amount: ${products.amount}`)
            print.moveDown()
        })
        print.moveDown()

        print.text(`________________________`, { align: 'right' })
        print.font('Helvetica-Bold')
        print.text(`Total: Q${bill.total}`, { align: 'right' })
        print.end()
        res.sendFile(filePath);
        if (bill) {
            await Bill.updateMany({ user: uid }, { $set: { products: [] }})
        }
        return res.send({ message: "printed!" })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: "Error on the bill printing" })
    }
}
