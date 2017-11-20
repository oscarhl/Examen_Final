using Chinook.Models;
using Chinook.Repositories.Chinook;
using Chinook.UnitOfWork;
using Moq;
using Ploeh.AutoFixture;
using System.Collections.Generic;
using System.Linq;

namespace Chinook.ModData
{
    public class UnitOfWorkMoqData
    {
        private List<Album> _albums;
        private List<Artist> _artists;
        private List<Customer> _customers;
        private List<Employee> _employees;
        private List<Genre> _genres;
        private List<Invoice> _invoices;
        private List<InvoiceLine> _invoiceLines;
        private List<MediaType> _mediaTypes;
        private List<Playlist> _playlists;
        private List<PlaylistTrack> _playlistTracks;
        private List<Track> _tracks;

        public UnitOfWorkMoqData()
        {
            _albums = Albums();
            _artists = Artists();
            _customers = Customers();
            _employees = Employees();
            _genres = Genres();
            _invoices = Invoices();
            _invoiceLines = InvoiceLines();
            _mediaTypes = MediaTypes();
            _playlists = Playlists();
            _playlistTracks = PlaylistTracks();
            _tracks = Tracks();

        }
        
        public IUnitOfWork GetInstante()
        {
            var mocked = new Mock<IUnitOfWork>();
            mocked.Setup(u => u.Albums).Returns(AlbumRepositoryMocked());
            mocked.Setup(u => u.Artists).Returns(ArtistRepositoryMocked());
            mocked.Setup(u => u.Customers).Returns(CustomerRepositoryMocked());
            mocked.Setup(u => u.Employees).Returns(EmployeeRepositoryMocked());
            mocked.Setup(u => u.Genres).Returns(GenreRepositoryMocked());
            mocked.Setup(u => u.Invoices).Returns(InvoiceRepositoryMocked());
            mocked.Setup(u => u.InvoiceLines).Returns(InvoiceLineRepositoryMocked());
            mocked.Setup(u => u.MediaTypes).Returns(MediaTypeRepositoryMocked());
            mocked.Setup(u => u.Playlists).Returns(PlaylistRepositoryMocked());
            mocked.Setup(u => u.PlaylistTracks).Returns(PlaylistTrackRepositoryMocked());
            mocked.Setup(u => u.Tracks).Returns(TrackRepositoryMocked());

            return mocked.Object;
        }

        private IAlbumRepository AlbumRepositoryMocked()
        {
            var AlbumMocked = new Mock<IAlbumRepository>();

            AlbumMocked.Setup(c => c.GetList()).Returns(_albums);

            AlbumMocked.Setup(c =>
            c.Insert(It.IsAny<Album>()))
            .Callback<Album>((c) => _albums.Add(c)).Returns<Album>(c => c.AlbumId);

            AlbumMocked.Setup(c =>
            c.Update(It.IsAny<Album>())).Callback<Album>((c) =>
            {
                _albums.RemoveAll(cus => cus.AlbumId == c.AlbumId);
                _albums.Add(c);
            })
            .Returns(true);

            AlbumMocked.Setup(c => c.Delete(It.IsAny<Album>()))
            .Callback<Album>((c) => _albums.RemoveAll(cus => cus.AlbumId == c.AlbumId))
            .Returns(true);

            AlbumMocked.Setup(c => c.GetById(It.IsAny<int>()))
            .Returns((int id) => _albums.FirstOrDefault(cus => cus.AlbumId == id));

            return AlbumMocked.Object;

        }

        private IArtistRepository ArtistRepositoryMocked()
        {
            var ArtistMocked = new Mock<IArtistRepository>();

            ArtistMocked.Setup(c => c.GetList()).Returns(_artists);

            ArtistMocked.Setup(c =>
            c.Insert(It.IsAny<Artist>()))
            .Callback<Artist>((c) => _artists.Add(c)).Returns<Artist>(c => c.ArtistId);

            ArtistMocked.Setup(c =>
            c.Update(It.IsAny<Artist>())).Callback<Artist>((c) =>
            {
                _artists.RemoveAll(cus => cus.ArtistId == c.ArtistId);
                _artists.Add(c);
            })
            .Returns(true);

            ArtistMocked.Setup(c => c.Delete(It.IsAny<Artist>()))
            .Callback<Artist>((c) => _artists.RemoveAll(cus => cus.ArtistId == c.ArtistId))
            .Returns(true);

            ArtistMocked.Setup(c => c.GetById(It.IsAny<int>()))
            .Returns((int id) => _artists.FirstOrDefault(cus => cus.ArtistId == id));

            return ArtistMocked.Object;

        }

