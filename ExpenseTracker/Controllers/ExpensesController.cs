using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTRacker.Controllers
{
    [Route("api/expenses")]
    [ApiController]
    public class ExpensesController: ControllerBase
    {
        private readonly IExpenseService _expenseService;
        public ExpensesController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        // GET: api/<ExpensesController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
        {
            return Ok(await _expenseService.Search());
        }

        // GET api/<ExpensesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> Get(long id)
        {
            var expense = await _expenseService.Get(id);
            if (null == expense)
                return NotFound();
            return Ok(expense);
        }

        // POST api/<ExpensesController>
        [HttpPost]
        public async Task<ActionResult<Expense>> PostExpense(Expense expense)
        {
            if (ModelState.IsValid) 
            {
                var newExpense = await _expenseService.Create(expense);
                if(newExpense != null)
                    return Created(newExpense.Id?.ToString(), newExpense);
            }
            return BadRequest();
        }

        // PUT api/<ExpensesController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] Expense expense)
        {
            if (expense.Id.HasValue && id != expense.Id)
            {
                return BadRequest();
            }
            await _expenseService.Update(id, expense);
            return NoContent();
        }

        // DELETE api/<ExpensesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteExpense(int id)
        {
            await _expenseService.Delete(id);
            return Ok();
        }

        // GET: api/<ExpensesController>/expenseTypes
        [Route("expenseTypes")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseType>>> GetExpenseTypes()
        {
            return Ok(Enum.GetValues(typeof(ExpenseType)));
        }

        // GET: api/<ExpensesController>/reports/byType
        [Route("reports/byType")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseType>>> GetExpenseReportByType()
        {
            return Ok(await _expenseService.GetExpensesByType());
        }
    }
}
