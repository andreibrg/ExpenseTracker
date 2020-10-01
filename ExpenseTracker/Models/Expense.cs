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
        [Key]
        public long? Id { get; set; }
        [Required]
        public DateTime TransactionDate { get; set; }
        [Required]
        public double Amount { get; set; }
        [MaxLength(100)]
        public string Recipient { get; set; }
        [Required]
        [MaxLength(10)]
        public string Currency { get; set; }
        [Required]
        public ExpenseType ExpenseType { get; set; }
    }
}