        private ICustomerRepository CustomerRepositoryMocked()
        {
            var CustomerMocked = new Mock<ICustomerRepository>();

            CustomerMocked.Setup(c => c.GetList()).Returns(_customers);

            CustomerMocked.Setup(c =>
            c.Insert(It.IsAny<Customer>()))
            .Callback<Customer>((c) => _customers.Add(c)).Returns<Customer>(c => c.CustomerId);

            CustomerMocked.Setup(c =>
            c.Update(It.IsAny<Customer>())).Callback<Customer>((c) =>
            {
                _customers.RemoveAll(cus => cus.CustomerId == c.CustomerId);
                _customers.Add(c);
            })
            .Returns(true);

            CustomerMocked.Setup(c => c.Delete(It.IsAny<Customer>()))
            .Callback<Customer>((c) => _customers.RemoveAll(cus => cus.CustomerId == c.CustomerId))
            .Returns(true);

            CustomerMocked.Setup(c => c.GetById(It.IsAny<int>()))
            .Returns((int id) => _customers.FirstOrDefault(cus => cus.CustomerId == id));

            return CustomerMocked.Object;

        }

        private IEmployeeRepository EmployeeRepositoryMocked()
        {
            var EmployeeMocked = new Mock<IEmployeeRepository>();

            EmployeeMocked.Setup(c => c.GetList()).Returns(_employees);

            EmployeeMocked.Setup(c =>
            c.Insert(It.IsAny<Employee>()))
            .Callback<Employee>((c) => _employees.Add(c)).Returns<Employee>(c => c.EmployeeId);

            EmployeeMocked.Setup(c =>
            c.Update(It.IsAny<Employee>())).Callback<Employee>((c) =>
            {
                _employees.RemoveAll(cus => cus.EmployeeId == c.EmployeeId);
                _employees.Add(c);
            })
            .Returns(true);

            EmployeeMocked.Setup(c => c.Delete(It.IsAny<Employee>()))
            .Callback<Employee>((c) => _employees.RemoveAll(cus => cus.EmployeeId == c.EmployeeId))
            .Returns(true);

            EmployeeMocked.Setup(c => c.GetById(It.IsAny<int>()))
            .Returns((int id) => _employees.FirstOrDefault(cus => cus.EmployeeId == id));

            return EmployeeMocked.Object;

        }

        private IGenreRepository GenreRepositoryMocked()
        {
            var GenreMocked = new Mock<IGenreRepository>();

            GenreMocked.Setup(c => c.GetList()).Returns(_genres);

            GenreMocked.Setup(c =>
            c.Insert(It.IsAny<Genre>()))
            .Callback<Genre>((c) => _genres.Add(c)).Returns<Genre>(c => c.GenreId);

            GenreMocked.Setup(c =>
            c.Update(It.IsAny<Genre>())).Callback<Genre>((c) =>
            {
                _genres.RemoveAll(cus => cus.GenreId == c.GenreId);
                _genres.Add(c);
            })
            .Returns(true);

            GenreMocked.Setup(c => c.Delete(It.IsAny<Genre>()))
            .Callback<Genre>((c) => _genres.RemoveAll(cus => cus.GenreId == c.GenreId))
            .Returns(true);

            GenreMocked.Setup(c => c.GetById(It.IsAny<int>()))
            .Returns((int id) => _genres.FirstOrDefault(cus => cus.GenreId == id));

            return GenreMocked.Object;

        }

        private IInvoiceLineRepository InvoiceLineRepositoryMocked()
        {
            var InvoiceLineMocked = new Mock<IInvoiceLineRepository>();

            InvoiceLineMocked.Setup(c => c.GetList()).Returns(_invoiceLines);

            InvoiceLineMocked.Setup(c =>
            c.Insert(It.IsAny<InvoiceLine>()))
            .Callback<InvoiceLine>((c) => _invoiceLines.Add(c)).Returns<InvoiceLine>(c => c.InvoiceLineId);

            InvoiceLineMocked.Setup(c =>
            c.Update(It.IsAny<InvoiceLine>())).Callback<InvoiceLine>((c) =>
            {
                _invoiceLines.RemoveAll(cus => cus.InvoiceLineId == c.InvoiceLineId);
                _invoiceLines.Add(c);
            })
            .Returns(true);

            InvoiceLineMocked.Setup(c => c.Delete(It.IsAny<InvoiceLine>()))
            .Callback<InvoiceLine>((c) => _invoiceLines.RemoveAll(cus => cus.InvoiceLineId == c.InvoiceLineId))
            .Returns(true);

            InvoiceLineMocked.Setup(c => c.GetById(It.IsAny<int>()))
            .Returns((int id) => _invoiceLines.FirstOrDefault(cus => cus.InvoiceLineId == id));

            return InvoiceLineMocked.Object;

        }

