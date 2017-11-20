using Chinook.Models;
using Chinook.Repositories.Chinook;
using Dapper;
using System.Data.SqlClient;

namespace Chinook.Repositories.Dapper.Chinook
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(string connectionString) : base(connectionString)
        {
        }

        public User ValidaterUser(string email, string passwork)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@email", email);
                parameters.Add("@password", passwork);

                return connection.QueryFirst<User>(
                    "dbo.ValidateUser",
                    parameters,
                    commandType: System.Data.CommandType.StoredProcedure);

            }
        }
    }
}
