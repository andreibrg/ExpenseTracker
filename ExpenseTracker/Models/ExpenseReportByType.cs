using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker.API.Models
{
    public class ExpenseReportByType
    {
        public double Amount { get; private set; }
        public ExpenseType ExpenseType { get; private set; }

        public ExpenseReportByType(double amount, ExpenseType expenseType)
        {
            this.Amount = amount;
            this.ExpenseType = expenseType;

        }
    }
}
