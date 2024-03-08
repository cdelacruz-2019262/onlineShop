import Bill from '../buyCar/buyCar.model.js'
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
        if (!bill) {
            return res.status(401).send({ message: "No bill found!" })
        }

        // create a new PDF document
        let print = new pdf()
        const filePath = path.resolve('bill.pdf')
        print.pipe(fs.createWriteStream(filePath))
        print.fontSize(18)
        print.text("Bill", { align: 'center' })
        print.moveDown()

        print.text(`Date ${Date.now}`)
        print.text(`Client: ${bill.user.name} `)
        print.moveDown()

        print.text('Products list')
        print.moveDown()

        bill.products.forEach((products, index) => {
            print.text(`${index + 1}, ${products.product.name}`)
            print.text(`Amount: ${products.amount}`)
        })
        print.moveDown()

        print.text(`Total: Q${bill.total}`)
        print.end()
        res.sendFile(filePath);
        
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: "Error on the bill printing" })
    }
}
