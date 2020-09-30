using ExpenseTracker.API.Common;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker.API.Services
{
    public class ExpenseService : IExpenseService
    {
        private readonly ExpenseTrackerContext _context;
        private readonly ILogger<ExpenseService> _logger;
        public ExpenseService(ExpenseTrackerContext context, ILogger<ExpenseService> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<Expense> Create(Expense expense)
        {
            await _context.Expenses.AddAsync(expense);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Created a new expense with id {expense.Id}");
            return expense;
        }

        public async Task Delete(long id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                throw new Exception(ErrorMessages.ItemNotFoundError);
            }
            _context.Expenses.Remove(expense);            
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Deleted expense with id {expense.Id}");
        }

        public async Task<Expense> Get(long id)
        {
            return await _context.Expenses.FindAsync(id);            
        }

        public async Task<IList<Expense>> Search()
        {
            return await _context.Expenses.ToListAsync();
        }

        public async Task Update(long id, Expense expense)
        {
            _context.Entry(expense).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Updated expense with id {expense.Id}");
            //todo catch errors
        }
    }
}
