using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker.API.Models
{
    public class Expense
    {
        public long? Id { get; set; }
        public DateTime TransactionDate { get; set; }
        public double Amount { get; set; }
        [Required]
        public string Recipient { get; set; }
        [Required]
        public string Currency { get; set; }
        public ExpenseType ExpenseType { get; set; }
    }
}
