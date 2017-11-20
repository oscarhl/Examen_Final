using Chinook.Models;
using System.Collections.Generic;

namespace Chinook.Repositories.Chinook
{
    public interface ICustomerRepository : IRepository<Customer>
    {
        IEnumerable<Customer> PagedList(int startRow, int endRow);

        int Count();
    }
}