        private IInvoiceRepository InvoiceRepositoryMocked()
        {
            var InvoiceMocked = new Mock<IInvoiceRepository>();

            InvoiceMocked.Setup(c => c.GetList()).Returns(_invoices);

            InvoiceMocked.Setup(c =>
            c.Insert(It.IsAny<Invoice>()))
            .Callback<Invoice>((c) => _invoices.Add(c)).Returns<Invoice>(c => c.InvoiceId);

            InvoiceMocked.Setup(c =>
            c.Update(It.IsAny<Invoice>())).Callback<Invoice>((c) =>
            {
                _invoices.RemoveAll(cus => cus.InvoiceId == c.InvoiceId);
                _invoices.Add(c);
            })
            .Returns(true);

            InvoiceMocked.Setup(c => c.Delete(It.IsAny<Invoice>()))
            .Callback<Invoice>((c) => _invoices.RemoveAll(cus => cus.InvoiceId == c.InvoiceId))
            .Returns(true);

            InvoiceMocked.Setup(c => c.GetById(It.IsAny<int>()))
            .Returns((int id) => _invoices.FirstOrDefault(cus => cus.InvoiceId == id));

            return InvoiceMocked.Object;

        }

        private IMediaTypeRepository MediaTypeRepositoryMocked()
        {
            var MediaTypeMocked = new Mock<IMediaTypeRepository>();

            MediaTypeMocked.Setup(c => c.GetList()).Returns(_mediaTypes);

            MediaTypeMocked.Setup(c =>
            c.Insert(It.IsAny<MediaType>()))
            .Callback<MediaType>((c) => _mediaTypes.Add(c)).Returns<MediaType>(c => c.MediaTypeId);

            MediaTypeMocked.Setup(c =>
            c.Update(It.IsAny<MediaType>())).Callback<MediaType>((c) =>
            {
                _mediaTypes.RemoveAll(cus => cus.MediaTypeId == c.MediaTypeId);
                _mediaTypes.Add(c);
            })
            .Returns(true);

            MediaTypeMocked.Setup(c => c.Delete(It.IsAny<MediaType>()))
            .Callback<MediaType>((c) => _mediaTypes.RemoveAll(cus => cus.MediaTypeId == c.MediaTypeId))
            .Returns(true);

            MediaTypeMocked.Setup(c => c.GetById(It.IsAny<int>()))
            .Returns((int id) => _mediaTypes.FirstOrDefault(cus => cus.MediaTypeId == id));

            return MediaTypeMocked.Object;

        }

        private IPlaylistRepository PlaylistRepositoryMocked()
        {
            var PlaylistMocked = new Mock<IPlaylistRepository>();

            PlaylistMocked.Setup(c => c.GetList()).Returns(_playlists);

            PlaylistMocked.Setup(c =>
            c.Insert(It.IsAny<Playlist>()))
            .Callback<Playlist>((c) => _playlists.Add(c)).Returns<Playlist>(c => c.PlaylistId);

            PlaylistMocked.Setup(c =>
            c.Update(It.IsAny<Playlist>())).Callback<Playlist>((c) =>
            {
                _playlists.RemoveAll(cus => cus.PlaylistId == c.PlaylistId);
                _playlists.Add(c);
            })
            .Returns(true);

            PlaylistMocked.Setup(c => c.Delete(It.IsAny<Playlist>()))
            .Callback<Playlist>((c) => _playlists.RemoveAll(cus => cus.PlaylistId == c.PlaylistId))
            .Returns(true);

            PlaylistMocked.Setup(c => c.GetById(It.IsAny<int>()))
            .Returns((int id) => _playlists.FirstOrDefault(cus => cus.PlaylistId == id));

            return PlaylistMocked.Object;

        }

        private IPlaylistTrackRepository PlaylistTrackRepositoryMocked()
        {
            var PlaylistTrackMocked = new Mock<IPlaylistTrackRepository>();

            PlaylistTrackMocked.Setup(c => c.GetList()).Returns(_playlistTracks);

            PlaylistTrackMocked.Setup(c =>
            c.Insert(It.IsAny<PlaylistTrack>()))
            .Callback<PlaylistTrack>((c) => _playlistTracks.Add(c)).Returns<PlaylistTrack>(c => c.PlaylistId);

            PlaylistTrackMocked.Setup(c =>
            c.Update(It.IsAny<PlaylistTrack>())).Callback<PlaylistTrack>((c) =>
            {
                _playlistTracks.RemoveAll(cus => cus.PlaylistId == c.PlaylistId);
                _playlistTracks.Add(c);
            })
            .Returns(true);

            PlaylistTrackMocked.Setup(c => c.Delete(It.IsAny<PlaylistTrack>()))
            .Callback<PlaylistTrack>((c) => _playlistTracks.RemoveAll(cus => cus.PlaylistId == c.PlaylistId))
            .Returns(true);

            PlaylistTrackMocked.Setup(c => c.GetById(It.IsAny<int>()))
            .Returns((int id) => _playlistTracks.FirstOrDefault(cus => cus.PlaylistId == id));

            return PlaylistTrackMocked.Object;

        }

