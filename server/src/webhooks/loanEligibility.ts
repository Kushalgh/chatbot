import express from "express";
import { Request, Response } from "express";

const router = express.Router();

function checkEligibility(loanType: string, data: any): boolean {
  switch (loanType) {
    case "personal":
      return data.loanAmount <= 50000 && data.term <= 36;
    case "mortgage":
      return (
        data.propertyValue * 0.8 >= data.loanAmount &&
        data.downPayment >= data.propertyValue * 0.2
      );
    case "auto":
      return data.vehiclePrice <= 100000 && data.term <= 60;
    default:
      return false;
  }
}

router.post("/check-loan-eligibility", (req: Request, res: Response) => {
  const { loanAmount, term } = req.body;
  const eligible = checkEligibility("personal", { loanAmount, term });
  res.json({
    success: eligible,
    message: eligible
      ? "You are eligible for a personal loan."
      : "You are not eligible for a personal loan at this time.",
  });
});

router.post("/check-mortgage-eligibility", (req: Request, res: Response) => {
  const { propertyValue, downPayment } = req.body;
  const loanAmount = propertyValue - downPayment;
  const eligible = checkEligibility("mortgage", {
    propertyValue,
    downPayment,
    loanAmount,
  });
  res.json({
    success: eligible,
    message: eligible
      ? "You are eligible for a mortgage loan."
      : "You are not eligible for a mortgage loan at this time.",
  });
});

router.post("/check-auto-loan-eligibility", (req: Request, res: Response) => {
  const { vehiclePrice, term } = req.body;
  const eligible = checkEligibility("auto", { vehiclePrice, term });
  res.json({
    success: eligible,
    message: eligible
      ? "You are eligible for an auto loan."
      : "You are not eligible for an auto loan at this time.",
  });
});

export default router;
