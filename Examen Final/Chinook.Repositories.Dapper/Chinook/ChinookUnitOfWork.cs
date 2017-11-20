using Chinook.UnitOfWork;
using Chinook.Repositories.Chinook;

namespace Chinook.Repositories.Dapper.Chinook
{
    public class ChinookUnitOfWork : IUnitOfWork
    {
        public ChinookUnitOfWork(string connectionString)
        {
            Albums = new AlbumRepository(connectionString);
            Artists =new ArtistRepository(connectionString);
            Customers =new  CustomerRepository(connectionString);
            Employees =new EmployeeRepository(connectionString);
            Genres =new GenreRepository(connectionString);
            InvoiceLines =new InvoiceLineRepository(connectionString);
            Invoices =new InvoiceRepository(connectionString);
            MediaTypes =new MediaTypeRepository(connectionString);
            Playlists =new PlaylistRepository(connectionString);
            PlaylistTracks =new PlaylistTrackRepository(connectionString);
            Tracks =new TrackRepository(connectionString);
            Users = new UserRepository(connectionString);
        }

        public IAlbumRepository Albums { get; private set; }

        public IArtistRepository Artists { get; private set; }

        public ICustomerRepository Customers { get; private set; }

        public IEmployeeRepository Employees { get; private set; }

        public IGenreRepository Genres { get; private set; }

        public IInvoiceLineRepository InvoiceLines { get; private set; }

        public IInvoiceRepository Invoices { get; private set; }

        public IMediaTypeRepository MediaTypes { get; private set; }

        public IPlaylistRepository Playlists { get; private set; }

        public IPlaylistTrackRepository PlaylistTracks { get; private set; }

        public ITrackRepository Tracks { get; private set; }

        public IUserRepository Users { get; private set; }
    }
}
