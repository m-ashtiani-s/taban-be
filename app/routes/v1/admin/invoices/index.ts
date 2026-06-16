import express from "express";
import AdminInvoiceController from "../../../../../modules/invoice/controller/invoice.admin.controller";
import InvoiceValidation from "../../../../../modules/invoice/validation/invoice.admin.validation";

const adminInvoicesRouter = express.Router();
const adminInvoiceController = new AdminInvoiceController();

adminInvoicesRouter.get("/", InvoiceValidation.getInvoices, adminInvoiceController.getInvoices);
adminInvoicesRouter.get("/order/:orderId", InvoiceValidation.orderId, adminInvoiceController.getOrderInvoices);
adminInvoicesRouter.get("/:invoiceId", InvoiceValidation.invoiceId, adminInvoiceController.getInvoiceById);
adminInvoicesRouter.post("/", InvoiceValidation.createInvoice, adminInvoiceController.createInvoice);
adminInvoicesRouter.put(
	"/:invoiceId",
	InvoiceValidation.invoiceId,
	InvoiceValidation.updateInvoice,
	adminInvoiceController.updateInvoice
);
adminInvoicesRouter.put("/:invoiceId/issue", InvoiceValidation.invoiceId, adminInvoiceController.issueInvoice);
adminInvoicesRouter.put("/:invoiceId/cancel", InvoiceValidation.invoiceId, adminInvoiceController.cancelInvoice);

export default adminInvoicesRouter;
