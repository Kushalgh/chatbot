import express from "express";
import { Request, Response } from "express";

const router = express.Router();

const dummyAccounts: Record<string, { balance: number; name: string }> = {
  "1234567890": { balance: 5000, name: "John Doe" },
  "0987654321": { balance: 10000, name: "Jane Smith" },
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
      message: "Invalid account name or account numbersss",
    });
  }
});

export default router;
