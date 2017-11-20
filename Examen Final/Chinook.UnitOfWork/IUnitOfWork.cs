using Chinook.Repositories.Chinook;

namespace Chinook.UnitOfWork
{
    public interface IUnitOfWork
    {
        IAlbumRepository Albums { get; }
        IArtistRepository Artists { get; }
        ICustomerRepository Customers { get; }
        IEmployeeRepository Employees { get; }
        IGenreRepository Genres { get; }
        IInvoiceLineRepository InvoiceLines { get; }
        IInvoiceRepository Invoices { get; }
        IMediaTypeRepository MediaTypes { get; }
        IPlaylistRepository Playlists { get; }
        IPlaylistTrackRepository PlaylistTracks { get; }
        ITrackRepository Tracks { get; }
        IUserRepository Users { get; }
    }
}
