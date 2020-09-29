using ExpenseTracker.API.Models;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker.API.Services
{
    public interface IExpenseService
    {
        Task<IList<Expense>> Search();
        Task<Expense> Get(long id);
        Task<Expense> Create(Expense expense);
        Task Update(long id, Expense expense);
        Task Delete(long id);

    }
}
