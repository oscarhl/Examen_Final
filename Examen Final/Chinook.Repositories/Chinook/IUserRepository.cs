using Chinook.Models;

namespace Chinook.Repositories.Chinook
{
    public interface IUserRepository : IRepository<User>
    {
        User ValidaterUser(string email, string passwork);
    }
}
