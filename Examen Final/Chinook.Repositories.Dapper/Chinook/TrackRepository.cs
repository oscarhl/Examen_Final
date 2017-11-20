using Chinook.Models;
using Chinook.Repositories.Chinook;
using Dapper;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace Chinook.Repositories.Dapper.Chinook
{
    public class TrackRepository : Repository<Track>, ITrackRepository
    {
        public TrackRepository(string connectionString) : base(connectionString)
        {
        }

        public int Count()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return connection.ExecuteScalar<int>("SELECT Count(*) FROM dbo.Track");

            }
        }

        public IEnumerable<Track> PagedList(int startRow, int endRow)
        {
            if (startRow >= endRow) return new List<Track>();
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@startRow", startRow);
                parameters.Add("@endRow", endRow);
                return
               connection.Query<Track>("dbo.TrackPagedList",
                parameters,
               commandType:
               System.Data.CommandType.StoredProcedure);
            }
        }
    }
}