        private ITrackRepository TrackRepositoryMocked()
        {
            var TrackMocked = new Mock<ITrackRepository>();

            TrackMocked.Setup(c => c.GetList()).Returns(_tracks);

            TrackMocked.Setup(c =>
            c.Insert(It.IsAny<Track>()))
            .Callback<Track>((c) => _tracks.Add(c)).Returns<Track>(c => c.TrackId);

            TrackMocked.Setup(c =>
            c.Update(It.IsAny<Track>())).Callback<Track>((c) =>
            {
                _tracks.RemoveAll(cus => cus.TrackId == c.TrackId);
                _tracks.Add(c);
            })
            .Returns(true);

            TrackMocked.Setup(c => c.Delete(It.IsAny<Track>()))
            .Callback<Track>((c) => _tracks.RemoveAll(cus => cus.TrackId == c.TrackId))
            .Returns(true);

            TrackMocked.Setup(c => c.GetById(It.IsAny<int>()))
            .Returns((int id) => _tracks.FirstOrDefault(cus => cus.TrackId == id));

            return TrackMocked.Object;

        }

        private List<Album> Albums()
        {
            var fixture = new Fixture();
            var albums = fixture.CreateMany<Album>(100).ToList();
            for (int i = 0; i < 50; i++)
            {
                albums[i].AlbumId = i + 1;
                
                albums[i].ArtistId = i + 1;              
            }
            return albums;
        }

        private List<Artist> Artists()
        {
            var fixture = new Fixture();
            var artists = fixture.CreateMany<Artist>(100).ToList();
            for (int i = 0; i < 50; i++)
            {
                artists[i].ArtistId = i + 1;
            }
            return artists;
        }

        private List<Customer> Customers()
        {
            var fixture = new Fixture();
            var customers = fixture.CreateMany<Customer>(100).ToList();
            for (int i = 0; i < 50; i++)
            {
                customers[i].CustomerId = i + 1;
            }
            return customers;
        }

        private List<Employee> Employees()
        {
            var fixture = new Fixture();
            var employees = fixture.CreateMany<Employee>(100).ToList();
            for (int i = 0; i < 50; i++)
            {
                employees[i].EmployeeId = i + 1;
            }
            return employees;
        }

        private List<Genre> Genres()
        {
            var fixture = new Fixture();
            var genres = fixture.CreateMany<Genre>(100).ToList();
            for (int i = 0; i < 50; i++)
            {
                genres[i].GenreId = i + 1;
            }
            return genres;
        }

        private List<Invoice> Invoices()
        {
            var fixture = new Fixture();
            var invoices = fixture.CreateMany<Invoice>(100).ToList();
            for (int i = 0; i < 50; i++)
            {
                invoices[i].InvoiceId = i + 1;
            }
            return invoices;
        }

        private List<InvoiceLine> InvoiceLines()
        {
            var fixture = new Fixture();
            var invoiceLines = fixture.CreateMany<InvoiceLine>(100).ToList();
            for (int i = 0; i < 50; i++)
            {
                invoiceLines[i].InvoiceLineId = i + 1;
             
            }
            return invoiceLines;
        }

        private List<MediaType> MediaTypes()
        {
            var fixture = new Fixture();
            var mediaTypes = fixture.CreateMany<MediaType>(100).ToList();
            for (int i = 0; i < 50; i++)
            {
                mediaTypes[i].MediaTypeId = i + 1;
            }
            return mediaTypes;
        }

        private List<Playlist> Playlists()
        {
            var fixture = new Fixture();
            var playlists = fixture.CreateMany<Playlist>(100).ToList();
            for (int i = 0; i < 50; i++)
            {
                playlists[i].PlaylistId = i + 1;
            }
            return playlists;
        }

        private List<PlaylistTrack> PlaylistTracks()
        {
            var fixture = new Fixture();
            var playlistTracks = fixture.CreateMany<PlaylistTrack>(100).ToList();
            for (int i = 0; i < 50; i++)
            {
                playlistTracks[i].PlaylistId = i + 1;
                
            }
            return playlistTracks;
        }

        private List<Track> Tracks()
        {
            var fixture = new Fixture();
            var tracks = fixture.CreateMany<Track>(100).ToList();
            for (int i = 0; i < 50; i++)
            {
                tracks[i].TrackId = i + 1;
                      
            }
            return tracks;
        }


    }
}
