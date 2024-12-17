import express from "express";
import { Request, Response } from "express";

const router = express.Router();

const dummyAccounts: Record<string, { balance: number; name: string }> = {
  "1234567890": { balance: 5000, name: "Kushal Ghimire" },
  "0987654321": { balance: 10000, name: "Saugat Dawadi" },
  "1234567891": { balance: 0, name: "Sudip Poudel" },
  "0123456789": { balance: 10000000, name: "Vardan Shrestha" },
  "0000000000": { balance: 10000000, name: "Madhusudhan Sapkota " },
};

router.post("/validate-account", (req: Request, res: Response) => {
  const {
    accountName,
    accountNumber,
  }: { accountName: string; accountNumber: string } = req.body;

  console.log("Received Account:", accountName, accountNumber);

  if (
    accountNumber in dummyAccounts &&
    dummyAccounts[accountNumber].name.toLowerCase() ===
      accountName.toLowerCase()
  ) {
    res.json({
      success: true,
      message: "Account validated successfully",
      data: {
        balance: dummyAccounts[accountNumber].balance,
        name: dummyAccounts[accountNumber].name,
      },
    });
  } else {
    res.json({
      success: false,
      message: "Invalid account name or account number",
    });
  }
});

export default router;
