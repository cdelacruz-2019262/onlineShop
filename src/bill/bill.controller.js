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
        )
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
                    product: item.product,
                    amount: item.amount
                });
            }
        }

        const buy = new Saver({
            user: bill.user,
            items: billItems,
            totalAmount: bill.total
        });
        const savedBill = await buy.save();


        // create a new PDF document
        let print = new pdf()
        const filePath = path.resolve('bill.pdf')
        print.pipe(fs.createWriteStream(filePath))
        print.fontSize(18)
        print.text("Bill", { align: 'center' })
        print.text("____________________________________________________________________", { align: 'center' })
        print.moveDown()

        print.text(`Date ${Date.now()}`)
        print.text(`Client: ${user.name} `)
        print.moveDown()

        print.text('Products list')
        print.text('_____________')
        print.moveDown()

        bill.products.forEach((products, index) => {
            let pid = products.product
            const prod = Product.findById(pid)
            //console.log(prod)
            print.text(`${index + 1}, ${products.product}`)
            print.text(`Amount: ${products.amount}`)
        })
        print.moveDown()

        print.text(`________________________`)
        print.text(`Total: Q${bill.total}`)
        print.end()
        res.sendFile(filePath);
        return res.send({ message: "printed!" })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: "Error on the bill printing" })
    }
}
