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
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                _logger.LogError($"Failed to create Expense : {e.Message}");
                throw;
            }
            _logger.LogInformation($"Created a new expense with id {expense.Id}");
            return expense;
        }

        public async Task Delete(long id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                throw new ItemNotFoundException(ErrorMessages.ItemNotFoundError); 
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
            expense.Id = id;
            _context.Entry(expense).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();

            }
            catch (Exception e)
            {                
                if (!ExpenseExists(id))
                {
                    _logger.LogError($"Failed to update Expense with id {id} because it does not exist");
                    throw new ItemNotFoundException(ErrorMessages.ItemNotFoundError);
                }
                else
                {
                    _logger.LogError($"Failed to update Expense with id {id}: {e.Message}");
                    throw;
                }
            }
            _logger.LogInformation($"Updated expense with id {expense.Id}");
        }

        private bool ExpenseExists(long id)
        {
            return _context.Expenses.Any(e => e.Id == id);
        }
    }
}
