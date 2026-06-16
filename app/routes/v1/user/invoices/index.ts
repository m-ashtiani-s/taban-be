import express from "express";
import InvoiceController from "../../../../../modules/invoice/controller/invoice.controller";
import InvoiceValidation from "../../../../../modules/invoice/validation/invoice.validation";

const userInvoicesRouter = express.Router();
const invoiceController = new InvoiceController();

userInvoicesRouter.get("/", InvoiceValidation.getInvoices, invoiceController.getMyInvoices);
userInvoicesRouter.get("/:invoiceId", InvoiceValidation.invoiceId, invoiceController.getMyInvoiceById);
userInvoicesRouter.put("/:invoiceId/pay", InvoiceValidation.invoiceId, invoiceController.payInvoice);

export default userInvoicesRouter;
