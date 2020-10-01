using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker.API.Common
{
    public class ItemNotFoundException : Exception
    {
        public ItemNotFoundException(string exception): base(exception)
        {

        }
    }
}
