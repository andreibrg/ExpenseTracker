using ExpenseTracker.API.Common;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker.API.Services
{
    public class ExpenseService : IExpenseService
    {
        private ExpenseTrackerContext _context;
        public ExpenseService(ExpenseTrackerContext context)
        {
            _context = context;
        }
        public async Task<Expense> Create(Expense expense)
        {
            await _context.Expenses.AddAsync(expense);
            await _context.SaveChangesAsync();
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
            //todo catch errors
        }
    }
}
